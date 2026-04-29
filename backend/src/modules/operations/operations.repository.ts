import { db } from '../../db';
import crypto from 'crypto';

export class OperationsRepository {
  static async log(type: string, entity: string, name: string, description: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const id = crypto.randomUUID();
      db.run(
        'INSERT INTO operations_log (id, operation_type, entity_type, entity_name, description) VALUES (?, ?, ?, ?, ?)',
        [id, type, entity, name, description],
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

  async findAll(limit: number = 10): Promise<any[]> {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM operations_log ORDER BY created_at DESC LIMIT ?',
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
        "SELECT * FROM operations_log WHERE created_at >= datetime('now', '-' || ? || ' days') ORDER BY created_at DESC",
        [days],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }
}
