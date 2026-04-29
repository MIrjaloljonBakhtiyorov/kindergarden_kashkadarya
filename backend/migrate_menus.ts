import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log("Menus jadvalini yangilash boshlandi...");
  
  // 1. Vaqtinchalik jadval yaratish
  db.run(`
    CREATE TABLE menus_new (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      meal_name TEXT NOT NULL,
      meal_type TEXT NOT NULL,
      iron REAL,
      carbohydrates REAL,
      vitamins TEXT,
      calories REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(date, meal_type)
    )
  `);

  // 2. Ma'lumotlarni ko'chirish (dublikatlarni chetlab o'tgan holda)
  db.run(`
    INSERT OR IGNORE INTO menus_new (id, date, meal_name, meal_type, iron, carbohydrates, vitamins, calories, created_at)
    SELECT id, date, meal_name, meal_type, iron, carbohydrates, vitamins, calories, created_at FROM menus
  `);

  // 3. Eski jadvalni o'chirish va yangisini nomlash
  db.run("DROP TABLE menus");
  db.run("ALTER TABLE menus_new RENAME TO menus");

  console.log("Menus jadvali UNIQUE(date, meal_type) cheklovi bilan yangilandi.");
});

db.close();
