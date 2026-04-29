import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Bazani loyihaning ildizidagi 'data' papkasiga joylashtiramiz
const dbPath = path.resolve(__dirname, '../../data/kindergarden.db');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    db.run("PRAGMA foreign_keys = ON");
    initDb();
  }
});

function addColumnIfNotExists(tableName: string, columnName: string, columnType: string) {
  db.get(`PRAGMA table_info(${tableName})`, (err, info) => {
    // This only gets the first column, we need to check all
    db.all(`PRAGMA table_info(${tableName})`, (err, columns: any[]) => {
      if (err) return;
      const exists = columns.some(col => col.name === columnName);
      if (!exists) {
        db.run(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}`);
      }
    });
  });
}

function initDb() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS groups (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        teacher_name TEXT,
        capacity INTEGER,
        age_limit TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS parents (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        workplace TEXT,
        phone TEXT NOT NULL,
        passport_no TEXT,
        role TEXT NOT NULL
      )
    `);
    addColumnIfNotExists('parents', 'passport_no', 'TEXT');

    db.run(`
      CREATE TABLE IF NOT EXISTS parent_accounts (
        id TEXT PRIMARY KEY,
        login TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        status TEXT DEFAULT 'ACTIVE'
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS children (
        id TEXT PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        birth_date TEXT NOT NULL,
        age_category TEXT NOT NULL,
        gender TEXT NOT NULL,
        address TEXT,
        weight REAL,
        height REAL,
        allergies TEXT,
        passport_info TEXT,
        birth_certificate_number TEXT NOT NULL,
        medical_notes TEXT,
        status TEXT DEFAULT 'DRAFT',
        father_id TEXT,
        mother_id TEXT,
        parent_account_id TEXT,
        group_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (father_id) REFERENCES parents(id),
        FOREIGN KEY (mother_id) REFERENCES parents(id),
        FOREIGN KEY (parent_account_id) REFERENCES parent_accounts(id),
        FOREIGN KEY (group_id) REFERENCES groups(id)
      )
    `);
    addColumnIfNotExists('children', 'address', 'TEXT');
    addColumnIfNotExists('children', 'weight', 'REAL');
    addColumnIfNotExists('children', 'height', 'REAL');
    addColumnIfNotExists('children', 'allergies', 'TEXT');

    db.run(`
      CREATE TABLE IF NOT EXISTS menus (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        meal_name TEXT NOT NULL,
        meal_type TEXT NOT NULL,
        iron REAL,
        carbohydrates REAL,
        vitamins TEXT,
        calories REAL,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    addColumnIfNotExists('menus', 'image_url', 'TEXT');

    db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        sender_id TEXT NOT NULL,
        receiver_id TEXT NOT NULL,
        content TEXT NOT NULL,
        status TEXT DEFAULT 'SENT',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        receipt_url TEXT,
        status TEXT DEFAULT 'PAID',
        FOREIGN KEY (child_id) REFERENCES children(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS attendance (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        reason TEXT,
        UNIQUE(child_id, date),
        FOREIGN KEY (child_id) REFERENCES children(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        file_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (child_id) REFERENCES children(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS authorized_pickups (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        full_name TEXT NOT NULL,
        relation TEXT NOT NULL,
        phone TEXT NOT NULL,
        photo_url TEXT,
        FOREIGN KEY (child_id) REFERENCES children(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS progress_reports (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        date TEXT NOT NULL,
        subject TEXT NOT NULL,
        rating INTEGER,
        comment TEXT,
        FOREIGN KEY (child_id) REFERENCES children(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS vaccinations (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        vaccine_name TEXT NOT NULL,
        planned_date TEXT NOT NULL,
        taken_date TEXT,
        status TEXT DEFAULT 'PLANNED',
        FOREIGN KEY (child_id) REFERENCES children(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS staff (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        position TEXT,
        phone TEXT,
        email TEXT,
        passport_no TEXT,
        group_id TEXT,
        status TEXT DEFAULT 'ACTIVE',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (group_id) REFERENCES groups(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        login TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        full_name TEXT,
        status TEXT DEFAULT 'ACTIVE',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS health_checks (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        date TEXT NOT NULL,
        weight REAL,
        height REAL,
        temperature REAL,
        allergy TEXT,
        is_sick BOOLEAN,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (child_id) REFERENCES children(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS operations_log (
        id TEXT PRIMARY KEY,
        operation_type TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_name TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Lab Samples Table
    db.run(`
      CREATE TABLE IF NOT EXISTS lab_samples (
        id TEXT PRIMARY KEY,
        sample_id TEXT UNIQUE NOT NULL,
        dish_id TEXT,
        dish_name TEXT NOT NULL,
        batch_reference TEXT,
        date TEXT NOT NULL,
        storage_location TEXT,
        storage_duration INTEGER DEFAULT 72,
        status TEXT NOT NULL,
        lab_result TEXT,
        risk_level TEXT NOT NULL,
        notes TEXT,
        test_results TEXT, -- JSON string
        storage_temp_history TEXT, -- JSON string
        nutrition TEXT, -- JSON string
        created_by TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Audits & Inspections
    db.run(`
      CREATE TABLE IF NOT EXISTS audits (
        id TEXT PRIMARY KEY,
        inspection_id TEXT UNIQUE NOT NULL,
        inspection_type TEXT NOT NULL,
        overall_result TEXT NOT NULL,
        severity TEXT NOT NULL,
        notes TEXT,
        created_by TEXT,
        status TEXT DEFAULT 'OPEN',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS audit_items (
        id TEXT PRIMARY KEY,
        audit_id TEXT NOT NULL,
        question TEXT NOT NULL,
        result TEXT NOT NULL,
        note TEXT,
        severity TEXT,
        FOREIGN KEY (audit_id) REFERENCES audits(id)
      )
    `);

    // Finance Transactions
    db.run(`
      CREATE TABLE IF NOT EXISTS finance_transactions (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        category TEXT NOT NULL,
        item TEXT NOT NULL,
        amount REAL NOT NULL,
        quantity TEXT,
        price_per_unit TEXT,
        type TEXT DEFAULT 'EXPENSE',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        unit TEXT NOT NULL,
        brand TEXT,
        min_stock REAL DEFAULT 0
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS inventory_batches (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        batch_number TEXT,
        invoice_number TEXT,
        quantity REAL NOT NULL,
        price_per_unit REAL,
        total_price REAL,
        received_date TEXT NOT NULL,
        expiry_date TEXT,
        supplier TEXT,
        storage_location TEXT,
        storage_temp REAL,
        notes TEXT,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);
    addColumnIfNotExists('inventory_batches', 'batch_number', 'TEXT');
    addColumnIfNotExists('inventory_batches', 'invoice_number', 'TEXT');

    db.run(`
      CREATE TABLE IF NOT EXISTS inventory_transactions (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        type TEXT NOT NULL,
        quantity REAL NOT NULL,
        price REAL,
        date TEXT NOT NULL,
        batch_id TEXT,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    // Required Products for Procurement Plan
    db.run(`
      CREATE TABLE IF NOT EXISTS required_products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL,
        quantity REAL NOT NULL,
        unit TEXT NOT NULL, -- kg, litr, dona
        brand TEXT,
        category TEXT,
        status TEXT DEFAULT 'PENDING', -- PENDING, ORDERED, RECEIVED
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Supply Orders
    db.run(`
      CREATE TABLE IF NOT EXISTS supply_orders (
        id TEXT PRIMARY KEY,
        order_id TEXT UNIQUE NOT NULL,
        vendor TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        items TEXT, -- JSON string
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS suppliers (
        id TEXT PRIMARY KEY,
        first_name TEXT,
        last_name TEXT,
        brand TEXT,
        name TEXT, -- Full name or brand display name
        type TEXT,
        score REAL,
        phone TEXT,
        contact_user TEXT,
        telegram_link TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });
}
