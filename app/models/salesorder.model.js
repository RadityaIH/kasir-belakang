import db from '../../db/db.js'

export function insertSOQ(id_SO, customer_id, sales_id, tanggal_transaksi,
    jadwal_kirim, total_harga, metode_dp1, total_dp1,
    metode_dp2, total_dp2, balance_due, status_terima, callback) {
    const sql = `INSERT INTO  salesorder 
                ( id_SO, customer_id, sales_id, tanggal_transaksi, 
                jadwal_kirim, total_harga, metode_dp1, total_dp1, 
                metode_dp2, total_dp2, balance_due, status_terima) 
                VALUES ( ?, ?, ?, ?,
                 ?, ?, ?, ?,
                 ?, ?, ?, ?)`;

    db.query(sql, [id_SO, customer_id, sales_id, tanggal_transaksi,
        jadwal_kirim, total_harga, metode_dp1, total_dp1,
        metode_dp2, total_dp2, balance_due, status_terima], callback);
}

export function insertSOProductQ(d_SO, id_product, nama_produk, kode_produk, harga, qty, remarks, callback) {
    const sql = `INSERT INTO salesorder_detail
                (id_SO, id_product, nama_produk, kode_produk, harga_item_ppn, qty, remarks) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`
    
    db.query(sql, [d_SO, id_product, nama_produk, kode_produk, harga, qty, remarks], callback);
}

export function getSOQ(callback) {
    const sql = `SELECT s.id, s.id_SO, c.nama_cust, c.no_telp, c.alamat, ss.nama_sales, s.tanggal_transaksi, s.jadwal_kirim, s.total_harga, s.total_dp1, s.metode_dp1, s.total_dp2, s.metode_dp2, s.balance_due, s.status_terima,
                GROUP_CONCAT(d.nama_produk SEPARATOR ', ') AS nama_produk,
                GROUP_CONCAT(d.kode_produk SEPARATOR ', ') AS kode_produk,
                GROUP_CONCAT(d.harga_item_ppn SEPARATOR ', ') AS harga_item_ppn,
                GROUP_CONCAT(d.qty SEPARATOR ', ') AS qty,
                GROUP_CONCAT(d.remarks SEPARATOR ', ') AS remarks
                FROM salesorder s 
                JOIN salesorder_detail d ON s.id_SO = d.id_SO
                JOIN customer c ON s.customer_id = c.id 
                JOIN sales ss ON s.sales_id = ss.id_sales
                GROUP BY s.id, s.id_SO, c.nama_cust, c.no_telp, c.alamat, ss.nama_sales, s.tanggal_transaksi, s.jadwal_kirim, s.total_harga, s.total_dp1, s.metode_dp1, s.total_dp2, s.metode_dp2, s.balance_due, s.status_terima
                ORDER BY s.id_SO DESC;`

    db.query(sql, callback);
}   

export function getSOByIdQ(id_SO, callback) {
    const sql = `SELECT s.id, s.id_SO, c.nama_cust, c.no_telp, c.alamat, ss.nama_sales, s.tanggal_transaksi, s.jadwal_kirim, s.total_harga, s.total_dp1, s.metode_dp1, s.total_dp2, s.metode_dp2, s.balance_due, s.status_terima,
                GROUP_CONCAT(d.nama_produk SEPARATOR ', ') AS nama_produk,
                GROUP_CONCAT(d.kode_produk SEPARATOR ', ') AS kode_produk,
                GROUP_CONCAT(d.harga_item_ppn SEPARATOR ', ') AS harga_item_ppn,
                GROUP_CONCAT(d.qty SEPARATOR ', ') AS qty,
                GROUP_CONCAT(d.remarks SEPARATOR ', ') AS remarks
                FROM salesorder s 
                JOIN salesorder_detail d ON s.id_SO = d.id_SO
                JOIN customer c ON s.customer_id = c.id 
                JOIN sales ss ON s.sales_id = ss.id_sales
                WHERE s.id_SO = ?
                GROUP BY s.id, s.id_SO, c.nama_cust, c.no_telp, c.alamat, ss.nama_sales, s.tanggal_transaksi, s.jadwal_kirim, s.total_harga, s.total_dp1, s.metode_dp1, s.total_dp2, s.metode_dp2, s.balance_due, s.status_terima
                ORDER BY s.id_SO DESC;`

    db.query(sql, [id_SO], callback);
}

