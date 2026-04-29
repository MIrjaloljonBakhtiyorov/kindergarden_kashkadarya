import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

db.all("SELECT * FROM messages ORDER BY created_at DESC LIMIT 10", (err, rows) => {
  if (err) {
    console.error('Xatolik:', err);
  } else {
    console.log('--- Ma\'lumotlar bazasidagi so\'nggi xabarlar ---');
    console.table(rows);
  }
  db.close();
});
