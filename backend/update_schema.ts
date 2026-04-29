import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log("Attendance jadvalini yangilash boshlandi...");
  db.run("DROP TABLE IF EXISTS attendance");
  db.run(`
    CREATE TABLE attendance (
      id TEXT PRIMARY KEY,
      child_id TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      reason TEXT,
      UNIQUE(child_id, date),
      FOREIGN KEY (child_id) REFERENCES children(id)
    )
  `, (err) => {
    if (err) console.error("Error creating attendance table:", err);
    else console.log("Attendance jadvali UNIQUE cheklovi bilan qayta yaratildi.");
  });
});

db.close();
