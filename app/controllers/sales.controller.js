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
    const dateStart = req.body.dateStart
    const dateEnd = req.body.dateEnd

    if (!token) {
        return res.status(401).json({ error: "Unauthorized"})
    }

    queries.getSalesAllByDateQ(dateStart, dateEnd, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error"});
        }

        res.json(result)
    })
}