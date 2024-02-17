import db from '../../db/db.js'

export function getSalesQ(callback) {
    const sql = "SELECT * FROM sales";

    db.query(sql, callback);
}

export function getSalesAllQ(callback) {
    const sql = `SELECT ss.id_sales, ss.nama_sales AS "Nama", COUNT(so.id_SO) AS "Penjualan" FROM sales ss LEFT JOIN salesorder so ON ss.id_sales = so.sales_id GROUP BY so.sales_id`;

    db.query(sql, callback);
}

export function getSalesAllByDateQ(dateStart, dateEnd, callback) {
    const sql = `SELECT ss.id_sales, ss.nama_sales AS "Nama", COUNT(so.id_SO) AS "Penjualan" FROM sales ss LEFT JOIN salesorder so ON ss.id_sales = so.sales_id WHERE so.tanggal_transaksi BETWEEN ? AND ? GROUP BY so.sales_id`;

    db.query(sql, [dateStart, dateEnd], callback);
}

export function addSalesQ(nama_sales, callback) {
    const sql = `INSERT INTO sales (nama_sales) VALUES (?)`;

    db.query(sql, [nama_sales], callback);
}