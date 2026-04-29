import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../data/kindergarden.db');

const dbRaw = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

// Wrapper to match the expected interface and provide some helper functionality if needed
export const db = dbRaw;

// If you need the specific structure seen in the repositories:
// db.serialize, db.run, db.get, db.all, db.prepare are all native to sqlite3.Database
