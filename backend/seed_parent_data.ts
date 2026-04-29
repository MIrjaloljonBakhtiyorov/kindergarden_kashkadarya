
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

const childId = '29864f5a-15cd-4c85-83f9-dade77a961a3';

async function seed() {
  console.log('Ota-ona portali uchun ma\'lumotlar kiritilmoqda...');

  db.serialize(() => {
    // 1. Davomat (oxirgi 15 kun)
    const attendanceStmt = db.prepare('INSERT OR REPLACE INTO attendance (id, child_id, date, status) VALUES (?, ?, ?, ?)');
    for (let i = 0; i < 15; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const status = Math.random() > 0.1 ? 'PRESENT' : 'ABSENT';
      attendanceStmt.run(crypto.randomUUID(), childId, dateStr, status);
    }
    attendanceStmt.finalize();

    // 2. To'lovlar (oxirgi 3 oy)
    const paymentStmt = db.prepare('INSERT INTO payments (id, child_id, amount, date, status, receipt_url) VALUES (?, ?, ?, ?, ?, ?)');
    paymentStmt.run(crypto.randomUUID(), childId, 650000, '2026-04-05', 'PAID', 'https://example.com/receipt1.pdf');
    paymentStmt.run(crypto.randomUUID(), childId, 650000, '2026-03-02', 'PAID', 'https://example.com/receipt2.pdf');
    paymentStmt.run(crypto.randomUUID(), childId, 650000, '2026-02-01', 'PAID', 'https://example.com/receipt3.pdf');
    paymentStmt.finalize();


    // 3. Sog'liq (oxirgi 3 ta tekshiruv)
    const healthStmt = db.prepare('INSERT INTO health_checks (id, child_id, date, weight, height, temperature, is_sick, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    healthStmt.run(crypto.randomUUID(), childId, '2026-04-20', 18.5, 105, 36.5, 0, 'Sog\'lom, o\'sish me\'yorda');
    healthStmt.run(crypto.randomUUID(), childId, '2026-03-15', 18.2, 104, 36.6, 0, 'Vazni biroz oshgan');
    healthStmt.run(crypto.randomUUID(), childId, '2026-02-10', 17.8, 103, 36.4, 0, 'Tekshirildi');
    healthStmt.finalize();

    // 4. Emlashlar
    const vaccineStmt = db.prepare('INSERT INTO vaccinations (id, child_id, vaccine_name, planned_date, taken_date, status) VALUES (?, ?, ?, ?, ?, ?)');
    vaccineStmt.run(crypto.randomUUID(), childId, 'Gepatit B', '2026-01-10', '2026-01-10', 'COMPLETED');
    vaccineStmt.run(crypto.randomUUID(), childId, 'Polio', '2026-03-20', '2026-03-22', 'COMPLETED');
    vaccineStmt.run(crypto.randomUUID(), childId, 'Qizamiq', '2026-05-15', null, 'PLANNED');
    vaccineStmt.finalize();

    // 5. O'zlashtirish
    const progressStmt = db.prepare('INSERT INTO progress_reports (id, child_id, date, subject, rating, comment) VALUES (?, ?, ?, ?, ?, ?)');
    progressStmt.run(crypto.randomUUID(), childId, '2026-04-18', 'Rasm chizish', 5, 'Juda chiroyli ranglardan foydalandi');
    progressStmt.run(crypto.randomUUID(), childId, '2026-04-15', 'Nutq o\'stirish', 4, 'She\'rni yoddan ayta oldi');
    progressStmt.run(crypto.randomUUID(), childId, '2026-04-10', 'Matematika', 5, '10 gacha sanashni o\'rgandi');
    progressStmt.finalize();

    // 6. Vakillar (Pickups)
    const pickupStmt = db.prepare('INSERT INTO authorized_pickups (id, child_id, full_name, relation, phone) VALUES (?, ?, ?, ?, ?)');
    pickupStmt.run(crypto.randomUUID(), childId, 'Karimov Alisher', 'Amakisi', '+998 90 111 22 33');
    pickupStmt.run(crypto.randomUUID(), childId, 'Nazarova Gulnora', 'Xolasi', '+998 90 444 55 66');
    pickupStmt.finalize();

    // 7. Menyu (bugun uchun)
    const menuStmt = db.prepare('INSERT OR REPLACE INTO menus (id, date, meal_name, meal_type, age_group, diet_type, calories, vitamins) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    const today = new Date().toISOString().split('T')[0];
    menuStmt.run(crypto.randomUUID(), today, 'Suli bo\'tqasi', 'BREAKFAST', '3-7', 'REGULAR', 250, 'A, B1');
    menuStmt.run(crypto.randomUUID(), today, 'Mastava', 'LUNCH', '3-7', 'REGULAR', 450, 'C, D');
    menuStmt.run(crypto.randomUUID(), today, 'Mevali choy va pechenye', 'TEA', '3-7', 'REGULAR', 150, 'C');
    menuStmt.run(crypto.randomUUID(), today, 'Teftel va pyure', 'DINNER', '3-7', 'REGULAR', 400, 'B12, E');
    menuStmt.finalize();
  });

  console.log('Ma\'lumotlar muvaffaqiyatli kiritildi!');
}

seed();
