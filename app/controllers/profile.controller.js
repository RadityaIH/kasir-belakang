import jwt from 'jsonwebtoken'
import db from '../../db/db.js'
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.SECRET

export const getUser = (req, res) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ error: "Unauthorized"})
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        const userId = decoded.userId

        const sql = `SELECT u.username, k.nama, r.namarole FROM users u JOIN kasir k JOIN role r WHERE u.id = k.id AND u.idrole = r.idrole AND u.id = ${userId};`

        db.query(sql, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Internal Server Error"});
            }
            if (result.length === 0) {
                return res.status(401).json({ error: "User tidak ditemukan"});
            }

            const user = result[0]

            res.json({ success: true, username: user.username, nama: user.nama, role: user.namarole})
        })
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized"})
    }
}