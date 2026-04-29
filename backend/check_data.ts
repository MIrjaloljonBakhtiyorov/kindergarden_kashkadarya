import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.all("SELECT id, login, role, full_name FROM users", (err, users) => {
    console.log('--- Users ---');
    console.log(users);
    
    db.all("SELECT id, full_name, group_id, position FROM staff", (err, staff) => {
      console.log('--- Staff ---');
      console.log(staff);
      
      db.all("SELECT id, name, teacher_name FROM groups", (err, groups) => {
        console.log('--- Groups ---');
        console.log(groups);
        
        db.all("SELECT id, login FROM parent_accounts", (err, parents) => {
            console.log('--- Parent Accounts ---');
            console.log(parents);
            db.close();
        });
      });
    });
  });
});
