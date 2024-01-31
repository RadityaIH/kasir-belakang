import * as queries from '../models/customer.model.js'

export const getCust = (req, res) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ error: "Unauthorized"})
    }

    queries.getCustQ((err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error"});
        }

        res.json(result)
    })
}

export const updateCust = (req, res) => {
    const token = req.cookies.token
    const { id, nama, no_telp, alamat } = req.body;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized"})
    }

    queries.updateCustQ(id, nama, alamat, no_telp, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error"});
        }

        res.json({ success: true, message: "Update Customer Success"})
    })
}

export const addCust = (req, res) => {
    const token = req.cookies.token
    const { nama, alamat, no_telp } = req.body;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized"})
    }

    queries.addCustQ(nama, alamat, no_telp, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error"});
        }

        res.json({ success: true, message: "Add Customer Success"})
    })
}