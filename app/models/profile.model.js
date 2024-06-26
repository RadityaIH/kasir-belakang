import db from '../../db/db.js'

export function getUserQ(userId, callback) {
    const sql = `SELECT username, nama, role, photo_url FROM users WHERE id = ?;`;
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

export function savePhotoUrlQ(userId, photoUrl, callback) {
    const sql = `UPDATE users SET photo_url = ? WHERE id = ?`;
    db.query(sql, [photoUrl, userId], callback);
}

export function deletePhotoUrlQ(userId, callback) {
    const sql = `UPDATE users SET photo_url = NULL WHERE id = ?`;
    db.query(sql, userId, callback);
}

export function getKasirQ(callback) {
    const sql = `SELECT id, nama, username FROM users WHERE role = 'kasir'`;
    db.query(sql, callback);
}

export function addKasirQ(nama, username, password, callback) {
    const sql = `INSERT INTO users (nama, username, password, role) VALUES (?, ?, ?, 'Kasir')`;
    db.query(sql, [nama, username, password], callback);
}

export function updateKasirQ(id, nama, username, callback) {
    const sql = `UPDATE users SET nama = ?, username = ? WHERE id = ?`;
    db.query(sql, [nama, username, id], callback);
}

export function deleteKasirQ(id, callback) {
    const sql = `DELETE FROM users WHERE id = ?`;
    db.query(sql, [id], callback);
}