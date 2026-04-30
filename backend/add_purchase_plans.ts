import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log("Purchase Plans jadvalini yaratish boshlandi...");
  db.run(`
    CREATE TABLE IF NOT EXISTS purchase_plans (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      month TEXT,
      total_amount REAL DEFAULT 0,
      status TEXT DEFAULT 'DRAFT',
      items TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error("Error creating purchase_plans table:", err);
    else console.log("Purchase Plans jadvali yaratildi.");
  });
});

db.close();
