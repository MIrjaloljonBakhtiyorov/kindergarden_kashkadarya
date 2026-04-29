import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

db.all(`
  SELECT 
    g.name as guruh_nomi, 
    s.full_name as tarbiyachi_ismi, 
    u.login as foydalanuvchi_logini
  FROM groups g 
  LEFT JOIN staff s ON s.group_id = g.id 
  LEFT JOIN users u ON u.id = s.user_id
`, (err, rows) => {
  if (err) console.error(err);
  else {
    console.log('--- Guruhlar va Tarbiyachilar bog\'liqligi ---');
    console.table(rows);
  }
  db.close();
});
