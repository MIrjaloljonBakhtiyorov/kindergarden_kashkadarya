import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

console.log('--- Profillar bog\'liqligini tekshirish ---');

db.serialize(() => {
  // 1. Ota-onalar va ularning bolalarini ko'rish
  db.all(`
    SELECT 
      pa.login as ota_ona_logini,
      c.first_name || ' ' || c.last_name as bola_ismi,
      g.name as guruh_nomi,
      s.full_name as tarbiyachi_ismi,
      u.login as tarbiyachi_logini
    FROM parent_accounts pa
    JOIN children c ON c.parent_account_id = pa.id
    JOIN groups g ON c.group_id = g.id
    LEFT JOIN staff s ON s.group_id = g.id AND s.position = 'tarbiyachi'
    LEFT JOIN users u ON u.id = s.user_id
    LIMIT 5
  `, (err, rows) => {
    if (err) {
      console.error('Xatolik:', err.message);
    } else if (rows.length === 0) {
      console.log('Hech qanday bog\'liqlik topilmadi. Ma\'lumotlarni tekshiring.');
    } else {
      console.table(rows);
      
      // Tekshiruv natijasini tahlil qilish
      const brokenLinks = rows.filter((r: any) => !r.tarbiyachi_logini);
      if (brokenLinks.length > 0) {
        console.log('DIQQAT: Ayrim guruhlarda tarbiyachi biriktirilmagan!');
      } else {
        console.log('MUVAFFAQIYAT: Barcha ota-onalar o\'z tarbiyachilari bilan bog\'langan.');
      }
    }
    db.close();
  });
});
