import * as queries from '../models/salesorder.model.js'

export const getSO = (req, res) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ error: "Unauthorized"})
    }

    queries.getSOQ((err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error"});
        }

        res.json(result)
    })
}