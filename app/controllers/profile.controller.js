import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import crypto from 'crypto'
import * as queries from '../models/profile.model.js';
import fs from 'fs';
import path from 'path';

dotenv.config();

const SECRET = process.env.SECRET

export const getUser = (req, res) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" })
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        const userId = decoded.userId

        queries.getUserQ(userId, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Internal Server Error" });
            }
            if (result.length === 0) {
                return res.status(401).json({ error: "User tidak ditemukan" });
            }

            const user = result[0]

            res.json({ success: true, username: user.username, nama: user.nama, role: user.role, photo_url: user.photo_url })
        })
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized" })
    }
}

export const updateUser = (req, res) => {
    const token = req.cookies.token
    const { username, nama_lengkap, password_lama, password_baru } = req.body;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" })
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        const userId = decoded.userId

        if (password_lama || password_baru) {
            const hashedPassword = crypto.createHash('md5').update(password_lama).digest('hex');

            queries.checkUserPassandIdQ(userId, hashedPassword, (err, result) => {
                if (err) {
                    return res.status(500).json({ error: "Internal Server Error" });
                }

                if (result.length === 0) {
                    return res.status(401).json({ error: "Password lama salah" });
                }

                const hashedNewPassword = crypto.createHash('md5').update(password_baru).digest('hex');

                queries.updateUserWithPasswordQ(userId, username, nama_lengkap, hashedNewPassword, (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: "Internal Server Error" });
                    }

                    res.json({ success: true, message: "Update Success" })
                })
            })
        } else {
            queries.updateUserQ(userId, username, nama_lengkap, (err, result) => {
                if (err) {
                    return res.status(500).json({ error: "Internal Server Error" });
                }

                res.json({ success: true, message: "Update Success" })
            })
        }

    } catch (error) {
        return res.status(401).json({ error: "Unauthorized" })
    }
}

export const uploadPhoto = (req, res) => {
    const token = req.cookies.token
    
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" })
    }
    
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const photoUrl = `/uploads/${req.file.filename}`;
    console.log(photoUrl)

    try {
        const decoded = jwt.verify(token, SECRET);
        const userId = decoded.userId

        queries.savePhotoUrlQ(userId, photoUrl, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Internal Server Error" });
            }

            res.json({ success: true, message: "Upload Success" })
        })
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized" })
    }
}

export const deletePhoto = (req, res) => {
    const token = req.cookies.token
    const { photo_url } = req.body

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" })
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        const userId = decoded.userId
        fs.unlink(photo_url, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            queries.deletePhotoUrlQ(userId, (err, result) => {
                if (err) {
                    return res.status(500).json({ error: "Internal Server Error" });
                }

                res.json({ success: true, message: "Delete Success" });
            });
        });
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized" })
    }
}

export const getKasir = (req, res) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" })
    }

    queries.getKasirQ((err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.json(result)
    })
}

export const addKasir = (req, res) => {
    const token = req.cookies.token
    const { nama, username } = req.body;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" })
    }
    const password = username.toLowerCase()

    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

    queries.addKasirQ(nama, username, hashedPassword, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.json({ success: true, message: "Add Kasir Success" })
    })
}

export const updateKasir = (req, res) => {
    const token = req.cookies.token
    const { id, nama, username } = req.body;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" })
    }

    queries.updateKasirQ(id, nama, username, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.json({ success: true, message: "Update Kasir Success" })
    })
}

export const deleteKasir = (req, res) => {
    const token = req.cookies.token
    const id = req.params.id;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" })
    }

    queries.deleteKasirQ(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.json({ success: true, message: "Delete Kasir Success" })
    })
}