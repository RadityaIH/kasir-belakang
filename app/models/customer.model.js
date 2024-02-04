import db from '../../db/db.js'

export function getCustQ(callback) {
    const sql = "SELECT * FROM customer";

    db.query(sql, callback);
}

export function updateCustQ(id, nama, alamat, no_telp, callback) {
    const sql = `UPDATE customer SET nama_cust = ?, alamat = ?, no_telp = ? WHERE id = ?`;
    db.query(sql, [nama, alamat, no_telp, id], callback);
}

export function addCustQ(nama, alamat, no_telp
, callback) {
    const sql = `INSERT INTO customer (nama_cust, alamat, no_telp
    ) VALUES (?, ?, ?)`;
    db.query(sql, [nama, alamat, no_telp
    ], callback);
}

/** */