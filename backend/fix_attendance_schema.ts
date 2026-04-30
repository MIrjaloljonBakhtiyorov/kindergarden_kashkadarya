import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log("Attendance jadvaliga arrival_time ustunini qo'shish boshlandi...");
  db.run(`ALTER TABLE attendance ADD COLUMN arrival_time TEXT`, (err) => {
    if (err) {
      if (err.message.includes("duplicate column name")) {
        console.log("arrival_time ustuni allaqachon mavjud.");
      } else {
        console.error("Xato:", err.message);
      }
    } else {
      console.log("arrival_time ustuni muvaffaqiyatli qo'shildi.");
    }
  });
});

db.close();
