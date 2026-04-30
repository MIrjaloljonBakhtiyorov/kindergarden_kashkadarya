import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // 1. Get a valid group and its teacher
  db.get(`
    SELECT s.group_id, s.user_id, u.full_name
    FROM staff s
    JOIN users u ON s.user_id = u.id
    WHERE s.position = 'tarbiyachi'
    LIMIT 1
  `, (err, teacher: any) => {
    if (teacher) {
      console.log('Found teacher:', teacher.full_name, 'Group ID:', teacher.group_id);
      
      // 2. Assign the test child to this group
      db.run(`UPDATE children SET group_id = ? WHERE id = 'test_child_id'`, [teacher.group_id], (err) => {
        if (err) console.error(err);
        else console.log('Assigned test_child_id to group', teacher.group_id);
      });
      
      // 3. Make sure the teacher user exists in the messages contacts for the parent
      // This is handled by the API query we already checked.
    } else {
        console.log('No teacher found in staff table. Checking for any staff.');
        db.get('SELECT * FROM staff LIMIT 1', (err, staff: any) => {
            if (staff) {
                console.log('Found staff:', staff);
                db.run(`UPDATE children SET group_id = ? WHERE id = 'test_child_id'`, [staff.group_id]);
            }
        });
    }
  });

  // 4. Update the fallback 'teacher_1' if it's being used
  // We should actually find the real teacher user ID and use that in the parent's contacts.
  
  db.close();
});
