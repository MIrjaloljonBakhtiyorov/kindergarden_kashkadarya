import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log('--- All Staff ---');
  db.all(`SELECT s.*, u.full_name, u.role FROM staff s JOIN users u ON s.user_id = u.id`, (err, rows) => {
    console.log(rows);
  });

  console.log('--- All Groups ---');
  db.all(`SELECT * FROM groups`, (err, rows) => {
    console.log(rows);
  });
  
  db.close();
});
