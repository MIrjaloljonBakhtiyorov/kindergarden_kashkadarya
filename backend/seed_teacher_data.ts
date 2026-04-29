import sqlite3 from 'sqlite3';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

const firstNames = ['Aziz', 'Sardor', 'Malika', 'Jasur', 'Laylo', 'Otabek', 'Madina', 'Dilshod', 'Zuhra', 'Anvar'];
const lastNames = ['Karimov', 'Abduvohidov', 'Sultonova', 'Rahimov', 'Usmanova', 'Toshpo`latov', 'Ismoilova', 'Zokirov'];

async function seedData() {
  db.serialize(async () => {
    // 1. Guruhlarni yaratish
    const groupNames = ['Quyoshcha', 'Yulduzcha', 'Kamalak', 'Lola'];
    const groupIds: string[] = [];

    console.log("Guruhlar yaratilmoqda...");
    for (const name of groupNames) {
      const id = crypto.randomUUID();
      groupIds.push(id);
      db.run("INSERT INTO groups (id, name, teacher_name, capacity, age_limit) VALUES (?, ?, ?, ?, ?)", 
        [id, name, 'Tarbiyachi ' + name, 25, '3-5']);
    }

    // 2. 50 ta bolani yaratish
    console.log("50 ta bola qo'shilmoqda...");
    for (let i = 0; i < 50; i++) {
      const childId = crypto.randomUUID();
      const fatherId = crypto.randomUUID();
      const motherId = crypto.randomUUID();
      const accountId = crypto.randomUUID();

      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const groupId = groupIds[i % 4]; // 4 ta guruhga teng taqsimlash

      // Ota-onalar
      db.run("INSERT INTO parents (id, full_name, phone, role) VALUES (?, ?, ?, ?)", 
        [fatherId, lName + ' ' + fName + 'ning otasi', '+9989012345' + i, 'FATHER']);
      db.run("INSERT INTO parents (id, full_name, phone, role) VALUES (?, ?, ?, ?)", 
        [motherId, lName + ' ' + fName + 'ning onasi', '+9989012345' + (i+50), 'MOTHER']);

      // Hisob (Password: 12345678)
      db.run("INSERT INTO parent_accounts (id, login, password_hash) VALUES (?, ?, ?)", 
        [accountId, 'user_' + i, '$2a$10$rB778vLdI.3W9.AUt7Z8E.E2Y8aF9qUfWvO.K9Q1Xy.Z3L4M5N6O7']); // hash for '12345678'

      // Bola
      db.run(`INSERT INTO children 
        (id, first_name, last_name, birth_date, age_category, gender, birth_certificate_number, status, father_id, mother_id, parent_account_id, group_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [childId, fName, lName, '2020-05-15', 'Orta guruh', i % 2 === 0 ? 'M' : 'F', 'AA' + (100000 + i), 'ACTIVE', fatherId, motherId, accountId, groupId]
      );
    }

    console.log("Ma'lumotlar muvaffaqiyatli qo'shildi!");
  });
}

seedData();
