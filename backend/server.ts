import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import bcrypt from "bcryptjs";
import { db } from "./src/db";
import { ChildrenController } from "./src/modules/children/children.controller";
import { GroupsController } from "./src/modules/groups/groups.controller";
import { StaffController } from "./src/modules/staff/staff.controller";
import { HealthController } from "./src/modules/health/health.controller";
import { OperationsRepository } from "./src/modules/operations/operations.repository";
import crypto from "crypto";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

// Helper for logging operations
const logOperation = (type: string, entity: string, name: string, desc: string) => {
  const id = crypto.randomUUID();
  db.run('INSERT INTO operations_log (id, operation_type, entity_type, entity_name, description) VALUES (?, ?, ?, ?, ?)',
    [id, type, entity, name, desc]);
};

app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Fayl yuklanmadi" });
  const fileUrl = `http://localhost:3001/uploads/${req.file.filename}`;
  logOperation('UPLOAD', 'FILE', req.file.filename, 'Yangi fayl yuklandi');
  res.json({ url: fileUrl });
});

app.post("/api/auth/login", (req, res) => {
  const { login, password } = req.body;
  db.get('SELECT * FROM users WHERE login = ?', [login], async (err, user: any) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: "Login yoki parol noto'g'ri" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Login yoki parol noto'g'ri" });

    logOperation('LOGIN', 'USER', user.full_name, 'Tizimga kirildi (Xodim)');
    res.json({
      id: user.id,
      login: user.login,
      role: user.role,
      full_name: user.full_name
    });
  });
});

app.post("/api/auth/parent-login", (req, res) => {
  const { login, password } = req.body;
  db.get('SELECT pa.*, c.id as child_id, c.first_name || " " || c.last_name as child_name FROM parent_accounts pa LEFT JOIN children c ON c.parent_account_id = pa.id WHERE pa.login = ?', [login], async (err, account: any) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!account) return res.status(401).json({ error: "Login yoki parol noto'g'ri" });

    const match = await bcrypt.compare(password, account.password_hash);
    if (!match) return res.status(401).json({ error: "Login yoki parol noto'g'ri" });

    logOperation('LOGIN', 'PARENT', account.child_name || account.login, 'Tizimga kirildi (Ota-ona)');
    res.json({
      id: account.id,
      login: account.login,
      role: 'PARENT',
      full_name: account.child_name || 'Valiahd',
      childId: account.child_id
    });
  });
});

app.get("/api/parent-portal/child-info/:childId", (req, res) => {
  const { childId } = req.params;
  db.get(`
    SELECT 
      c.*,
      f.full_name as fatherName, f.phone as fatherPhone, f.passport_no as fatherPassport, f.workplace as fatherWorkplace,
      m.full_name as motherName, m.phone as motherPhone, m.passport_no as motherPassport, m.workplace as motherWorkplace,
      g.name as childGroup
    FROM children c
    LEFT JOIN parents f ON c.father_id = f.id
    LEFT JOIN parents m ON c.mother_id = m.id
    LEFT JOIN groups g ON c.group_id = g.id
    WHERE c.id = ?
  `, [childId], (err, row) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(row);
  });
});

app.put("/api/parent-portal/profile/:childId", async (req, res) => {
  const { childId } = req.params;
  const { address, photo_url, father, mother } = req.body;

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    // 1. Update child address and photo_url
    db.run('UPDATE children SET address = ?, photo_url = ? WHERE id = ?', [address, photo_url, childId], function(err) {
      if (err) {
        db.run("ROLLBACK");
        return res.status(500).json({ error: err.message });
      }
    });

    // 2. Get father and mother IDs
    db.get('SELECT first_name, last_name, father_id, mother_id FROM children WHERE id = ?', [childId], (err, child: any) => {
      if (err || !child) {
        db.run("ROLLBACK");
        return res.status(500).json({ error: err?.message || "Bola topilmadi" });
      }

      // 3. Update father data
      db.run('UPDATE parents SET workplace = ?, phone = ?, passport_no = ? WHERE id = ?', 
        [father.workplace, father.phone, father.passport_no, child.father_id], (err) => {
          if (err) {
            db.run("ROLLBACK");
            return res.status(500).json({ error: err.message });
          }
        }
      );

      // 4. Update mother data
      db.run('UPDATE parents SET workplace = ?, phone = ?, passport_no = ? WHERE id = ?', 
        [mother.workplace, mother.phone, mother.passport_no, child.mother_id], (err) => {
          if (err) {
            db.run("ROLLBACK");
            return res.status(500).json({ error: err.message });
          }
          
          db.run("COMMIT", (err) => {
            if (err) res.status(500).json({ error: err.message });
            else {
              logOperation('UPDATE', 'PROFILE', `${child.first_name} ${child.last_name}`, 'Profil ma\'lumotlari yangilandi');
              res.json({ success: true });
            }
          });
        }
      );
    });
  });
});

