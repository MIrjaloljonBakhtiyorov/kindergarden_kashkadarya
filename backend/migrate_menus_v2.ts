import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log("Menus jadvalini yosh va parhez turlari bilan yangilash boshlandi...");
  
  db.run("DROP TABLE IF EXISTS menus_new");
  db.run(`
    CREATE TABLE menus_new (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      meal_type TEXT NOT NULL, -- BREAKFAST, LUNCH, TEA, DINNER
      age_group TEXT NOT NULL,  -- '1-3', '3-7'
      diet_type TEXT NOT NULL,  -- 'REGULAR', 'DIETARY'
      meal_name TEXT NOT NULL,
      iron REAL,
      carbohydrates REAL,
      vitamins TEXT,
      calories REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(date, meal_type, age_group, diet_type)
    )
  `);

  // Ma'lumotlarni ko'chirish (agar bo'lsa, barchasini 3-7 REGULAR deb belgilaymiz)
  db.run(`
    INSERT OR IGNORE INTO menus_new (id, date, meal_type, age_group, diet_type, meal_name, iron, carbohydrates, vitamins, calories, created_at)
    SELECT id, date, meal_type, '3-7', 'REGULAR', meal_name, iron, carbohydrates, vitamins, calories, created_at FROM menus
  `);

  db.run("DROP TABLE menus");
  db.run("ALTER TABLE menus_new RENAME TO menus");

  console.log("Menus jadvali muvaffaqiyatli yangilandi.");
});

db.close();
