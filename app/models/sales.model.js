import db from '../../db/db.js'

export function getSalesQ(callback) {
    const sql = "SELECT * FROM sales";

    db.query(sql, callback);
}