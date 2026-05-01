import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve('data/kindergarden.db');
const db = new sqlite3.Database(dbPath);

db.all("SELECT login, role FROM users", [], (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Users:", rows);
  }
  db.close();
});
