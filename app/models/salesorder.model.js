import db from '../../db/db.js'

export function insertSOQ() {
    const sql = `INSERT INTO  salesorder 
                ( id_SO, customer_id, sales_id, tanggal_transaksi, 
                jadwal_kirim, total_harga, metode_dp1, total_dp1, 
                metode_dp2, total_dp2, balance_due, status_terima) 
                VALUES ('?','?','?','?',
                '?','?','?','?',
                ?,?,'?','?')`;
}

export function insertSOProductQ() {
    const sql = `INSERT INTO salesorder_detail
                (id_SO, nama_produk, kode_produk, harga_item_ppn, qty, remarks) 
                VALUES (?, ?, ?, ?, ?, ?)`
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
                GROUP BY s.id, s.id_SO, c.nama_cust, c.no_telp, c.alamat, ss.nama_sales, s.tanggal_transaksi, s.jadwal_kirim, s.total_harga, s.total_dp1, s.metode_dp1, s.total_dp2, s.metode_dp2, s.balance_due, s.status_terima;`

    db.query(sql, callback);
}   