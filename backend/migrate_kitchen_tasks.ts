import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log("Kitchen_tasks jadvalini UNIQUE(menu_id) bilan yangilash...");
  
  db.run("DROP TABLE IF EXISTS kitchen_tasks_new");
  db.run(`
    CREATE TABLE kitchen_tasks_new (
      id TEXT PRIMARY KEY,
      menu_id TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'PENDING',
      temperature REAL,
      start_time DATETIME,
      end_time DATETIME,
      served_time DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (menu_id) REFERENCES menus(id)
    )
  `);

  db.run(`
    INSERT OR IGNORE INTO kitchen_tasks_new (id, menu_id, status, temperature, start_time, end_time, served_time, created_at)
    SELECT id, menu_id, status, temperature, start_time, end_time, served_time, created_at FROM kitchen_tasks
  `);

  db.run("DROP TABLE kitchen_tasks");
  db.run("ALTER TABLE kitchen_tasks_new RENAME TO kitchen_tasks");

  console.log("Kitchen_tasks jadvali muvaffaqiyatli yangilandi.");
});

db.close();
