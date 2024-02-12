import * as queries from '../models/salesorder.model.js'

export const getSO = (req, res) => {
    const token = req.cookies.token

    queries.getSOQ((err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.json(result)
    })
}

export const addSO = (req, res) => {
    const token = req.cookies.token
    const { nama_cust, no_telp, alamat, sales_id,
        jadwal_kirim, total_harga, metode_dp1, total_dp1,
        balance_due, produkPage2 } = req.body;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" })
    }

    queries.getMaxIDSOQ((err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        let maxIDSO = result[0].maxIDSO; // Misalnya, SM-000002

        // Mengurai ID_SO Terbesar
        let numPart = maxIDSO.split('-')[1];
        let nextNumPart = parseInt(numPart) + 1;
        let id_SO = 'SM-' + nextNumPart.toString().padStart(6, '0'); // Misalnya, SM-000003
        const tanggal_transaksi = new Date().toISOString().split('T')[0];
        const status_terima = 0;

        queries.getCustIdQ(nama_cust, alamat, no_telp, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Internal Server Error" });
            }

            const customer_id = result[0].id;
            let metode_dp2 = req.body.metode_dp2;
            let total_dp2 = req.body.total_dp2;

            if (metode_dp2.trim() === "" || total_dp2 === undefined) {
                metode_dp2 = null;
                total_dp2 = null;
            }

            queries.insertSOQ(id_SO, customer_id, sales_id, tanggal_transaksi,
                jadwal_kirim, total_harga, metode_dp1, total_dp1,
                metode_dp2, total_dp2, balance_due, status_terima, (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: "Internal Server Error" });
                    }
                    else {
                        let completedRequests = 0;
                        for (const product of produkPage2) {
                            queries.insertSOProductQ(id_SO, product.nama_produk, product.kode_produk, product.harga, product.qty, product.remarks, (err, result) => {
                                if (err) {
                                    return res.status(500).json({ error: "Internal Server Error" });
                                }
                                completedRequests++;
                            })
                        }
                    }
                    res.json({ success: true, message: "Add Sales Order Success", id_SO: id_SO} )
                })
        })
    })

}

export const countNotDelivered = (req, res) => {
    const token = req.cookies.token

    queries.countNotDeliveredQ((err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.json(result)
    })
}