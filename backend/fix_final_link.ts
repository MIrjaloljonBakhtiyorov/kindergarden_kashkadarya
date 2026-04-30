import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('data/kindergarden.db');

db.serialize(() => {
    // Find the teacher's group
    db.get("SELECT group_id FROM staff s JOIN users u ON s.user_id = u.id WHERE u.login = 'teacher' LIMIT 1", (err, row: any) => {
        if (row && row.group_id) {
            console.log('Teacher group found:', row.group_id);
            db.run("UPDATE children SET group_id = ? WHERE id = 'test_child_id'", [row.group_id], (err) => {
                if (err) console.error(err);
                else console.log('Successfully linked child to teacher group');
            });
        } else {
            console.log('Teacher group not found. Finding any group...');
            db.get("SELECT id FROM groups LIMIT 1", (err, g: any) => {
                if (g) {
                    db.run("UPDATE children SET group_id = ? WHERE id = 'test_child_id'", [g.id]);
                    console.log('Linked child to group', g.id);
                    db.run("UPDATE staff SET group_id = ? WHERE user_id = (SELECT id FROM users WHERE login = 'teacher')", [g.id]);
                    console.log('Linked teacher to group', g.id);
                }
            });
        }
    });
});
setTimeout(() => db.close(), 2000);
