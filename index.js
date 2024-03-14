import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();

import db from './db/db.js';

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(cors({
  origin: 'https://kasir-depan.vercel.app',
  credentials: true,
}));
// app.use(cors())
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'))

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

db.connect(function(err) {
    if (err) throw err;
    console.log("db dah konek lur 🫡");
  });

// nyoba awal
app.get("/cekUser", (req, res) => {
    const sql = "SELECT username FROM users";

    db.query(sql, (err, result) => {
        res.send(result);
    })
})

// import routing
import authRoutes from './app/routes/auth.routes.js';
authRoutes(app);
import profileRoutes from "./app/routes/profile.routes.js";
profileRoutes(app);
import customerRoutes from "./app/routes/customer.routes.js";
customerRoutes(app);
import salesRoutes from "./app/routes/sales.routes.js";
salesRoutes(app);
import salesOrderRoutes from "./app/routes/salesorder.routes.js";
salesOrderRoutes(app);