export function getCustIdQ(nama_cust, alamat, no_telp, callback) {
    const sql = `SELECT id FROM customer WHERE nama_cust = ? AND alamat = ? AND no_telp = ?;`

    db.query(sql, [nama_cust, alamat, no_telp], callback);
}

export function getMaxIDSOQ(callback) {
    const sql = `SELECT MAX(id_SO) AS maxIDSO FROM salesorder;`;
    db.query(sql, callback);
}

export function countNotDeliveredQ(callback) {
    const sql = `SELECT COUNT(id_SO) AS total_orders FROM salesorder WHERE status_terima = 0`

    db.query(sql, callback);
}   

export function setDeliveredQ(id_SO, callback) {
    const sql = `UPDATE salesorder SET status_terima = 1 WHERE id_SO = ?`

    db.query(sql, [id_SO], callback);
}

export function setNotDeliveredQ(id_SO, callback) {
    const sql = `UPDATE salesorder SET status_terima = 0 WHERE id_SO = ?`

    db.query(sql, [id_SO], callback);
}

export function deleteSOProdQ(id_SO, callback) {
    const sql = 'DELETE FROM salesorder_detail WHERE id_SO = ?'

    db.query(sql, [id_SO], callback);
}

export function deleteSOQ(id_SO, callback) {
    const sql = 'DELETE FROM salesorder WHERE id_SO = ?'

    db.query(sql, [id_SO], callback);
}

export function getCustIdBySOQ(id_SO, callback) {
    const sql = `SELECT customer_id FROM salesorder WHERE id_SO = ?`

    db.query(sql, [id_SO], callback);
}

export function getIdProduct(id_SO, callback) {
    const sql = `SELECT id_product, qty FROM salesorder_detail WHERE id_SO = ?`

    db.query(sql, [id_SO], callback);
}

export function getSalesResultQ(id_sales, callback) {
    const sql = `SELECT s.sales_id, s.tanggal_transaksi, s.id_SO, (SELECT nama_cust FROM customer c WHERE c.id = s.customer_id) AS nama_cust, s.total_harga FROM salesorder s WHERE sales_id = ?;`

    db.query(sql, [id_sales], callback);
}

export function getSOperDateQ(callback) {
    const sql = `SELECT s.tanggal_transaksi, COUNT(s.id_SO) AS "Jumlah" FROM salesorder s GROUP BY s.tanggal_transaksi`

    db.query(sql, callback);
}

export function getSOperDateperSalesQ(id_sales, callback) {
    const sql = `SELECT s.tanggal_transaksi, COUNT(s.id_SO) AS "Jumlah" FROM salesorder s WHERE s.sales_id = ? GROUP BY s.tanggal_transaksi`

    db.query(sql, [id_sales], callback);
}

export function getSOProdByIdSOQ(id_SO, callback) {
    const sql = `SELECT id, qty, id_product FROM salesorder_detail WHERE id_SO = ?`

    db.query(sql, [id_SO], callback);
}

export function updateSOProdQ(id, id_product, nama_produk, kode_produk, harga, qty, remarks, callback) {
    const sql = `UPDATE salesorder_detail SET id_product = ?, nama_produk = ?, kode_produk = ?, harga_item_ppn = ?, qty = ?, remarks = ? WHERE id = ?`

    db.query(sql, [id_product, nama_produk, kode_produk, harga, qty, remarks, id], callback);
}

export function updateSOQ(id_SO, total_harga, balance_due, callback) {
    const sql = `UPDATE salesorder SET total_harga = ?, balance_due = ? WHERE id_SO = ?`

    db.query(sql, [total_harga, balance_due, id_SO], callback);
}

export function deleteSOProdByIdQ(id, callback) {
    const sql = `DELETE FROM salesorder_detail WHERE id = ?`

    db.query(sql, [id], callback);
}

export function setLunasQ(id_SO, callback) {
    const sql = `UPDATE salesorder SET balance_due = 0 WHERE id_SO = ?`

    db.query(sql, [id_SO], callback);
}