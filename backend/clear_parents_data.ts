import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run("PRAGMA foreign_keys = OFF"); // Bog'liqliklarni vaqtincha o'chiramiz

  console.log("Ota-onalar bazasini tozalash boshlandi...");

  // 1. Bolalar jadvalidagi ota-onalarga bo'lgan havolalarni o'chiramiz
  db.run("UPDATE children SET father_id = NULL, mother_id = NULL, parent_account_id = NULL", (err) => {
    if (err) console.error("Error updating children:", err);
    else console.log("Bolalar jadvalidagi bog'liqliklar tozalandi.");
  });

  // 2. Ota-onalar hisoblarini (login/parol) o'chiramiz
  db.run("DELETE FROM parent_accounts", (err) => {
    if (err) console.error("Error deleting parent_accounts:", err);
    else console.log("Ota-onalar login-parollari tozalandi.");
  });

  // 3. Ota-onalar ma'lumotlarini o'chiramiz
  db.run("DELETE FROM parents", (err) => {
    if (err) console.error("Error deleting parents:", err);
    else console.log("Ota-onalar ro'yxati tozalandi.");
  });

  db.run("PRAGMA foreign_keys = ON");
  console.log("Tozalash yakunlandi.");
});

db.close();
