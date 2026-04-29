import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // 1. Add user_id to staff if it doesn't exist
  db.all("PRAGMA table_info(staff)", (err, columns: any[]) => {
    if (err) {
      console.error(err);
      return;
    }
    
    if (!columns.some(c => c.name === 'user_id')) {
      db.run("ALTER TABLE staff ADD COLUMN user_id TEXT", (err) => {
        if (err) console.error(err);
        else console.log('Added user_id column to staff');
        updateData();
      });
    } else {
      updateData();
    }
  });

  function updateData() {
    // 2. Link the 'teacher' user to a staff member
    db.get("SELECT id FROM users WHERE login = 'teacher'", (err, user: any) => {
      if (user) {
        db.run("UPDATE staff SET user_id = ? WHERE position = 'tarbiyachi' AND user_id IS NULL", [user.id], (err) => {
          if (err) console.error(err);
          else console.log('Linked teacher user to staff');
          db.close();
        });
      } else {
        console.log('Teacher user not found');
        db.close();
      }
    });
  }
});
