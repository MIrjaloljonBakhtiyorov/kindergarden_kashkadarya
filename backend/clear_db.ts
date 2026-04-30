import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../data/kindergarden.db');

const db = new sqlite3.Database(dbPath);

const tablesToClear = [
  'groups', 'parents', 'parent_accounts', 'children',
  'operations_log', 'payments', 'progress_reports', 'authorized_pickups', 
  'vaccinations', 'documents', 'staff', 'health_checks', 'dishes', 
  'menus', 'products', 'inventory_batches', 'inventory_transactions', 
  'lab_samples', 'audits', 'audit_items', 'finance_transactions', 
  'required_products', 'supply_orders', 'suppliers', 'messages', 
  'chef_sanitary_checks', 'kitchen_tasks', 'attendance', 'purchase_plans'
];

db.serialize(() => {
  db.run("PRAGMA foreign_keys = OFF");

  console.log("Ma'lumotlar bazasini tozalash boshlandi...");

  tablesToClear.forEach(table => {
    db.run(`DELETE FROM ${table}`, (err) => {
      if (err) {
        console.error(`Xatolik ${table} jadvalini tozalashda:`, err.message);
      } else {
        console.log(`${table} jadvali tozalandi.`);
      }
    });
  });

  // Clear users except admin
  db.run(`DELETE FROM users WHERE login != 'admin'`, (err) => {
    if (err) {
      console.error('Xatolik users jadvalini tozalashda:', err.message);
    } else {
      console.log('users jadvali tozalandi (admin qoldirildi).');
    }
  });

  db.run("PRAGMA foreign_keys = ON");
  console.log("Barcha ma'lumotlar muvaffaqiyatli tozalandi!");
});

db.close();
