import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

const parentId = 'test_parent_acc_id'; // parent_test1

db.serialize(() => {
  console.log('--- Teacher search for parent:', parentId, '---');
  db.all(`
    SELECT 
      u.id, 
      u.full_name as name, 
      'teacher' as role,
      c.first_name as child_name,
      s.group_id
    FROM users u
    JOIN staff s ON s.user_id = u.id
    JOIN children c ON c.group_id = s.group_id
    WHERE c.parent_account_id = ?
  `, [parentId], (err, rows) => {
    if (err) console.error(err);
    console.log('Contacts found:', rows);
  });

  db.all(`SELECT * FROM children WHERE parent_account_id = ?`, [parentId], (err, rows) => {
    console.log('Child info:', rows);
    if (rows && rows.length > 0) {
        const groupId = rows[0].group_id;
        db.all(`SELECT * FROM staff s JOIN users u ON s.user_id = u.id WHERE s.group_id = ?`, [groupId], (err, staff) => {
            console.log('Staff in child group:', staff);
        });
    }
  });
  
  db.close();
});
