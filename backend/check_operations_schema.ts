import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.all("SELECT name, sql FROM sqlite_master WHERE type='table' AND name = 'operations_log'", (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(JSON.stringify(rows, null, 2));
    db.close();
  });
});
