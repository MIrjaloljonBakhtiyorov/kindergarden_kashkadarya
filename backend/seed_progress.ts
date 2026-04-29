import { db } from './src/db';
import crypto from 'crypto';

const today = new Date().toISOString().split('T')[0];

const activities = [
  { subject: 'Yod olish', comment: 'Bugun juda chiroyli sher yod oldi va barchaga aytib berdi.', rating: 5 },
  { subject: 'San\'at', comment: 'Tabiat mavzusida juda yorqin rasm chizdi.', rating: 5 },
  { subject: 'Odobnoma', comment: 'Dars vaqtida juda intizomli bo\'ldi va do\'stlariga yordam berdi.', rating: 4 },
  { subject: 'Matematika', comment: 'Sanoq mashqlarini xatosiz bajardi.', rating: 5 }
];

db.serialize(() => {
  db.all('SELECT id FROM children', [], (err, children: any[]) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log(`Seeding progress for ${children.length} children...`);
    
    const stmt = db.prepare(`
      INSERT INTO progress_reports (id, child_id, date, subject, rating, comment)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    children.forEach(child => {
      activities.forEach(act => {
        stmt.run(crypto.randomUUID(), child.id, today, act.subject, act.rating, act.comment);
      });
    });

    stmt.finalize();
    console.log('Progress reports seeded successfully.');
    
    setTimeout(() => process.exit(0), 1000);
  });
});