app.get("/api/parent-portal/full-data/:childId", async (req, res) => {
  const { childId } = req.params;
  
  const fetchAll = (sql: string, params: any[] = []) => new Promise((resolve) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.warn(`Query failed: ${sql}`, err.message);
        resolve([]); // Return empty array on error instead of rejecting
      } else {
        resolve(rows || []);
      }
    });
  });

  const fetchOne = (sql: string, params: any[]) => new Promise((resolve) => {
    db.get(sql, params, (err, row) => {
      if (err) resolve(null);
      else resolve(row);
    });
  });

  try {
    const [attendance, payments, health, vaccines, progress, pickups, documents] = await Promise.all([
      fetchAll('SELECT * FROM attendance WHERE child_id = ? ORDER BY date DESC LIMIT 30', [childId]),
      fetchAll('SELECT * FROM payments WHERE child_id = ? ORDER BY date DESC', [childId]),
      fetchAll('SELECT * FROM health_checks WHERE child_id = ? ORDER BY date DESC LIMIT 10', [childId]),
      fetchAll('SELECT * FROM vaccinations WHERE child_id = ?', [childId]),
      fetchAll('SELECT * FROM progress_reports WHERE child_id = ? ORDER BY date DESC', [childId]),
      fetchAll('SELECT * FROM authorized_pickups WHERE child_id = ?', [childId]),
      fetchAll('SELECT * FROM documents WHERE child_id = ?', [childId])
    ]);

    const child: any = await fetchOne('SELECT age_category, is_allergic FROM children WHERE id = ?', [childId]);
    
    // Default values if child not found
    const ageGroup = child?.age_category?.includes('1-3') ? '1-3' : '3-7';
    const dietType = child?.is_allergic ? 'DIETARY' : 'REGULAR';
    const today = new Date().toISOString().split('T')[0];

    const menu = await fetchAll('SELECT * FROM menus WHERE date = ? AND age_group = ? AND diet_type = ?', [today, ageGroup, dietType]);

    res.json({
      attendance,
      payments,
      health,
      vaccines,
      progress,
      pickups,
      documents,
      menu
    });
  } catch (err: any) {
    console.error("DEBUG: Parent portal full-data critical error:", err);
    res.status(500).json({ error: "Ma'lumotlarni yig'ishda ichki xatolik" });
  }
});

