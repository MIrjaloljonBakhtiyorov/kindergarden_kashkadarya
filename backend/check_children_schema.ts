import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

db.get("SELECT sql FROM sqlite_master WHERE type='table' AND name='children'", (err, row: any) => {
    if (err) {
        console.error(err);
    } else {
        console.log(row ? row.sql : "Table 'children' not found");
    }
    db.close();
});
