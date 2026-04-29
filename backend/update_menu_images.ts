import { db } from './src/db';
import crypto from 'crypto';

const dates = ['2026-04-24', '2026-04-25', '2026-04-26'];

const sampleImages = {
  'BREAKFAST': 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=500',
  'LUNCH': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500',
  'TEA': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=500',
  'DINNER': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=500'
};

const meals = [
  { name: 'Suli bo\'tqasi', type: 'BREAKFAST', iron: 2.5, carbs: 30, vit: 'A, B, C', kcal: 250 },
  { name: 'Tovuqli sho\'rva', type: 'LUNCH', iron: 4.0, carbs: 45, vit: 'Protein, Temir', kcal: 450 },
  { name: 'Pechenye va choy', type: 'TEA', iron: 0.5, carbs: 20, vit: 'Kalsiy', kcal: 150 }
];

db.serialize(() => {
  console.log('Seeding menus for multiple dates...');
  
  dates.forEach(date => {
    meals.forEach(meal => {
      const id = crypto.randomUUID();
      db.run(`
        INSERT INTO menus (id, date, meal_name, meal_type, age_group, diet_type, iron, carbohydrates, vitamins, calories, image_url)
        VALUES (?, ?, ?, ?, '3-7', 'REGULAR', ?, ?, ?, ?, ?)
        ON CONFLICT(date, meal_type, age_group, diet_type) DO UPDATE SET
          meal_name = excluded.meal_name,
          image_url = excluded.image_url
      `, [id, date, meal.name, meal.type, meal.iron, meal.carbs, meal.vit, meal.kcal, sampleImages[meal.type as keyof typeof sampleImages]]);
    });
  });

  console.log('Menus seeded.');
  setTimeout(() => process.exit(0), 1000);
});
