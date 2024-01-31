import jwt from 'jsonwebtoken'
import db from '../../db/db.js'
import dotenv from "dotenv";
import crypto from 'crypto'

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

        const sql = `SELECT u.username, u.nama, r.namarole FROM users u JOIN role r WHERE u.idrole = r.idrole AND u.id = ${userId};`

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

export const updateUser = (req, res) => {
    const token = req.cookies.token
    const { username, nama_lengkap, password_lama, password_baru } = req.body;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized"})
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        const userId = decoded.userId

        if (password_lama || password_baru) {
            const hashedPassword = crypto.createHash('md5').update(password_lama).digest('hex');
    
            const sql = `SELECT password FROM users WHERE BINARY password = ? AND id = ${userId}`
            db.query(sql, [hashedPassword], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: "Internal Server Error"});
                }
    
                if (result.length === 0) {
                    return res.status(401).json({ error: "Password lama salah"});
                }
    
                const hashedNewPassword = crypto.createHash('md5').update(password_baru).digest('hex');
    
                const updtSql = `UPDATE users SET username = ?, nama = ?, password = ? WHERE id = ${userId}`
                db.query(updtSql, [username, nama_lengkap, hashedNewPassword], (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: "Internal Server Error"});
                    }
    
                    res.json({ success: true, message: "Update Success"})
                })
            })
        } else {
            const updtSql = `UPDATE users SET username = ?, nama = ? WHERE id = ${userId}`
            db.query(updtSql, [username, nama_lengkap], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: "Internal Server Error"});
                }

                res.json({ success: true, message: "Update Success"})
            })
        }

    } catch (error) {
        return res.status(401).json({ error: "Unauthorized"})
    }
}