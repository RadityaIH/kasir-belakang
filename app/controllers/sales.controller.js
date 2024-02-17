import * as queries from '../models/sales.model.js'

export const getSales = (req, res) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ error: "Unauthorized"})
    }

    queries.getSalesQ((err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error"});
        }

        res.json(result)
    })
}

export const getSalesAll = (req, res) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ error: "Unauthorized"})
    }

    queries.getSalesAllQ((err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error"});
        }

        res.json(result)
    })
}

export const getSalesAllByDate = (req, res) => {
    const token = req.cookies.token
    const dateStart = req.query.dateStart
    const dateEnd = req.query.dateEnd

    if (!token) {
        return res.status(401).json({ error: "Unauthorized"})
    }

    queries.getSalesAllByDateQ(dateStart, dateEnd, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error"});
        }

        res.json(result)
    })
    console.log(dateStart, dateEnd)
}

export const addSales = (req, res) => {
    const token = req.cookies.token
    const nama_sales = req.body.nama_sales

    if (!token) {
        return res.status(401).json({ error: "Unauthorized"})
    }

    queries.addSalesQ(nama_sales, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error"});
        }

        res.json({ success: true, message: "Add Sales Success" })
    })
}