import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run("BEGIN TRANSACTION");

  // 1. Rename existing table
  db.run("ALTER TABLE staff RENAME TO staff_old");

  // 2. Create new table with updated constraints
  db.run(`
    CREATE TABLE staff (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      position TEXT,
      phone TEXT,
      email TEXT,
      passport_no TEXT,
      group_id TEXT,
      status TEXT DEFAULT 'ACTIVE',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (group_id) REFERENCES groups(id)
    )
  `);

  // 3. Copy data from old table to new table
  db.run(`
    INSERT INTO staff (id, full_name, position, phone, email, passport_no, group_id, status, created_at)
    SELECT id, full_name, position, phone, email, passport_no, group_id, status, created_at FROM staff_old
  `);

  // 4. Drop old table
  db.run("DROP TABLE staff_old");

  db.run("COMMIT", (err) => {
    if (err) {
      console.error("Migration failed:", err);
    } else {
      console.log("Migration successful: Staff table updated.");
    }
    db.close();
  });
});