app.get("/api/parent-portal/menu/:childId/:date", async (req, res) => {
  const { childId, date } = req.params;
  
  try {
    const child: any = await new Promise((resolve) => {
      db.get('SELECT age_category, is_allergic FROM children WHERE id = ?', [childId], (err, row) => {
        resolve(row);
      });
    });

    if (!child) return res.status(404).json({ error: "Bola topilmadi" });

    const ageGroup = child.age_category?.includes('1-3') ? '1-3' : '3-7';
    const dietType = child.is_allergic ? 'DIETARY' : 'REGULAR';

    db.all('SELECT * FROM menus WHERE date = ? AND age_group = ? AND diet_type = ?', [date, ageGroup, dietType], (err, rows) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json(rows);
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const childrenController = new ChildrenController();
app.post("/api/children", childrenController.create);
app.get("/api/children", childrenController.getAll);
app.put("/api/children/:id", childrenController.update);
app.delete("/api/children/:id", childrenController.delete);

const groupsController = new GroupsController();
app.get("/api/groups", groupsController.getAll);
app.post("/api/groups", groupsController.create);
app.put("/api/groups/:id", groupsController.update);
app.delete("/api/groups/:id", groupsController.delete);

const staffController = new StaffController();
app.get("/api/staff", staffController.getAll);
app.post("/api/staff", staffController.create);
app.put("/api/staff/:id", staffController.update);
app.delete("/api/staff/:id", staffController.delete);

const healthController = new HealthController();
app.post("/api/health/batch", healthController.saveBatch);
app.get("/api/health/history/:groupId", healthController.getHistory);
app.get("/api/health/archive", healthController.getArchive);
app.get("/api/health/allergies", (req, res) => {
  db.all(`
    SELECT c.first_name, c.last_name, c.allergies, g.name as group_name
    FROM children c
    LEFT JOIN groups g ON c.group_id = g.id
    WHERE c.is_allergic = 1 OR (c.allergies IS NOT NULL AND c.allergies != '')
  `, [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.get("/api/attendance/today-stats", async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const { groupIds } = req.query;
  
  try {
    const stats: any = {
      total: 0,
      present: 0,
      absent: 0,
      checked: 0,
      notChecked: 0,
      sick: 0,
      healthy: 0,
      age1_3: 0,
      age3_7: 0,
      allergyCount: 0,
      late: 0
    };

    const fetchOne = (sql: string, params: any[] = []) => new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
    });

    let groupFilter = "";
    const params = [];
    if (groupIds) {
      const ids = (groupIds as string).split(',');
      groupFilter = `WHERE group_id IN (${ids.map(() => '?').join(',')})`;
      params.push(...ids);
    }

    const counts: any = await fetchOne(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN age_category LIKE '%1-3%' THEN 1 ELSE 0 END) as age1_3,
        SUM(CASE WHEN age_category LIKE '%3-7%' THEN 1 ELSE 0 END) as age3_7,
        SUM(CASE WHEN is_allergic = 1 THEN 1 ELSE 0 END) as allergyCount
      FROM children
      ${groupFilter}
    `, params);
    
    stats.total = counts?.total || 0;
    stats.age1_3 = counts?.age1_3 || 0;
    stats.age3_7 = counts?.age3_7 || 0;
    stats.allergyCount = counts?.allergyCount || 0;

    let attendanceFilter = "WHERE date = ?";
    const attendanceParams = [today];
    if (groupIds) {
      const ids = (groupIds as string).split(',');
      attendanceFilter += ` AND child_id IN (SELECT id FROM children WHERE group_id IN (${ids.map(() => '?').join(',')}))`;
      attendanceParams.push(...ids);
    }

    const attendance: any = await fetchOne(`
      SELECT 
        SUM(CASE WHEN status = 'PRESENT' THEN 1 ELSE 0 END) as present,
        SUM(CASE WHEN status = 'ABSENT' THEN 1 ELSE 0 END) as absent,
        SUM(CASE WHEN status = 'SICK' THEN 1 ELSE 0 END) as sick_attendance,
        SUM(CASE WHEN status = 'PRESENT' AND (arrival_time > '09:00:00') THEN 1 ELSE 0 END) as late
      FROM attendance
      ${attendanceFilter}
    `, attendanceParams);

    stats.present = attendance?.present || 0;
    stats.absent = attendance?.absent || 0;
    stats.late = attendance?.late || 0;
    const sickAttendance = attendance?.sick_attendance || 0;

    let healthFilter = "WHERE date = ?";
    const healthParams = [today];
    if (groupIds) {
      const ids = (groupIds as string).split(',');
      healthFilter += ` AND child_id IN (SELECT id FROM children WHERE group_id IN (${ids.map(() => '?').join(',')}))`;
      healthParams.push(...ids);
    }

    const health: any = await fetchOne(`
      SELECT 
        COUNT(*) as checked,
        SUM(CASE WHEN is_sick = 1 THEN 1 ELSE 0 END) as sick_health
      FROM health_checks
      ${healthFilter}
    `, healthParams);

    const approvedMenus: any = await fetchOne(`
      SELECT COUNT(*) as count FROM menus WHERE date = ? AND is_approved = 1
    `, [today]);

    stats.checked = health?.checked || 0;
    stats.approved_recipes = approvedMenus?.count || 0;
    stats.notChecked = stats.total - stats.checked;
    // Kasal bolalar = Davomatda kasal deb belgilanganlar + Hamshira kasal deb topganlar (takrorlanishni hisobga olmasdan, sodda jamlash)
    stats.sick = Math.max(sickAttendance, health?.sick_health || 0);
    stats.healthy = stats.checked - (health?.sick_health || 0);

    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const operationsRepo = new OperationsRepository();
app.get("/api/operations", async (req, res) => {
  const { days } = req.query;
  try {
    let operations;
    if (days && !isNaN(Number(days))) {
      operations = await operationsRepo.findRecent(Number(days));
    } else {
      operations = await operationsRepo.findAll(50);
    }
    res.json(operations);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/parents", (req, res) => {
  db.all(`
    SELECT 
      pa.id, 
      c.id as childId,
      c.first_name || ' ' || c.last_name as childName, 
      c.birth_certificate_number as childBirthCertificate,
      c.address,
      c.weight,
      c.height,
      c.allergies,
      c.medical_notes,
      f.full_name as fatherName, 
      f.phone as fatherPhone,
      f.passport_no as fatherPassport,
      f.workplace as fatherWorkplace,
      m.full_name as motherName, 
      m.phone as motherPhone,
      m.passport_no as motherPassport,
      m.workplace as motherWorkplace,
      g.name as childGroup,
      pa.login, 
      '********' as password
    FROM parent_accounts pa
    LEFT JOIN children c ON c.parent_account_id = pa.id
    LEFT JOIN parents f ON c.father_id = f.id
    LEFT JOIN parents m ON c.mother_id = m.id
    LEFT JOIN groups g ON c.group_id = g.id
    ORDER BY c.created_at DESC
  `, [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.put("/api/parents/:id", async (req, res) => {
  const { login, password } = req.body;
  const { id } = req.params;
  
  try {
    if (password && password !== '********') {
      const passwordHash = await bcrypt.hash(password, 10);
      db.run('UPDATE parent_accounts SET login = ?, password_hash = ? WHERE id = ?', [login, passwordHash, id], function(err) {
        if (err) {
          console.error("Update parent error:", err);
          return res.status(500).json({ error: err.message });
        }
        logOperation('SECURITY', 'CREDENTIALS', login, 'Login/Parol yangilandi');
        res.json({ success: true });
      });
    } else {
      db.run('UPDATE parent_accounts SET login = ? WHERE id = ?', [login, id], function(err) {
        if (err) {
          console.error("Update parent error:", err);
          return res.status(500).json({ error: err.message });
        }
        logOperation('SECURITY', 'LOGIN_ONLY', login, 'Faqat login yangilandi');
        res.json({ success: true });
      });
    }
  } catch (err: any) {
    console.error("Update parent catch error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/parents/:id", (req, res) => {
  const { id } = req.params;
  
  db.run('UPDATE children SET parent_account_id = NULL WHERE parent_account_id = ?', [id], function(err) {
    if (err) {
      console.error("Error unlinking child from parent account:", err);
      return res.status(500).json({ error: err.message });
    }
    
    db.run('DELETE FROM parent_accounts WHERE id = ?', [id], function(err) {
      if (err) {
        console.error("Delete parent account error:", err);
        return res.status(500).json({ error: err.message });
      }
      logOperation('DELETE', 'PARENT_ACCOUNT', id, 'Ota-ona hisobi o\'chirildi');
      res.json({ success: true });
    });
  });
});

// Attendance API
app.get("/api/attendance/:groupId/:date", (req, res) => {
  const { groupId, date } = req.params;
  db.all('SELECT child_id, status, arrival_time FROM attendance WHERE child_id IN (SELECT id FROM children WHERE group_id = ?) AND date = ?', [groupId, date], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const attendanceMap = rows.reduce((acc: any, row: any) => {
      acc[row.child_id] = {
        status: row.status.toLowerCase(),
        arrival_time: row.arrival_time
      };
      return acc;
    }, {});
    res.json(attendanceMap);
  });
});

app.post("/api/attendance", (req, res) => {
  const { date, group_name, attendance_data, reason } = req.body;
  const isoDate = date || new Date().toISOString().split('T')[0];

  const childIds = Object.keys(attendance_data);
  let completed = 0;
  let hasError = false;

  if (childIds.length === 0) return res.json({ success: true });

  childIds.forEach(childId => {
    const data = attendance_data[childId];
    // Support both simple string status or object with status and arrival_time
    const status = (typeof data === 'string' ? data : data.status).toUpperCase();
    const explicitArrivalTime = typeof data === 'object' ? data.arrival_time : null;

    const currentTime = new Date().toLocaleTimeString('en-GB', { hour12: false });
    const finalArrivalTime = status === 'PRESENT' ? (explicitArrivalTime || currentTime) : null;

    db.run(`
      INSERT INTO attendance (id, child_id, date, status, reason, arrival_time)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(child_id, date) DO UPDATE SET
        status = excluded.status,
        reason = excluded.reason,
        arrival_time = excluded.arrival_time
    `, [crypto.randomUUID(), childId, isoDate, status, reason || '', finalArrivalTime], function(err) {
      if (err && !hasError) {
        hasError = true;
        return res.status(500).json({ error: err.message });
      }
      completed++;
      if (completed === childIds.length && !hasError) {
        logOperation('ATTENDANCE', 'SAVE', isoDate, `${childIds.length} ta bola uchun davomat saqlandi`);
        res.json({ success: true });
      }
    });
  });
});
app.post("/api/menus/approve-today", (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  db.run('UPDATE menus SET is_approved = 1 WHERE date = ?', [today], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    logOperation('MENU', 'APPROVE', today, 'Bugungi ovqat retseptlari admin tomonidan tasdiqlandi');
    res.json({ success: true, updated: this.changes });
  });
});

// Dishes API
app.get("/api/dishes", (req, res) => {
  db.all('SELECT * FROM dishes ORDER BY name ASC', [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post("/api/dishes", (req, res) => {
  const { name, image, kcal, iron, carbs, vitamins } = req.body;
  const id = crypto.randomUUID();
  db.run(`
    INSERT INTO dishes (id, name, image, kcal, iron, carbs, vitamins)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [id, name, image, kcal, iron, carbs, vitamins], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else {
      logOperation('CREATE', 'DISH', name, 'Yangi taom qo\'shildi');
      res.json({ success: true, id });
    }
  });
});

app.delete("/api/dishes/:id", (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM dishes WHERE id = ?', [id], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else {
      logOperation('DELETE', 'DISH', id, 'Taom o\'chirildi');
      res.json({ success: true });
    }
  });
});

// Menu API
app.get("/api/menu/:date", (req, res) => {
  const { date } = req.params;
  db.all('SELECT * FROM menus WHERE date = ?', [date], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post("/api/menu", (req, res) => {
  const { date, meal_name, meal_type, nutrition, age_group, diet_type, image_url } = req.body;
  const id = crypto.randomUUID();
  db.run(`
    INSERT INTO menus (id, date, meal_name, meal_type, age_group, diet_type, iron, carbohydrates, vitamins, calories, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(date, meal_type, age_group, diet_type) DO UPDATE SET
      meal_name = excluded.meal_name,
      iron = excluded.iron,
      carbohydrates = excluded.carbohydrates,
      vitamins = excluded.vitamins,
      calories = excluded.calories,
      image_url = excluded.image_url
  `, [
    id, date, meal_name, meal_type, 
    age_group || '3-7', 
    diet_type || 'REGULAR', 
    nutrition.iron || 0, 
    nutrition.carbs || 0, 
    nutrition.vitamins || '', 
    nutrition.kcal || 0,
    image_url || ''
  ], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else {
      logOperation('MENU', 'SAVE', `${date} ${meal_type}`, 'Taomnoma yangilandi');
      res.json({ success: true, id });
    }
  });
});

// Kitchen API
app.get("/api/kitchen/tasks/:date", (req, res) => {
  const { date } = req.params;
  db.all(`
    SELECT kt.*, m.id as menu_id, m.meal_name, m.meal_type, m.age_group, m.diet_type 
    FROM menus m
    LEFT JOIN kitchen_tasks kt ON kt.menu_id = m.id
    WHERE m.date = ?
  `, [date], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post("/api/kitchen/tasks/:menuId/status", (req, res) => {
  const { menuId } = req.params;
  const { status, temperature, start_time, end_time, served_time } = req.body;
  const id = crypto.randomUUID();

  db.run(`
    INSERT INTO kitchen_tasks (id, menu_id, status, temperature, start_time, end_time, served_time)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(menu_id) DO UPDATE SET
      status = excluded.status,
      temperature = COALESCE(excluded.temperature, temperature),
      start_time = COALESCE(excluded.start_time, start_time),
      end_time = COALESCE(excluded.end_time, end_time),
      served_time = COALESCE(excluded.served_time, served_time)
  `, [id, menuId, status, temperature, start_time, end_time, served_time], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else {
      logOperation('KITCHEN', 'TASK_UPDATE', menuId, `Oshxona vazifasi holati: ${status}`);
      res.json({ success: true });
    }
  });
});

app.get("/api/inventory/transactions", (req, res) => {
  db.all(`
    SELECT t.*, p.name as product_name, p.unit, p.category
    FROM inventory_transactions t
    JOIN products p ON t.product_id = p.id
    ORDER BY t.date DESC, t.id DESC
    LIMIT 100
  `, [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.get("/api/inventory/products", (req, res) => {
  db.all('SELECT * FROM products', [], (err, products: any[]) => {
    if (err) return res.status(500).json({ error: err.message });
    
    db.all('SELECT * FROM inventory_batches', [], (err, batches: any[]) => {
      if (err) return res.status(500).json({ error: err.message });
      
      const productsWithBatches = products.map(p => ({
        ...p,
        batches: batches.filter(b => b.product_id === p.id).map(b => ({
          ...b,
          expiryDate: b.expiry_date, // Frontend camelCase compatibility
          receivedDate: b.received_date,
          batchNumber: b.batch_number,
          pricePerUnit: b.price_per_unit,
          totalPrice: b.total_price,
          storageLocation: b.storage_location,
          storageTemp: b.storage_temp
        }))
      }));
      res.json(productsWithBatches);
    });
  });
});

app.post("/api/inventory/products", (req, res) => {
  const { name, category, unit, brand, min_stock } = req.body;
  const id = crypto.randomUUID();
  db.run(`
    INSERT INTO products (id, name, category, unit, brand, min_stock)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [id, name, category, unit, brand, min_stock || 0], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else {
      logOperation('INVENTORY', 'PRODUCT_CREATE', name, 'Yangi mahsulot omborga qo\'shildi');
      res.json({ success: true, id });
    }
  });
});

app.put("/api/inventory/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, category, unit, brand, min_stock } = req.body;
  db.run(`
    UPDATE products SET name = ?, category = ?, unit = ?, brand = ?, min_stock = ?
    WHERE id = ?
  `, [name, category, unit, brand, min_stock, id], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else {
      logOperation('INVENTORY', 'PRODUCT_UPDATE', name, 'Mahsulot ma\'lumotlari yangilandi');
      res.json({ success: true });
    }
  });
});

app.post("/api/inventory/stock-in", (req, res) => {
  const { 
    product_id, batch_number, invoice_number, quantity, price_per_unit, 
    total_price, received_date, expiry_date, supplier, 
    storage_location, storage_temp, notes 
  } = req.body;
  
  const batchId = crypto.randomUUID();
  const transId = crypto.randomUUID();
  const date = received_date || new Date().toISOString().split('T')[0];

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    
    db.run(`
      INSERT INTO inventory_batches (
        id, product_id, batch_number, invoice_number, quantity, price_per_unit, 
        total_price, received_date, expiry_date, supplier, 
        storage_location, storage_temp, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      batchId, product_id, batch_number, invoice_number, quantity, price_per_unit,
      total_price, date, expiry_date, supplier,
      storage_location, storage_temp, notes
    ]);

    db.run(`
      INSERT INTO inventory_transactions (id, product_id, type, quantity, price, date, batch_id)
      VALUES (?, ?, 'IN', ?, ?, ?, ?)
    `, [transId, product_id, quantity, price_per_unit, date, batchId]);

    db.run("COMMIT", (err) => {
      if (err) res.status(500).json({ error: err.message });
      else {
        logOperation('INVENTORY', 'STOCK_IN', product_id, `${quantity} miqdorida mahsulot qabul qilindi`);
        res.json({ success: true, batchId });
      }
    });
  });
});

app.post("/api/inventory/stock-out", (req, res) => {
  const { product_id, quantity, date, reason } = req.body;
  const outDate = date || new Date().toISOString().split('T')[0];
  
  db.all('SELECT * FROM inventory_batches WHERE product_id = ? AND quantity > 0 ORDER BY expiry_date ASC, received_date ASC', [product_id], (err, batches: any[]) => {
    if (err) return res.status(500).json({ error: err.message });
    
    let remainingToOut = quantity;
    const updates: any[] = [];
    const transactions: any[] = [];

    for (const batch of batches) {
      if (remainingToOut <= 0) break;
      const amountFromBatch = Math.min(batch.quantity, remainingToOut);
      updates.push({ id: batch.id, newQty: batch.quantity - amountFromBatch });
      transactions.push({ 
        id: crypto.randomUUID(), 
        product_id, 
        type: 'OUT', 
        quantity: amountFromBatch, 
        price: batch.price_per_unit, 
        date: outDate, 
        batch_id: batch.id 
      });
      remainingToOut -= amountFromBatch;
    }

    if (remainingToOut > 0) {
      return res.status(400).json({ error: "Omborda yetarli mahsulot yo'q" });
    }

    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
      updates.forEach(u => {
        db.run('UPDATE inventory_batches SET quantity = ? WHERE id = ?', [u.newQty, u.id]);
      });
      transactions.forEach(t => {
        db.run(`
          INSERT INTO inventory_transactions (id, product_id, type, quantity, price, date, batch_id)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [t.id, t.product_id, t.type, t.quantity, t.price, t.date, t.batch_id]);
      });
      db.run("COMMIT", (err) => {
        if (err) res.status(500).json({ error: err.message });
        else {
          logOperation('INVENTORY', 'STOCK_OUT', product_id, `${quantity} miqdorida mahsulot chiqim qilindi`);
          res.json({ success: true });
        }
      });
    });
  });
});

// Lab Samples API
app.get("/api/lab/samples", (req, res) => {
  db.all('SELECT * FROM lab_samples ORDER BY timestamp DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const parsedRows = rows.map((row: any) => ({
      ...row,
      test_results: row.test_results ? JSON.parse(row.test_results) : null,
      storage_temp_history: row.storage_temp_history ? JSON.parse(row.storage_temp_history) : [],
      nutrition: row.nutrition ? JSON.parse(row.nutrition) : null
    }));
    res.json(parsedRows);
  });
});

app.post("/api/lab/samples", (req, res) => {
  const { 
    sample_id, dish_id, dish_name, batch_reference, date, 
    storage_location, storage_duration, status, lab_result, 
    risk_level, notes, test_results, storage_temp_history, 
    nutrition, created_by 
  } = req.body;
  
  const id = crypto.randomUUID();
  db.run(`
    INSERT INTO lab_samples (
      id, sample_id, dish_id, dish_name, batch_reference, date, 
      storage_location, storage_duration, status, lab_result, 
      risk_level, notes, test_results, storage_temp_history, 
      nutrition, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id, sample_id, dish_id, dish_name, batch_reference, date, 
    storage_location, storage_duration || 72, status, lab_result, 
    risk_level, notes, JSON.stringify(test_results), 
    JSON.stringify(storage_temp_history), JSON.stringify(nutrition), created_by
  ], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else {
      logOperation('LAB', 'SAMPLE_CREATE', dish_name, 'Laboratoriya namunasi olingandi');
      res.json({ success: true, id });
    }
  });
});

// Audits API
app.get("/api/audits", (req, res) => {
  db.all('SELECT * FROM audits ORDER BY created_at DESC', [], (err, audits: any[]) => {
    if (err) return res.status(500).json({ error: err.message });
    
    db.all('SELECT * FROM audit_items', [], (err, items: any[]) => {
      if (err) return res.status(500).json({ error: err.message });
      
      const fullAudits = audits.map(audit => ({
        ...audit,
        checklist_items: items.filter(item => item.audit_id === audit.id).map(it => ({
          ...it,
          result: it.result,
          question: it.question
        }))
      }));
      res.json(fullAudits);
    });
  });
});

app.post("/api/audits", (req, res) => {
  const { inspection_id, inspection_type, overall_result, severity, notes, created_by, status, checklist_items } = req.body;
  const audit_id = crypto.randomUUID();

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    db.run(`
      INSERT INTO audits (id, inspection_id, inspection_type, overall_result, severity, notes, created_by, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [audit_id, inspection_id, inspection_type, overall_result, severity, notes, created_by, status || 'OPEN']);

    if (checklist_items && Array.isArray(checklist_items)) {
      const stmt = db.prepare(`
        INSERT INTO audit_items (id, audit_id, question, result, note, severity)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      checklist_items.forEach((item: any) => {
        stmt.run(crypto.randomUUID(), audit_id, item.question, item.result, item.note, item.severity);
      });
      stmt.finalize();
    }

    db.run("COMMIT", (err) => {
      if (err) res.status(500).json({ error: err.message });
      else {
        logOperation('AUDIT', 'SAVE', inspection_type, `Inspeksiya natijasi: ${overall_result}`);
        res.json({ success: true, id: audit_id });
      }
    });
  });
});

// Finance API
app.get("/api/finance/transactions", (req, res) => {
  db.all('SELECT * FROM finance_transactions ORDER BY date DESC, created_at DESC', [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post("/api/finance/transactions", (req, res) => {
  const { date, category, item, amount, quantity, price_per_unit, type } = req.body;
  const id = crypto.randomUUID();
  db.run(`
    INSERT INTO finance_transactions (id, date, category, item, amount, quantity, price_per_unit, type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [id, date, category, item, amount, quantity, price_per_unit, type || 'EXPENSE'], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else {
      logOperation('FINANCE', type || 'EXPENSE', item, `${amount} so'mlik tranzaksiya`);
      res.json({ success: true, id });
    }
  });
});

// Supply API
app.get("/api/supply/orders", (req, res) => {
  db.all('SELECT * FROM supply_orders ORDER BY date DESC', [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else {
      const parsed = rows.map((row: any) => ({
        ...row,
        items: row.items ? JSON.parse(row.items) : []
      }));
      res.json(parsed);
    }
  });
});

app.post("/api/supply/orders", (req, res) => {
  const { order_id, vendor, amount, date, status, items } = req.body;
  const id = crypto.randomUUID();
  db.run(`
    INSERT INTO supply_orders (id, order_id, vendor, amount, date, status, items)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [id, order_id, vendor, amount, date, status, JSON.stringify(items)], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else {
      logOperation('SUPPLY', 'ORDER', vendor, `${amount} so'mlik buyurtma: ${status}`);
      res.json({ success: true, id });
    }
  });
});

app.get("/api/suppliers", (req, res) => {
  db.all('SELECT * FROM suppliers ORDER BY name ASC', [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post("/api/suppliers", (req, res) => {
  const { first_name, last_name, brand, phone, contact_user, telegram_link, type, score } = req.body;
  const id = crypto.randomUUID();
  const name = `${first_name} ${last_name}`.trim() || brand || 'Noma\'lum';
  
  db.run(`
    INSERT INTO suppliers (id, first_name, last_name, brand, name, type, score, phone, contact_user, telegram_link)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [id, first_name, last_name, brand, name, type || 'Ta\'minotchi', score || 5.0, phone, contact_user, telegram_link], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else {
      logOperation('SUPPLY', 'VENDOR_CREATE', name, 'Yangi ta\'minotchi qo\'shildi');
      res.json({ success: true, id });
    }
  });
});

// Required Products API
app.get("/api/supply/required-products", (req, res) => {
  db.all('SELECT * FROM required_products ORDER BY created_at DESC', [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post("/api/supply/required-products", (req, res) => {
  const { name, price, quantity, unit, brand, category } = req.body;
  const id = crypto.randomUUID();
  db.run(`
    INSERT INTO required_products (id, name, price, quantity, unit, brand, category)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [id, name, price, quantity, unit, brand, category], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else {
      logOperation('SUPPLY', 'REQUEST', name, `Mahsulot so'rovi: ${quantity} ${unit}`);
      res.json({ success: true, id });
    }
  });
});

// Messages System initialization
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id TEXT NOT NULL,
      receiver_id TEXT NOT NULL,
      text TEXT NOT NULL,
      sender_role TEXT NOT NULL,
      status TEXT DEFAULT 'sent',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Messaging API
app.get("/api/messages", (req, res) => {
  const { userId, contactId } = req.query;
  if (!userId || !contactId) return res.status(400).json({ error: "Missing parameters" });

  db.all(`
    SELECT * FROM messages 
    WHERE (sender_id = ? AND receiver_id = ?) 
       OR (sender_id = ? AND receiver_id = ?)
    ORDER BY created_at ASC
  `, [userId, contactId, contactId, userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const formattedMessages = rows.map((m: any) => ({
      id: m.id,
      senderId: m.sender_id,
      receiverId: m.receiver_id,
      text: m.text,
      time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: m.status,
      type: m.sender_id === userId ? 'sent' : 'received',
      senderRole: m.sender_role
    }));
    
    res.json(formattedMessages);
  });
});

app.post("/api/messages", (req, res) => {
  const { senderId, receiverId, text, senderRole } = req.body;
  
  db.run(`
    INSERT INTO messages (sender_id, receiver_id, text, sender_role)
    VALUES (?, ?, ?, ?)
  `, [senderId, receiverId, text, senderRole], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    const newMessage = {
      id: this.lastID,
      senderId,
      receiverId,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      senderRole
    };
    
    logOperation('MESSAGE', 'SEND', senderId, `Xabar yuborildi: ${text.substring(0, 20)}...`);
    res.json(newMessage);
  });
});

app.get("/api/messages/contacts", (req, res) => {
  const { parentId } = req.query;
  if (!parentId) return res.status(400).json({ error: "Missing parentId" });

  // 1. Find the teacher(s) for the child's group
  db.all(`
    SELECT 
      u.id, 
      u.full_name as name, 
      'teacher' as role
    FROM users u
    JOIN staff s ON s.user_id = u.id
    JOIN children c ON c.group_id = s.group_id
    WHERE c.parent_account_id = ?
  `, [parentId], (err, baseContacts: any[]) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (baseContacts.length === 0) {
      // Fallback if no specific teacher found
      baseContacts = [
        { id: 'teacher_1', name: 'Tarbiyachi', role: 'teacher' }
      ];
    }

    // Count unread messages for each contact
    db.all(`
      SELECT sender_id, COUNT(*) as unread 
      FROM messages 
      WHERE receiver_id = ? AND status != 'read' 
      GROUP BY sender_id
    `, [parentId], (err, counts: any[]) => {
      const updatedContacts = baseContacts.map(c => {
        const countObj = counts?.find(cnt => cnt.sender_id === c.id);
        return { 
          ...c, 
          unreadCount: countObj ? countObj.unread : 0,
          isOnline: true // Simplified for now
        };
      });
      res.json(updatedContacts);
    });
  });
});

app.put("/api/messages/read", (req, res) => {
  const { userId, contactId } = req.body;
  db.run(`
    UPDATE messages SET status = 'read' 
    WHERE sender_id = ? AND receiver_id = ? AND status != 'read'
  `, [contactId, userId], (err) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ success: true });
  });
});

app.post("/api/messages/broadcast", (req, res) => {
  const { senderId, receiverIds, text, senderRole } = req.body;
  
  if (!receiverIds || !Array.isArray(receiverIds) || receiverIds.length === 0) {
    return res.status(400).json({ error: "No receivers specified" });
  }

  const placeholders = receiverIds.map(() => "(?, ?, ?, ?)").join(", ");
  const values: any[] = [];
  receiverIds.forEach(rid => {
    values.push(senderId, rid, text, senderRole);
  });

  db.run(`
    INSERT INTO messages (sender_id, receiver_id, text, sender_role)
    VALUES ${placeholders}
  `, values, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    logOperation('MESSAGE', 'BROADCAST', senderId, `Broadcast xabar yuborildi: ${receiverIds.length} ta foydalanuvchiga`);
    res.json({ success: true, count: receiverIds.length });
  });
});

app.get("/api/messages/unread-counts", (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  db.all(`
    SELECT sender_id, COUNT(*) as unread 
    FROM messages 
    WHERE receiver_id = ? AND status != 'read' 
    GROUP BY sender_id
  `, [userId], (err, rows: any[]) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const counts = rows.reduce((acc: any, row: any) => {
      acc[row.sender_id] = row.unread;
      return acc;
    }, {});
    
    res.json(counts);
  });
});

app.post("/api/parent-portal/pickups", (req, res) => {
  const { child_id, full_name, relation, phone, photo_url } = req.body;
  const id = crypto.randomUUID();
  
  db.run(`
    INSERT INTO authorized_pickups (id, child_id, full_name, relation, phone, photo_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [id, child_id, full_name, relation, phone, photo_url], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else {
      logOperation('CREATE', 'PICKUP', full_name, `Yangi vakil qo'shildi (${relation})`);
      res.json({ success: true, id });
    }
  });
});

app.delete("/api/parent-portal/pickups/:id", (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM authorized_pickups WHERE id = ?', [id], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else {
      logOperation('DELETE', 'PICKUP', id, 'Vakil o\'chirildi');
      res.json({ success: true });
    }
  });
});

