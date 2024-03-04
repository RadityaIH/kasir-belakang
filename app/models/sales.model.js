import db from '../../db/db.js'

export function getSalesQ(callback) {
    const sql = "SELECT * FROM sales WHERE aktif = '1'";

    db.query(sql, callback);
}

export function getAllSalesQ(callback) {
    const sql = "SELECT * FROM sales ORDER BY aktif DESC, id_sales ASC";

    db.query(sql, callback);
}

export function getSalesAllQ(callback) {
    const sql = `SELECT ss.id_sales, ss.nama_sales AS "Nama", COUNT(so.id_SO) AS "Penjualan" FROM sales ss LEFT JOIN salesorder so ON ss.id_sales = so.sales_id WHERE ss.aktif = '1' GROUP BY ss.id_sales, ss.nama_sales ORDER BY ss.id_sales`;

    db.query(sql, callback);
}

export function getSalesAllByDateQ(dateStart, dateEnd, callback) {
    const sql = `SELECT ss.id_sales, ss.nama_sales AS "Nama", COUNT(so.id_SO) AS "Penjualan" FROM sales ss LEFT JOIN salesorder so ON ss.id_sales = so.sales_id WHERE so.tanggal_transaksi BETWEEN ? AND ? AND ss.aktif = '1' GROUP BY ss.id_sales, ss.nama_sales ORDER BY ss.id_sales`;

    db.query(sql, [dateStart, dateEnd], callback);
}

export function addSalesQ(nama_sales, callback) {
    const sql = `INSERT INTO sales (nama_sales) VALUES (?)`;

    db.query(sql, [nama_sales], callback);
}

export function updateSalesQ(id, nama_sales, callback) {
    const sql = `UPDATE sales SET nama_sales = ? WHERE id_sales = ?`;

    db.query(sql, [nama_sales, id], callback);
}

export function deleteSalesQ(id, callback) {
    const sql = `UPDATE sales SET aktif = 0, nama_sales = CONCAT('[Ex] ', nama_sales) WHERE id_sales = ?`;

    db.query(sql, [id], callback);
}