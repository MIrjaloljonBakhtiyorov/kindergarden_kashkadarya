import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function clearData() {
  const db = await open({
    filename: path.join(__dirname, '../data/kindergarden.db'),
    driver: sqlite3.Database
  });

  console.log('Bolalar jadvalini tozalash boshlandi...');
  
  try {
    await db.exec('DELETE FROM children');
    await db.exec('DELETE FROM parents');
    await db.exec('DELETE FROM parent_accounts');
    console.log('Muvaffaqiyatli: Bolalar, ota-onalar va akkauntlar jadvali tozalandi.');
  } catch (error) {
    console.error('Xatolik yuz berdi:', error);
  } finally {
    await db.close();
  }
}

clearData().catch(console.error);
