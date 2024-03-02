import db from '../../db/db.js'

export function getUserQ(userId, callback) {
    const sql = `SELECT username, nama, role FROM users WHERE id = ?;`;
    db.query(sql, userId, callback);
}

export function checkUserPassandIdQ(userId, hashedPassword, callback) {
    const sql = `SELECT password FROM users WHERE BINARY password = ? AND id = ?`;
    db.query(sql, [hashedPassword, userId], callback);
}

export function updateUserWithPasswordQ(userId, username, nama_lengkap, hashedNewPassword, callback) {
    const sql = `UPDATE users SET username = ?, nama = ?, password = ? WHERE id = ?`;
    db.query(sql, [username, nama_lengkap, hashedNewPassword, userId], callback);
}

export function updateUserQ(userId, username, nama_lengkap, callback) {
    const sql = `UPDATE users SET username = ?, nama = ? WHERE id = ?`;
    db.query(sql, [username, nama_lengkap, userId], callback);
}