app.post("/api/parent-portal/documents", (req, res) => {
  const { child_id, title, type, file_url } = req.body;
  const id = crypto.randomUUID();
  
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    // 1. Insert document
    db.run(`
      INSERT INTO documents (id, child_id, title, type, file_url)
      VALUES (?, ?, ?, ?, ?)
    `, [id, child_id, title, type, file_url], function(err) {
      if (err) {
        db.run("ROLLBACK");
        return res.status(500).json({ error: err.message });
      }
    });

    // 2. Find teacher for this child to send automated message
    db.get(`
      SELECT s.user_id, c.first_name || ' ' || c.last_name as child_name
      FROM children c
      JOIN staff s ON s.group_id = c.group_id
      WHERE c.id = ? AND s.position = 'tarbiyachi'
      LIMIT 1
    `, [child_id], (err, info: any) => {
      if (info && info.user_id) {
        const messageText = `Avtomatik bildirishnoma: ${info.child_name} uchun yangi hujjat yuklandi: "${title}" (${type})`;
        
        // Find parent account ID for sender
        db.get("SELECT parent_account_id FROM children WHERE id = ?", [child_id], (err, child: any) => {
           if (child && child.parent_account_id) {
             db.run(`
               INSERT INTO messages (sender_id, receiver_id, text, sender_role)
               VALUES (?, ?, ?, 'parent')
             `, [child.parent_account_id, info.user_id, messageText]);
           }
        });
      }
      
      db.run("COMMIT", (err) => {
        if (err) res.status(500).json({ error: err.message });
        else {
          logOperation('CREATE', 'DOCUMENT', title, `Yangi hujjat yuklandi (${type})`);
          res.json({ success: true, id });
        }
      });
    });
  });
});

app.delete("/api/parent-portal/documents/:id", (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM documents WHERE id = ?', [id], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else {
      logOperation('DELETE', 'DOCUMENT', id, 'Hujjat o\'chirildi');
      res.json({ success: true });
    }
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend API running on http://0.0.0.0:${PORT}`);
});
