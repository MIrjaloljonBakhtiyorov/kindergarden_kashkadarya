import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

const DISHES_POOL = [
  { id: '1', name: 'Sutli Botqa (Guruchli)', image: 'https://images.unsplash.com/photo-1594610367113-211440453307?auto=format&fit=crop&w=300', kcal: 250, iron: 1.2, carbs: 45, vitamins: 'A, B1, D' },
  { id: '2', name: 'Osh (Palov)', image: 'https://images.unsplash.com/photo-1512058560366-cd2427ff5e70?auto=format&fit=crop&w=300', kcal: 450, iron: 3.5, carbs: 60, vitamins: 'B12, E, PP' },
  { id: '3', name: 'Mastava', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=300', kcal: 320, iron: 2.8, carbs: 35, vitamins: 'C, B6' },
  { id: '4', name: 'Somsa', image: 'https://images.unsplash.com/photo-1601050638917-3d8bc6029a55?auto=format&fit=crop&w=300', kcal: 280, iron: 2.1, carbs: 40, vitamins: 'A, E' },
  { id: '5', name: 'Suli Botqasi (Oatmeal)', image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=300', kcal: 210, iron: 1.5, carbs: 38, vitamins: 'B2, B5' },
  { id: '6', name: 'Tovuqli Sho\'rva', image: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&w=300', kcal: 280, iron: 2.5, carbs: 20, vitamins: 'A, C, D' },
  { id: '7', name: 'Moshxo\'rda', image: 'https://images.unsplash.com/photo-1541518763669-27f71462a48a?auto=format&fit=crop&w=300', kcal: 310, iron: 4.2, carbs: 42, vitamins: 'B1, PP' },
  { id: '8', name: 'Grechkali Bo\'tqa', image: 'https://images.unsplash.com/photo-1583002679808-f46377690666?auto=format&fit=crop&w=300', kcal: 190, iron: 3.2, carbs: 32, vitamins: 'B6, E' },
  { id: '9', name: 'Qovoqli Bo\'tqa', image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=300', kcal: 150, iron: 1.1, carbs: 28, vitamins: 'A, C' },
  { id: '10', name: 'Tvorogli Pishiriq', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=300', kcal: 240, iron: 0.8, carbs: 30, vitamins: 'D, B12' },
  { id: '11', name: 'Meva va Yogurt', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=300', kcal: 120, iron: 0.5, carbs: 25, vitamins: 'C, B2' },
  { id: '12', name: 'Kotlet va Pyure', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=300', kcal: 380, iron: 3.8, carbs: 45, vitamins: 'B12, A' },
  { id: '13', name: 'Baliqli taom', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=300', kcal: 320, iron: 2.2, carbs: 15, vitamins: 'D, Omega-3' },
  { id: '14', name: 'Makaron va Pishloq', image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=300', kcal: 410, iron: 1.4, carbs: 55, vitamins: 'A, B1' },
  { id: '15', name: 'Sabzavotli Ragu', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=300', kcal: 180, iron: 2.6, carbs: 22, vitamins: 'C, E, K' },
  { id: '16', name: 'Tefteli va Guruch', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=300', kcal: 350, iron: 3.1, carbs: 48, vitamins: 'PP, B6' },
  { id: '17', name: 'Blinchik (Quymoq)', image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=300', kcal: 260, iron: 1.0, carbs: 35, vitamins: 'A, B2' },
  { id: '18', name: 'Oshqovoq Sho\'rvasi', image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=300', kcal: 160, iron: 1.3, carbs: 18, vitamins: 'A, C' },
  { id: '19', name: 'Kisel va Pechenye', image: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?auto=format&fit=crop&w=300', kcal: 220, iron: 0.4, carbs: 42, vitamins: 'C' },
  { id: '20', name: 'Meva Sharbatlari', image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=300', kcal: 90, iron: 0.3, carbs: 20, vitamins: 'C, A' },
];

db.serialize(() => {
  console.log("Creating dishes table...");
  db.run(`
    CREATE TABLE dishes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      image TEXT,
      kcal REAL,
      iron REAL,
      carbs REAL,
      vitamins TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const stmt = db.prepare(`
    INSERT INTO dishes (id, name, image, kcal, iron, carbs, vitamins)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const dish of DISHES_POOL) {
    stmt.run([dish.id, dish.name, dish.image, dish.kcal, dish.iron, dish.carbs, dish.vitamins]);
  }

  stmt.finalize();
  console.log("Dishes table created and seeded.");
});

db.close();
