import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log('--- Parent Accounts ---');
  db.all('SELECT id, login FROM parent_accounts', (err, rows) => {
    console.log(rows);
  });

  console.log('--- Children and their Parent Account IDs ---');
  db.all('SELECT id, first_name, last_name, parent_account_id FROM children', (err, rows) => {
    console.log(rows);
  });
  
  db.close();
});
