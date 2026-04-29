import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '..', 'data', 'kindergarden.db');

const db = new sqlite3.Database(dbPath);

const roles = [
  { login: 'admin', role: 'ADMIN', name: 'Administrator' },
  { login: 'director', role: 'DIRECTOR', name: 'Director' },
  { login: 'operator', role: 'OPERATOR', name: 'Operator' },
  { login: 'teacher', role: 'TEACHER', name: 'Teacher' },
  { login: 'nurse', role: 'NURSE', name: 'Nurse' },
  { login: 'dietitian', role: 'DIETITIAN', name: 'Dietitian' },
  { login: 'chef', role: 'CHEF', name: 'Chef' },
  { login: 'storekeeper', role: 'STOREKEEPER', name: 'Storekeeper' },
  { login: 'inspector', role: 'INSPECTOR', name: 'Inspector' },
  { login: 'lab', role: 'LAB_CONTROLLER', name: 'Lab Controller' },
  { login: 'supply', role: 'SUPPLY', name: 'Supply' },
  { login: 'finance', role: 'FINANCE', name: 'Finance' },
];

function addColumn(table: string, column: string, type: string): Promise<void> {
  return new Promise((resolve) => {
    db.all(`PRAGMA table_info(${table})`, (err, columns: any[]) => {
      if (err || !columns) return resolve();
      if (!columns.some(c => c.name === column)) {
        db.run(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`, () => resolve());
      } else {
        resolve();
      }
    });
  });
}

async function seed() {
  const passwordHash = await bcrypt.hash('123456', 10);
  
  db.serialize(async () => {
    // 1. Create Tables
    db.run(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, login TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL, full_name TEXT, status TEXT DEFAULT 'ACTIVE', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    db.run(`CREATE TABLE IF NOT EXISTS parent_accounts (id TEXT PRIMARY KEY, login TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL)`);
    db.run(`CREATE TABLE IF NOT EXISTS parents (id TEXT PRIMARY KEY, full_name TEXT NOT NULL, workplace TEXT, phone TEXT NOT NULL, passport_no TEXT, role TEXT NOT NULL)`);
    db.run(`CREATE TABLE IF NOT EXISTS children (id TEXT PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT NOT NULL, birth_date TEXT NOT NULL, age_category TEXT NOT NULL, gender TEXT NOT NULL, birth_certificate_number TEXT NOT NULL, medical_notes TEXT, status TEXT DEFAULT 'DRAFT', father_id TEXT, mother_id TEXT, parent_account_id TEXT, group_id TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (father_id) REFERENCES parents(id), FOREIGN KEY (mother_id) REFERENCES parents(id), FOREIGN KEY (parent_account_id) REFERENCES parent_accounts(id), FOREIGN KEY (group_id) REFERENCES groups(id))`);
    
    await addColumn('children', 'address', 'TEXT');
    await addColumn('children', 'weight', 'REAL');
    await addColumn('children', 'height', 'REAL');
    await addColumn('children', 'allergies', 'TEXT');
    await addColumn('children', 'passport_info', 'TEXT');
    await addColumn('parents', 'passport_no', 'TEXT');

    db.run(`CREATE TABLE IF NOT EXISTS payments (id TEXT PRIMARY KEY, child_id TEXT NOT NULL, amount REAL NOT NULL, date TEXT NOT NULL, receipt_url TEXT, status TEXT DEFAULT 'PAID', FOREIGN KEY (child_id) REFERENCES children(id))`);
    db.run(`CREATE TABLE IF NOT EXISTS attendance (id TEXT PRIMARY KEY, child_id TEXT NOT NULL, date TEXT NOT NULL, status TEXT NOT NULL, reason TEXT, FOREIGN KEY (child_id) REFERENCES children(id))`);
    db.run(`CREATE TABLE IF NOT EXISTS progress_reports (id TEXT PRIMARY KEY, child_id TEXT NOT NULL, date TEXT NOT NULL, subject TEXT NOT NULL, rating INTEGER, comment TEXT, FOREIGN KEY (child_id) REFERENCES children(id))`);
    db.run(`CREATE TABLE IF NOT EXISTS vaccinations (id TEXT PRIMARY KEY, child_id TEXT NOT NULL, vaccine_name TEXT NOT NULL, planned_date TEXT NOT NULL, taken_date TEXT, status TEXT DEFAULT 'PLANNED', FOREIGN KEY (child_id) REFERENCES children(id))`);
    db.run(`CREATE TABLE IF NOT EXISTS authorized_pickups (id TEXT PRIMARY KEY, child_id TEXT NOT NULL, full_name TEXT NOT NULL, relation TEXT NOT NULL, phone TEXT NOT NULL, photo_url TEXT, FOREIGN KEY (child_id) REFERENCES children(id))`);

    // 2. Base Users
    const stmt = db.prepare('INSERT OR IGNORE INTO users (id, login, password_hash, role, full_name) VALUES (?, ?, ?, ?, ?)');
    for (const user of roles) {
      stmt.run([crypto.randomUUID(), user.login, passwordHash, user.role, user.name]);
    }
    stmt.finalize();

    // 3. Premium Test Account
    const fatherId = crypto.randomUUID();
    const motherId = crypto.randomUUID();
    const accountId = 'test_parent_acc_id';
    const childId = 'test_child_id';

    db.run(`INSERT OR IGNORE INTO parent_accounts (id, login, password_hash) VALUES (?, ?, ?)`, [accountId, 'parent_test', passwordHash]);
    db.run(`INSERT OR IGNORE INTO parents (id, full_name, phone, workplace, passport_no, role) VALUES (?, ?, ?, ?, ?, ?)`, [fatherId, 'Bozorov Iskandar', '+998 90 123 45 67', 'IT Park Academy', 'AA1234567', 'FATHER']);
    db.run(`INSERT OR IGNORE INTO parents (id, full_name, phone, workplace, passport_no, role) VALUES (?, ?, ?, ?, ?, ?)`, [motherId, 'Bozorova Nigora', '+998 93 777 88 99', 'Toshkent Tibbiyot Akademiyasi', 'AB7654321', 'MOTHER']);
    db.run(`INSERT OR IGNORE INTO children (id, first_name, last_name, birth_date, age_category, gender, address, weight, height, allergies, birth_certificate_number, parent_account_id, father_id, mother_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [childId, 'Mustafo', 'Bozorov', '2020-05-15', '3-7 yosh', 'M', 'Toshkent sh, Chilonzor 5-mavze, 12-uy', 19.2, 118, 'Asal va yong\'oq', 'GC-7788990', accountId, fatherId, motherId, 'ACTIVE']);

    // 4. Seeding Data inside the same serialize block
    db.run(`INSERT OR IGNORE INTO payments (id, child_id, amount, date, status) VALUES (?, ?, ?, ?, ?)`, [crypto.randomUUID(), childId, 450000, '2026-02-05', 'PAID']);
    db.run(`INSERT OR IGNORE INTO payments (id, child_id, amount, date, status) VALUES (?, ?, ?, ?, ?)`, [crypto.randomUUID(), childId, 450000, '2026-03-05', 'PAID']);
    db.run(`INSERT OR IGNORE INTO payments (id, child_id, amount, date, status) VALUES (?, ?, ?, ?, ?)`, [crypto.randomUUID(), childId, 500000, '2026-04-05', 'PAID']);

    db.run(`INSERT OR IGNORE INTO attendance (id, child_id, date, status, reason) VALUES (?, ?, ?, ?, ?)`, [crypto.randomUUID(), childId, '2026-04-20', 'PRESENT', null]);
    db.run(`INSERT OR IGNORE INTO attendance (id, child_id, date, status, reason) VALUES (?, ?, ?, ?, ?)`, [crypto.randomUUID(), childId, '2026-04-21', 'PRESENT', null]);
    db.run(`INSERT OR IGNORE INTO attendance (id, child_id, date, status, reason) VALUES (?, ?, ?, ?, ?)`, [crypto.randomUUID(), childId, '2026-04-22', 'ABSENT_SICK', 'Shamollash alomatlari']);
    db.run(`INSERT OR IGNORE INTO attendance (id, child_id, date, status, reason) VALUES (?, ?, ?, ?, ?)`, [crypto.randomUUID(), childId, '2026-04-23', 'PRESENT', null]);
    db.run(`INSERT OR IGNORE INTO attendance (id, child_id, date, status, reason) VALUES (?, ?, ?, ?, ?)`, [crypto.randomUUID(), childId, '2026-04-24', 'PRESENT', null]);

    db.run(`INSERT OR IGNORE INTO progress_reports (id, child_id, date, subject, rating, comment) VALUES (?, ?, ?, ?, ?, ?)`, [crypto.randomUUID(), childId, '2026-04-22', 'Rasm chizish', 5, 'Mustafo bugun "Bahor" mavzusida juda chiroyli rasm chizdi.']);
    db.run(`INSERT OR IGNORE INTO progress_reports (id, child_id, date, subject, rating, comment) VALUES (?, ?, ?, ?, ?, ?)`, [crypto.randomUUID(), childId, '2026-04-23', 'Ingliz tili', 4, 'Yangi so\'zlarni (mevalar) oson yodladi.']);

    db.run(`INSERT OR IGNORE INTO vaccinations (id, child_id, vaccine_name, planned_date, taken_date, status) VALUES (?, ?, ?, ?, ?, ?)`, [crypto.randomUUID(), childId, 'VGB (Gepatit B)', '2025-10-10', '2025-10-12', 'TAKEN']);
    db.run(`INSERT OR IGNORE INTO vaccinations (id, child_id, vaccine_name, planned_date, taken_date, status) VALUES (?, ?, ?, ?, ?, ?)`, [crypto.randomUUID(), childId, 'OPV (Polio)', '2026-05-20', null, 'PLANNED']);

    db.run(`INSERT OR IGNORE INTO authorized_pickups (id, child_id, full_name, relation, phone) VALUES (?, ?, ?, ?, ?)`, [crypto.randomUUID(), childId, 'Bozorov Ahmad', 'Bobosi', '+998 90 999 00 11']);

    console.log('Premium data seeded successfully');
  });
}

seed().catch(console.error);
