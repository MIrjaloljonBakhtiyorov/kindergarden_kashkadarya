import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Add category column
  db.run("ALTER TABLE operations_log ADD COLUMN category TEXT DEFAULT 'OTHER'", (err) => {
    if (err) console.log("Category column might already exist or error:", err.message);
    else console.log("Category column added.");
  });

  // Add is_archived column
  db.run("ALTER TABLE operations_log ADD COLUMN is_archived INTEGER DEFAULT 0", (err) => {
    if (err) console.log("is_archived column might already exist or error:", err.message);
    else console.log("is_archived column added.");
  });

  // Add status column if needed for better tracking (e.g., COMPLETED, PENDING)
  db.run("ALTER TABLE operations_log ADD COLUMN status TEXT DEFAULT 'COMPLETED'", (err) => {
    if (err) console.log("Status column might already exist or error:", err.message);
    else console.log("Status column added.");
  });

  console.log("Migration finished.");
});
