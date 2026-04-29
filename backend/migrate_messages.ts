import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // 1. Rename existing table
  db.run("ALTER TABLE messages RENAME TO messages_old", (err) => {
    if (err) {
      console.log('Renaming failed (maybe messages_old already exists), dropping messages_old');
      db.run("DROP TABLE IF EXISTS messages_old", () => {
          db.run("ALTER TABLE messages RENAME TO messages_old", createNewTable);
      });
    } else {
      createNewTable();
    }
  });

  function createNewTable() {
    // 2. Create new table with correct schema
    db.run(`
      CREATE TABLE messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id TEXT NOT NULL,
        receiver_id TEXT NOT NULL,
        text TEXT NOT NULL,
        sender_role TEXT NOT NULL,
        status TEXT DEFAULT 'sent',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error(err);
      else {
        console.log('Created new messages table');
        // 3. Copy data if possible
        db.run(`
          INSERT INTO messages (sender_id, receiver_id, text, sender_role, status, created_at)
          SELECT sender_id, receiver_id, content, 'unknown', status, created_at FROM messages_old
        `, (err) => {
          if (err) console.log('Data migration failed (probably columns mismatch):', err.message);
          else console.log('Data migrated from messages_old');
          
          db.run("DROP TABLE messages_old", () => {
            console.log('Dropped old table');
            db.close();
          });
        });
      }
    });
  }
});
