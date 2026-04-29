import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log("Oshpaz topshiriqlari jadvalini yaratish...");
  
  db.run(`
    CREATE TABLE IF NOT EXISTS kitchen_tasks (
      id TEXT PRIMARY KEY,
      menu_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'ACCEPTED', 'COOKING_STARTED', 'COOKING', 'SERVED'
      temperature REAL,
      start_time DATETIME,
      end_time DATETIME,
      served_time DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (menu_id) REFERENCES menus(id)
    )
  `);

  console.log("Kitchen_tasks jadvali tayyor.");
});

db.close();
