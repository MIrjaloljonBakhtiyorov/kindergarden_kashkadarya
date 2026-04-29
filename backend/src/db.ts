import { Pool } from 'pg';
import path from 'path';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/kindergarden'
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Helper to convert SQLite ? to Postgres $1, $2, etc.
function convertQuery(sql: string) {
  let i = 1;
  let pgSql = sql.replace(/\?/g, () => `$${i++}`);
  
  // If it's an INSERT and needs an ID returned, we might need RETURNING id
  // but since we only need it for messages, let's just append it if we see INSERT INTO messages
  if (pgSql.trim().toUpperCase().startsWith('INSERT INTO MESSAGES') && !pgSql.toUpperCase().includes('RETURNING')) {
    pgSql += ' RETURNING id';
  }
  
  // SQLite's ON CONFLICT DO UPDATE SET needs no change in Postgres if column names match
  return pgSql;
}

export const db = {
  run: (sql: string, params: any[] = [], callback?: (err: Error | null) => void) => {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    const pgSql = convertQuery(sql);
    pool.query(pgSql, params)
      .then(result => {
        if (callback) {
          const context = { 
            lastID: result.rows?.[0]?.id, 
            changes: result.rowCount 
          };
          callback.bind(context)(null);
        }
      })
      .catch(err => {
        console.error('db.run error:', err, 'SQL:', pgSql, 'Params:', params);
        if (callback) callback(err);
      });
  },
  get: (sql: string, params: any[] = [], callback?: (err: Error | null, row?: any) => void) => {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    const pgSql = convertQuery(sql);
    pool.query(pgSql, params)
      .then(result => {
        if (callback) callback(null, result.rows[0]);
      })
      .catch(err => {
        console.error('db.get error:', err, 'SQL:', pgSql, 'Params:', params);
        if (callback) callback(err);
      });
  },
  all: (sql: string, params: any[] = [], callback?: (err: Error | null, rows?: any[]) => void) => {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    const pgSql = convertQuery(sql);
    pool.query(pgSql, params)
      .then(result => {
        if (callback) callback(null, result.rows);
      })
      .catch(err => {
        console.error('db.all error:', err, 'SQL:', pgSql, 'Params:', params);
        if (callback) callback(err);
      });
  },
  serialize: (callback: () => void) => {
    callback();
  }
};

pool.query("SELECT NOW()", (err) => {
  if (err) {
    console.error('Error connecting to PostgreSQL database:', err);
  } else {
    console.log('Connected to PostgreSQL database');
    initDb();
  }
});

