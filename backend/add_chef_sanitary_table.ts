import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log("Chef sanitary checks jadvalini yaratish...");
  db.run(`
    CREATE TABLE IF NOT EXISTS chef_sanitary_checks (
      id TEXT PRIMARY KEY,
      chef_id TEXT NOT NULL,
      date TEXT NOT NULL,
      checks_json TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(chef_id, date)
    )
  `, (err) => {
    if (err) console.error("Error creating chef_sanitary_checks table:", err);
    else console.log("chef_sanitary_checks jadvali yaratildi.");
  });
});

db.close();
