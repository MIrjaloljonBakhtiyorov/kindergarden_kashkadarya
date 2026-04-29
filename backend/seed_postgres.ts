import { db } from './src/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const roles = [
  { login: 'admin', role: 'ADMIN', name: 'Administrator' },
  { login: 'director', role: 'DIRECTOR', name: 'Director' },
  { login: 'operator', role: 'OPERATOR', name: 'Operator' },
  { login: 'teacher', role: 'TEACHER', name: 'Teacher' },
  { login: 'nurse', role: 'NURSE', name: 'Nurse' },
  { login: 'dietitian', role: 'DIETITIAN', name: 'Dietitian' },
  { login: 'chef', role: 'CHEF', name: 'Chef' },
  { login: 'storekeeper', role: 'STOREKEEPER', name: 'Storekeeper' },
  { login: 'inspector', role: 'INSPECTOR', name: 'Inspector' },
  { login: 'lab', role: 'LAB_CONTROLLER', name: 'Lab Controller' },
  { login: 'supply', role: 'SUPPLY', name: 'Supply' },
  { login: 'finance', role: 'FINANCE', name: 'Finance' },
];

async function seed() {
  const passwordHash = await bcrypt.hash('123456', 10);
  
  console.log('Seeding initial PostgreSQL data...');

  // 1. Clear existing (optional, but good for fresh start)
  // db.run('DELETE FROM users');

  // 2. Base Users
  for (const user of roles) {
    db.get('SELECT id FROM users WHERE login = ?', [user.login], (err, row) => {
      if (!row) {
        db.run('INSERT INTO users (id, login, password_hash, role, full_name) VALUES (?, ?, ?, ?, ?)',
          [crypto.randomUUID(), user.login, passwordHash, user.role, user.name]);
      }
    });
  }

  // 3. Premium Test Account
  const fatherId = crypto.randomUUID();
  const motherId = crypto.randomUUID();
  const accountId = 'test_parent_acc_id';
  const childId = 'test_child_id';

  db.get('SELECT id FROM parent_accounts WHERE id = ?', [accountId], (err, row) => {
    if (!row) {
      db.run(`INSERT INTO parent_accounts (id, login, password_hash) VALUES (?, ?, ?)`, [accountId, 'parent_test', passwordHash]);
      db.run(`INSERT INTO parents (id, full_name, phone, workplace, passport_no, role) VALUES (?, ?, ?, ?, ?, ?)`, [fatherId, 'Bozorov Iskandar', '+998 90 123 45 67', 'IT Park Academy', 'AA1234567', 'FATHER']);
      db.run(`INSERT INTO parents (id, full_name, phone, workplace, passport_no, role) VALUES (?, ?, ?, ?, ?, ?)`, [motherId, 'Bozorova Nigora', '+998 93 777 88 99', 'Toshkent Tibbiyot Akademiyasi', 'AB7654321', 'MOTHER']);
      db.run(`INSERT INTO children (id, first_name, last_name, birth_date, age_category, gender, address, weight, height, allergies, birth_certificate_number, parent_account_id, father_id, mother_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [childId, 'Mustafo', 'Bozorov', '2020-05-15', '3-7 yosh', 'M', 'Toshkent sh, Chilonzor 5-mavze, 12-uy', 19.2, 118, 'Asal va yong\'oq', 'GC-7788990', accountId, fatherId, motherId, 'ACTIVE']);

      // 4. Seeding Attendance
      const dates = ['2026-04-20', '2026-04-21', '2026-04-22', '2026-04-23', '2026-04-24'];
      dates.forEach(date => {
        db.run(`INSERT INTO attendance (id, child_id, date, status) VALUES (?, ?, ?, ?) ON CONFLICT DO NOTHING`, 
          [crypto.randomUUID(), childId, date, date === '2026-04-22' ? 'ABSENT' : 'PRESENT']);
      });
    }
  });

  console.log('Seeding process initiated. Note: Operations are async.');
}

seed().catch(console.error);
