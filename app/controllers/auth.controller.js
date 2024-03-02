import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import db from '../../db/db.js'
import dotenv from "dotenv";

dotenv.config();
const SECRET = process.env.SECRET

export const login = async (req, res) => {
    const {username, password} = req.body

    const sql = `SELECT * FROM users WHERE BINARY username = '${username}'`

    db.query(sql, async (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error"});
        }
        if (result.length === 0) {
            return res.status(401).json({ error: "Username or Password is wrong"});
        }

        const user = result[0]
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

        if (hashedPassword !== user.password) {
            return res.status(401).json({ error: "Username or Password is wrong"});
        }

        const token = jwt.sign({ userId: user.id, username: user.username}, SECRET)

        res.cookie('token', token, {httpOnly: true})

        res.json({ success: true, username: username, role: user.role, token})
    })
}

export const logout = async (req, res) => {
    res.clearCookie('token')
    res.json({ success: true, message: "Logout Success"})
}