import * as queries from '../models/salesorder.model.js'
import * as custQueries from '../models/customer.model.js'
import axios from 'axios'

export const getSO = (req, res) => {
    const token = req.cookies.token

    queries.getSOQ((err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.json(result)
    })
}

const decreaseProductStock = async (idProduct, qty) => {
    try {
        await axios.put(`https://gudang-back-end.vercel.app/products/transferStock/${idProduct}`, {
            stok: qty
        });
    } catch (error) {
        console.error("Error decreasing product stock:", error);
        throw new Error("Error decreasing product stock");
    }
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
                            queries.insertSOProductQ(id_SO, product.id_produk, product.nama_produk, product.kode_produk, product.harga, product.qty, product.remarks, (err, result) => {
                                if (err) {
                                    return res.status(500).json({ error: "Internal Server Error" });
                                }
                                // completedRequests++; //Janlup matiin
                                try {
                                    decreaseProductStock(product.id_produk, product.qty);
                                    completedRequests++;
                                } catch (error) {
                                    return res.status(500).json({ error: "Error decreasing product stock" });
                                }
                            })
                        }
                    }
                    res.json({ success: true, message: "Add Sales Order Success", id_SO: id_SO })
                })
        })
    })

}

export const countNotDelivered = (req, res) => {
    queries.countNotDeliveredQ((err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.json(result)
    })
}

export const setDelivered = (req, res) => {
    const id_SO = req.params.id_SO;
    const status = req.body.status;

    if (status === 1) {
        queries.setDeliveredQ(id_SO, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Internal Server Error" });
            }

            res.json({ success: true, message: "Set Delivered Success" })
        })
    } else if (status === 0) {
        queries.setNotDeliveredQ(id_SO, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Internal Server Error" });
            }

            res.json({ success: true, message: "Set Not Delivered Success" })
        })
    }
}

const increaseProductStock = async (idProduct, qty) => {
    try {
        await axios.put(`https://gudang-back-end.vercel.app/products/addStock/${idProduct}`, {
            stok: qty
        });
    } catch (error) {
        console.error("Error increasing product stock:", error);
        throw new Error("Error increasing product stock");
    }
}

export const deleteSO = (req, res) => {
    const token = req.cookies.token
    const id_SO = req.params.id_SO;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" })
    }

    queries.getCustIdBySOQ(id_SO, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error 1" });
        }

        const customer_id = result[0].customer_id;

        queries.getIdProduct(id_SO, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Internal Server Error 1" });
            }

            const id_products = result;
            // Matiin
            id_products.forEach(row => {
                try {
                    increaseProductStock(row.id_product, row.qty);
                } catch (error) {
                    return res.status(500).json({ error: "Error decreasing product stock" });
                }
            });

            queries.deleteSOProdQ(id_SO, (err, result) => {
                if (err) {
                    return res.status(500).json({ error: "Internal Server Error 3" });
                }

                queries.deleteSOQ(id_SO, (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: "Internal Server Error 4" });
                    }

                    custQueries.deleteCustByIDQ(customer_id, (err, result) => {
                        if (err) {
                            return res.status(500).json({ error: "Internal Server Error 2" });
                        }
                    })

                    res.json({ success: true, message: "Delete Sales Order Success" })
                })
            })
        })

    })
}

export const getSOById = (req, res) => {
    const token = req.cookies.token
    const id_SO = req.params.id_SO;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" })
    }

    queries.getSOByIdQ(id_SO, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.json(result)
    })
}

export const getSalesResult = (req, res) => {
    const token = req.cookies.token
    const id_sales = req.params.id_sales;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" })
    }

    queries.getSalesResultQ(id_sales, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.json(result)
    })
}

export const getSOperDate = (req, res) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" })
    }

    queries.getSOperDateQ((err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.json(result)
    })
}

export const getSOperDateperSales = (req, res) => {
    const token = req.cookies.token
    const sales_id = req.params.sales_id;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" })
    }

    queries.getSOperDateperSalesQ(sales_id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.json(result)
    })
}

export const updateSO = (req, res) => {
    const token = req.cookies.token
    const id_SO = req.params.id_SO;
    const { produkPage2, total_harga, balance_due, productChanged } = req.body;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" })
    }

    queries.updateSOQ(id_SO, total_harga, balance_due, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error" });
        } else {
            if (productChanged) {
                queries.getSOProdByIdSOQ(id_SO, async (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: "Internal Server Error" });
                    }
                    const idSOProd = result;

                    try {
                        for (let i = 0; i < produkPage2.length; i++) {
                            const product = produkPage2[i];
                            const idProd = idSOProd[i].id; // Dapatkan id produk dari salesorder_detail

                            // Bandingkan jumlah produk di produkPage2 dengan yang ada di database
                            const existingQty = idSOProd[i].qty;
                            const newQty = product.qty;
                            const qtyDifference = newQty - existingQty;

                            // Update stok di gudang
                            if (qtyDifference > 0) {
                                // Jika qty bertambah, panggil fungsi untuk menambah stok
                                await decreaseProductStock(product.id_produk, Math.abs(qtyDifference));
                            } else if (qtyDifference < 0) {
                                // Jika qty berkurang, panggil fungsi untuk mengurangi stok
                                await increaseProductStock(product.id_produk, qtyDifference);
                            }

                            // Update detail pesanan
                            queries.updateSOProdQ(idProd, product.id_produk, product.nama_produk, product.kode_produk, product.harga, product.qty, product.remarks, (err, result) => {
                                if (err) {
                                    return res.status(500).json({ error: "Internal Server Error" });
                                }
                            });
                        }

                        res.json({ success: true, message: "Update Sales Order Product Success" });
                    } catch (error) {
                        return res.status(500).json({ error: "Internal Server Error" });
                    }
                })
            } else {
                res.json({ success: true, message: "Update Sales Order Success" });
            }
        }
    })
}