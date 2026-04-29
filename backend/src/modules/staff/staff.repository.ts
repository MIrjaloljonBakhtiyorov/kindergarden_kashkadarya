import { db } from '../../db';
import crypto from 'crypto';
import { OperationsRepository } from '../operations/operations.repository';

export class StaffRepository {
  async create(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = crypto.randomUUID();
      const groupId = data.group_id && data.group_id !== '' ? data.group_id : null;
      const phone = data.phone && data.phone !== '' ? data.phone : null;
      const position = data.position && data.position !== '' ? data.position : 'Xodim';
      db.run(
        'INSERT INTO staff (id, full_name, position, phone, email, passport_no, group_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, data.full_name, position, phone, data.email, data.passport_no, groupId, data.status || 'ACTIVE'],
        async function(err) {
          if (err) reject(err);
          else {
            await OperationsRepository.log('CREATE', 'STAFF', data.full_name, 'Yangi xodim ishga qabul qilindi');
            resolve({ id, ...data });
          }
        }
      );
    });
  }

  async update(id: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const groupId = data.group_id && data.group_id !== '' ? data.group_id : null;
      const phone = data.phone && data.phone !== '' ? data.phone : null;
      const position = data.position && data.position !== '' ? data.position : 'Xodim';
      db.run(
        'UPDATE staff SET full_name = ?, position = ?, phone = ?, email = ?, passport_no = ?, group_id = ?, status = ? WHERE id = ?',
        [data.full_name, position, phone, data.email, data.passport_no, groupId, data.status, id],
        async function(err) {
          if (err) reject(err);
          else {
            await OperationsRepository.log('UPDATE', 'STAFF', data.full_name, 'Xodim ma\'lumotlari tahrirlandi');
            resolve();
          }
        }
      );
    });
  }

  async delete(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      db.get('SELECT full_name FROM staff WHERE id = ?', [id], async (err, staff) => {
        const name = staff ? staff.full_name : 'Noma\'lum';
        db.run('DELETE FROM staff WHERE id = ?', [id], async (err) => {
          if (err) reject(err);
          else {
            await OperationsRepository.log('DELETE', 'STAFF', name, 'Xodim ruyxatdan o\'chirildi');
            resolve();
          }
        });
      });
    });
  }

  async findAll(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          s.*, 
          g.name as group_name,
          (SELECT COUNT(*) FROM children WHERE group_id = s.group_id) as child_count
        FROM staff s
        LEFT JOIN groups g ON s.group_id = g.id
        ORDER BY s.created_at DESC
      `, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}
