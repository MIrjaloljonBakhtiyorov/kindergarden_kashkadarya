import { db } from '../../db';
import crypto from 'crypto';

export class OperationsRepository {
  static async log(type: string, entity: string, name: string, description: string, category: 'INCOMING' | 'OUTGOING' | 'OTHER' = 'OTHER'): Promise<void> {
    return new Promise((resolve, reject) => {
      const id = crypto.randomUUID();
      db.run(
        'INSERT INTO operations_log (id, operation_type, entity_type, entity_name, description, category) VALUES (?, ?, ?, ?, ?, ?)',
        [id, type, entity, name, description, category],
        (err) => {
          if (err) {
            console.error('Logging error:', err);
            resolve(); // Don't block the main operation if logging fails
          } else {
            resolve();
          }
        }
      );
    });
  }

  async findAll(limit: number = 10, includeArchived: boolean = false): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const query = includeArchived 
        ? 'SELECT * FROM operations_log ORDER BY created_at DESC LIMIT ?'
        : 'SELECT * FROM operations_log WHERE is_archived = 0 ORDER BY created_at DESC LIMIT ?';
      
      db.all(query, [limit], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async findByCategory(category: string, limit: number = 20): Promise<any[]> {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM operations_log WHERE category = ? AND is_archived = 0 ORDER BY created_at DESC LIMIT ?',
        [category, limit],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async archive(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE operations_log SET is_archived = 1 WHERE id = ?',
        [id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async findArchived(limit: number = 50): Promise<any[]> {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM operations_log WHERE is_archived = 1 ORDER BY created_at DESC LIMIT ?',
        [limit],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async findRecent(days: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM operations_log WHERE created_at >= datetime('now', '-' || ? || ' days') AND is_archived = 0 ORDER BY created_at DESC",
        [days],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }
}
