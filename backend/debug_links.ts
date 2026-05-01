import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

const parentId = '6fe4f6c3-9886-4ca5-9d4e-7c94e10a18af';

db.serialize(() => {
  console.log('--- Tekshiruv boshlandi ---');
  
  // 1. Bolani va uning guruhini tekshirish
  db.get("SELECT id, group_id FROM children WHERE parent_account_id = ?", [parentId], (err, child: any) => {
    console.log('Bola ma\'lumotlari:', child);
    
    if (child && child.group_id) {
      // 2. Guruhdagi xodimlarni tekshirish
      db.all("SELECT id, full_name, user_id, group_id FROM staff WHERE group_id = ?", [child.group_id], (err, staff) => {
        console.log('Guruhdagi xodimlar (staff):', staff);
        
        // 3. Userlarni tekshirish
        db.get("SELECT id, login, role FROM users WHERE login = 'teacher'", (err, user) => {
          console.log('Tarbiyachi user ma\'lumotlari:', user);
          db.close();
        });
      });
    } else {
      console.log('Bolaning guruhi aniqlanmadi');
      db.close();
    }
  }); 
});