function addColumnIfNotExists(tableName: string, columnName: string, columnType: string) {
  const checkSql = `
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name='${tableName}' AND column_name='${columnName}'
  `;
  pool.query(checkSql).then(res => {
    if (res.rowCount === 0) {
      pool.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}`).catch(console.error);
    }
  }).catch(console.error);
}

async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS groups (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        teacher_name TEXT,
        capacity INTEGER,
        age_limit TEXT
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS parents (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        workplace TEXT,
        phone TEXT NOT NULL,
        passport_no TEXT,
        role TEXT NOT NULL
      )
    `);
    addColumnIfNotExists('parents', 'passport_no', 'TEXT');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS parent_accounts (
        id TEXT PRIMARY KEY,
        login TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        status TEXT DEFAULT 'ACTIVE'
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS children (
        id TEXT PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        birth_date TEXT NOT NULL,
        age_category TEXT NOT NULL,
        gender TEXT NOT NULL,
        address TEXT,
        weight REAL,
        height REAL,
        allergies TEXT,
        passport_info TEXT,
        birth_certificate_number TEXT NOT NULL,
        medical_notes TEXT,
        status TEXT DEFAULT 'DRAFT',
        father_id TEXT,
        mother_id TEXT,
        parent_account_id TEXT,
        group_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (father_id) REFERENCES parents(id) ON DELETE SET NULL,
        FOREIGN KEY (mother_id) REFERENCES parents(id) ON DELETE SET NULL,
        FOREIGN KEY (parent_account_id) REFERENCES parent_accounts(id) ON DELETE SET NULL,
        FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
      )
    `);
    addColumnIfNotExists('children', 'address', 'TEXT');
    addColumnIfNotExists('children', 'weight', 'REAL');
    addColumnIfNotExists('children', 'height', 'REAL');
    addColumnIfNotExists('children', 'allergies', 'TEXT');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS menus (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        meal_name TEXT NOT NULL,
        meal_type TEXT NOT NULL,
        iron REAL,
        carbohydrates REAL,
        vitamins TEXT,
        calories REAL,
        image_url TEXT,
        is_approved INTEGER DEFAULT 0,
        age_group TEXT,
        diet_type TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(date, meal_type, age_group, diet_type)
      )
    `);
    addColumnIfNotExists('menus', 'image_url', 'TEXT');
    addColumnIfNotExists('menus', 'is_approved', 'INTEGER');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_id TEXT NOT NULL,
        receiver_id TEXT NOT NULL,
        text TEXT NOT NULL,
        sender_role TEXT NOT NULL,
        status TEXT DEFAULT 'sent',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        receipt_url TEXT,
        status TEXT DEFAULT 'PAID',
        FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        reason TEXT,
        arrival_time TEXT,
        UNIQUE(child_id, date),
        FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        file_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS authorized_pickups (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        full_name TEXT NOT NULL,
        relation TEXT NOT NULL,
        phone TEXT NOT NULL,
        photo_url TEXT,
        FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS progress_reports (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        date TEXT NOT NULL,
        subject TEXT NOT NULL,
        rating INTEGER,
        comment TEXT,
        FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS vaccinations (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        vaccine_name TEXT NOT NULL,
        planned_date TEXT NOT NULL,
        taken_date TEXT,
        status TEXT DEFAULT 'PLANNED',
        FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS staff (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        full_name TEXT NOT NULL,
        position TEXT,
        phone TEXT,
        email TEXT,
        passport_no TEXT,
        group_id TEXT,
        status TEXT DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        login TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        full_name TEXT,
        status TEXT DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS health_checks (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        date TEXT NOT NULL,
        weight REAL,
        height REAL,
        temperature REAL,
        allergy TEXT,
        is_sick BOOLEAN,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS operations_log (
        id TEXT PRIMARY KEY,
        operation_type TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_name TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS lab_samples (
        id TEXT PRIMARY KEY,
        sample_id TEXT UNIQUE NOT NULL,
        dish_id TEXT,
        dish_name TEXT NOT NULL,
        batch_reference TEXT,
        date TEXT NOT NULL,
        storage_location TEXT,
        storage_duration INTEGER DEFAULT 72,
        status TEXT NOT NULL,
        lab_result TEXT,
        risk_level TEXT NOT NULL,
        notes TEXT,
        test_results TEXT,
        storage_temp_history TEXT,
        nutrition TEXT,
        created_by TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS audits (
        id TEXT PRIMARY KEY,
        inspection_id TEXT UNIQUE NOT NULL,
        inspection_type TEXT NOT NULL,
        overall_result TEXT NOT NULL,
        severity TEXT NOT NULL,
        notes TEXT,
        created_by TEXT,
        status TEXT DEFAULT 'OPEN',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS audit_items (
        id TEXT PRIMARY KEY,
        audit_id TEXT NOT NULL,
        question TEXT NOT NULL,
        result TEXT NOT NULL,
        note TEXT,
        severity TEXT,
        FOREIGN KEY (audit_id) REFERENCES audits(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS finance_transactions (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        category TEXT NOT NULL,
        item TEXT NOT NULL,
        amount REAL NOT NULL,
        quantity TEXT,
        price_per_unit TEXT,
        type TEXT DEFAULT 'EXPENSE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        unit TEXT NOT NULL,
        brand TEXT,
        min_stock REAL DEFAULT 0
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS inventory_batches (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        batch_number TEXT,
        invoice_number TEXT,
        quantity REAL NOT NULL,
        price_per_unit REAL,
        total_price REAL,
        received_date TEXT NOT NULL,
        expiry_date TEXT,
        supplier TEXT,
        storage_location TEXT,
        storage_temp REAL,
        notes TEXT,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS inventory_transactions (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        type TEXT NOT NULL,
        quantity REAL NOT NULL,
        price REAL,
        date TEXT NOT NULL,
        batch_id TEXT,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS required_products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL,
        quantity REAL NOT NULL,
        unit TEXT NOT NULL,
        brand TEXT,
        category TEXT,
        status TEXT DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS supply_orders (
        id TEXT PRIMARY KEY,
        order_id TEXT UNIQUE NOT NULL,
        vendor TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        items TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS suppliers (
        id TEXT PRIMARY KEY,
        first_name TEXT,
        last_name TEXT,
        brand TEXT,
        name TEXT,
        type TEXT,
        score REAL,
        phone TEXT,
        contact_user TEXT,
        telegram_link TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS dishes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        image TEXT,
        kcal REAL,
        iron REAL,
        carbs REAL,
        vitamins TEXT
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS kitchen_tasks (
        id TEXT PRIMARY KEY,
        menu_id TEXT UNIQUE NOT NULL,
        status TEXT,
        temperature REAL,
        start_time TEXT,
        end_time TEXT,
        served_time TEXT
      )
    `);

    console.log("PostgreSQL Database initialized successfully");
  } catch (err) {
    console.error("Error initializing PostgreSQL database:", err);
  }
}
