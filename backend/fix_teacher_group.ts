import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

const teacherUserId = '7001b370-16d8-44ba-a9c0-fa3a600d199e';
const quyoshchaGroupId = 'd75ec8e5-169c-4d23-81c9-8fd6e743821f';

db.serialize(() => {
  // 1. Tarbiyachining staff recordini Quyoshcha guruhiga o'tkazish
  db.run("UPDATE staff SET group_id = ? WHERE user_id = ?", [quyoshchaGroupId, teacherUserId], function(err) {
    if (err) console.error(err);
    else {
      console.log(`Tarbiyachi staff recordi yangilandi: ${this.changes} qator o'zgartirildi`);
      
      // 2. Agar staff record bo'lmasa, yangi qo'shish
      if (this.changes === 0) {
        db.run("INSERT INTO staff (id, full_name, position, group_id, user_id) VALUES (?, ?, ?, ?, ?)", 
          [crypto.randomUUID(), 'Tarbiyachi', 'tarbiyachi', quyoshchaGroupId, teacherUserId], (err) => {
            if (err) console.error(err);
            else console.log('Yangi staff record yaratildi');
          }
        );
      }
    }
  });
  
  // 3. Oldingi xatoliklar tufayli noto'g'ri IDga ketgan xabarlarni to'g'rilash
  db.run("UPDATE messages SET receiver_id = ? WHERE receiver_id = 'teacher_1'", [teacherUserId], (err) => {
    if (err) console.error(err);
    else console.log('Eski xabarlar manzili to\'g\'rilandi');
    db.close();
  });
});
