import { db } from '../../db';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { OperationsRepository } from '../operations/operations.repository';

export class ChildrenRepository {
  async create(data: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const childId = crypto.randomUUID();
      const fatherId = crypto.randomUUID();
      const motherId = crypto.randomUUID();
      const accountId = crypto.randomUUID();

      const login = `user_${Date.now().toString().slice(-6)}`;
      
      // Murakkab 8 xonali parol generatsiya qilish
      const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
      let password = "";
      for (let i = 0; i < 8; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      
      const passwordHash = await bcrypt.hash(password, 10);

      db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        const stmtParent = db.prepare('INSERT INTO parents (id, full_name, workplace, phone, passport_no, role) VALUES (?, ?, ?, ?, ?, ?)');
        stmtParent.run([fatherId, data.father_full_name, data.father_workplace, data.father_phone, data.father_passport, 'FATHER']);
        stmtParent.run([motherId, data.mother_full_name, data.mother_workplace, data.mother_phone, data.mother_passport, 'MOTHER']);
        stmtParent.finalize();

        const stmtAccount = db.prepare('INSERT INTO parent_accounts (id, login, password_hash) VALUES (?, ?, ?)');
        stmtAccount.run([accountId, login, passwordHash]);
        stmtAccount.finalize();

        const stmtChild = db.prepare(`
          INSERT INTO children 
          (id, first_name, last_name, birth_date, age_category, gender, address, weight, height, allergies, passport_info, birth_certificate_number, medical_notes, status, father_id, mother_id, parent_account_id, group_id) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const groupId = data.group_id && data.group_id !== '' ? data.group_id : null;
        stmtChild.run([
          childId, data.first_name, data.last_name, data.birth_date, data.age_category, data.gender,
          data.address, data.weight, data.height, data.allergies,
          data.passport_info, data.birth_certificate_number, data.medical_notes, data.status, fatherId, motherId, accountId, groupId
        ], async function(err) {
          if (err) {
            db.run('ROLLBACK');
            return reject(err);
          }
          await OperationsRepository.log('CREATE', 'CHILD', `${data.first_name} ${data.last_name}`, 'Yangi bola ruyxatga olindi');
          db.run('COMMIT');
          resolve({ id: childId, login, password }); // Password returned only once on creation
        });
        stmtChild.finalize();
      });
    });
  }

  async update(id: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        // Update child info
        const stmtChild = db.prepare(`
          UPDATE children SET 
            first_name = ?, last_name = ?, birth_date = ?, age_category = ?, gender = ?, 
            address = ?, weight = ?, height = ?, allergies = ?,
            passport_info = ?, birth_certificate_number = ?, medical_notes = ?, status = ?, group_id = ?
          WHERE id = ?
        `);
        const groupId = data.group_id && data.group_id !== '' ? data.group_id : null;
        stmtChild.run([
          data.first_name, data.last_name, data.birth_date, data.age_category, data.gender,
          data.address, data.weight, data.height, data.allergies,
          data.passport_info, data.birth_certificate_number, data.medical_notes, data.status, groupId, id
        ]);
        stmtChild.finalize();

        // Find parent IDs to update them too
        db.get('SELECT father_id, mother_id FROM children WHERE id = ?', [id], async (err, child: any) => {
          if (err || !child) {
            db.run('ROLLBACK');
            return reject(err || new Error('Child not found'));
          }

          try {
            const stmtParent = db.prepare('UPDATE parents SET full_name = ?, workplace = ?, phone = ?, passport_no = ? WHERE id = ?');
            stmtParent.run([data.father_full_name, data.father_workplace, data.father_phone, data.father_passport, child.father_id]);
            stmtParent.run([data.mother_full_name, data.mother_workplace, data.mother_phone, data.mother_passport, child.mother_id]);
            stmtParent.finalize();

            await OperationsRepository.log('UPDATE', 'CHILD', `${data.first_name} ${data.last_name}`, 'Bolaning ma\'lumotlari tahrirlandi');
            
            db.run('COMMIT', (err) => {
              if (err) {
                db.run('ROLLBACK');
                reject(err);
              } else {
                resolve();
              }
            });
          } catch (error) {
            db.run('ROLLBACK');
            reject(error);
          }
        });
      });
    });
  }

  async delete(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      db.get('SELECT first_name, last_name FROM children WHERE id = ?', [id], async (err, child: any) => {
        const name = child ? `${child.first_name} ${child.last_name}` : 'Noma\'lum';
        db.run('DELETE FROM children WHERE id = ?', [id], async (err) => {
          if (err) reject(err);
          else {
            await OperationsRepository.log('DELETE', 'CHILD', name, 'Bolalar ruyxatidan o\'chirildi');
            resolve();
          }
        });
      });
    });
  }

  async findAll(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT c.*, 
               f.full_name as father_name, f.phone as father_phone, f.passport_no as father_passport, f.workplace as father_workplace,
               m.full_name as mother_name, m.phone as mother_phone, m.passport_no as mother_passport, m.workplace as mother_workplace,
               pa.login as parent_login,
               g.name as group_name,
               g.teacher_name as group_teacher
        FROM children c
        LEFT JOIN parents f ON c.father_id = f.id
        LEFT JOIN parents m ON c.mother_id = m.id
        LEFT JOIN parent_accounts pa ON c.parent_account_id = pa.id
        LEFT JOIN groups g ON c.group_id = g.id
        ORDER BY c.created_at DESC
      `, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}
