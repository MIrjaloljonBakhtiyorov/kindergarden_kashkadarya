import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log('--- Seeding Staff Table ---');
  
  // 1. Create staff table if not exists (just in case)
  db.run(`CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    group_id TEXT,
    position TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (group_id) REFERENCES groups(id)
  )`);

  // 2. Get all users with roles and link them in staff table
  db.all("SELECT id, login, role, full_name FROM users", (err, users: any[]) => {
    if (err) return console.error(err);
    
    // Get all groups
    db.all("SELECT id, name FROM groups", (err, groups: any[]) => {
        if (err) return console.error(err);
        
        users.forEach((user, index) => {
            let position = '';
            let groupId = null;
            
            switch(user.role) {
                case 'TEACHER': 
                    position = 'tarbiyachi'; 
                    groupId = groups[index % groups.length]?.id;
                    break;
                case 'NURSE': position = 'hamshira'; break;
                case 'CHEF': position = 'oshpaz'; break;
                case 'STOREKEEPER': position = 'omborchi'; break;
                case 'DIRECTOR': position = 'direktor'; break;
                case 'OPERATOR': position = 'admin'; break;
                default: position = user.role.toLowerCase();
            }
            
            db.run("INSERT OR REPLACE INTO staff (id, user_id, group_id, position, full_name) VALUES (?, ?, ?, ?, ?)", 
                [crypto.randomUUID(), user.id, groupId, position, user.full_name]);
        });
        
        console.log('Staff table seeded.');
        
        // 3. Fix test_child_id group assignment to match teacher's group
        db.get("SELECT s.group_id FROM staff s JOIN users u ON s.user_id = u.id WHERE u.login = 'teacher' LIMIT 1", (err, row: any) => {
            if (row && row.group_id) {
                db.run("UPDATE children SET group_id = ? WHERE id = 'test_child_id'", [row.group_id], (err) => {
                    if (!err) console.log('Fixed test child group to:', row.group_id);
                });
            }
        });
    });
  });
  
  // Close the database after some time to ensure all runs are finished
  setTimeout(() => db.close(), 2000);
});
