import * as queries from '../models/salesorder.model.js'
import * as custQueries from '../models/customer.model.js'
import axios from 'axios'

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
                            queries.insertSOProductQ(id_SO, product.id_produk, product.nama_produk, product.kode_produk, product.harga, product.qty, product.remarks, (err, result) => {
                                if (err) {
                                    return res.status(500).json({ error: "Internal Server Error" });
                                }
                                // completedRequests++; //Matiin
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

export const updateSO = (req, res) => {
    const token = req.cookies.token;
    const id_SO = req.params.id_SO;
    const { produkPage2, total_harga, balance_due, productChanged } = req.body;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    queries.updateSOQ(id_SO, total_harga, balance_due, async (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (productChanged) {
            queries.getSOProdByIdSOQ(id_SO, async (err, result) => {
                if (err) {
                    return res.status(500).json({ error: "Internal Server Error" });
                }
                const existingProducts = result;

                try {
                    for (let i = 0; i < existingProducts.length; i++) {
                        const existingProduct = existingProducts[i];
                        const matchedProduct = produkPage2.find(product => product.id_produk === existingProduct.id_product);

                        if (matchedProduct) {
                            const qtyDifference = matchedProduct.qty - existingProduct.qty;

                            //matiin
                            if (qtyDifference !== 0) {
                                if (qtyDifference > 0) {
                                    await decreaseProductStock(existingProduct.id_product, Math.abs(qtyDifference));
                                } else {
                                    await increaseProductStock(existingProduct.id_product, Math.abs(qtyDifference));
                                }
                            }

                            queries.updateSOProdQ(existingProduct.id, matchedProduct.id_produk, matchedProduct.nama_produk, matchedProduct.kode_produk, matchedProduct.harga, matchedProduct.qty, matchedProduct.remarks, (err, result) => {
                                if (err) {
                                    console.error("Error updating sales order product:", err);
                                    return res.status(500).json({ error: "Internal Server Error" });
                                }
                            });
                        } else {
                            //matiin
                            await increaseProductStock(existingProduct.id_product, existingProduct.qty);

                            queries.deleteSOProdByIdQ(existingProduct.id, (err, result) => {
                                if (err) {
                                    console.error("Error deleting sales order product:", err);
                                    return res.status(500).json({ error: "Internal Server Error" });
                                }
                            });
                        }
                    }

                    for (let i = 0; i < produkPage2.length; i++) {
                        const newProduct = produkPage2[i];
                        const matchedExistingProduct = existingProducts.find(product => product.id_product === newProduct.id_produk);

                        if (!matchedExistingProduct) {
                            queries.insertSOProductQ(id_SO, newProduct.id_produk, newProduct.nama_produk, newProduct.kode_produk, newProduct.harga, newProduct.qty, newProduct.remarks, (err, result) => {
                                if (err) {
                                    console.error("Error adding new sales order product:", err);
                                    return res.status(500).json({ error: "Internal Server Error" });
                                }
                            });

                            //matiin
                            await decreaseProductStock(newProduct.id_produk, newProduct.qty);
                        }
                    }

                    res.json({ success: true, message: "Update Sales Order Product Success" });
                } catch (error) {
                    console.error("Error updating sales order:", error);
                    return res.status(500).json({ error: "Internal Server Error" });
                }
            });
        } else {
            res.json({ success: true, message: "Update Sales Order Success" });
        }
    });
};

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

export const setLunas = (req, res) => {
    const token = req.cookies.token
    const id_SO = req.params.id_SO;
    console.log(id_SO)

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" })
    }

    queries.setLunasQ(id_SO, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.json({ success: true, message: "Set Lunas Success" })
    })
}