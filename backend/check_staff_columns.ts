import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('data/kindergarden.db');
db.all("PRAGMA table_info(staff)", (err, rows) => {
    console.log(rows);
    db.close();
});
