import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import multer from 'multer';
import sharp from 'sharp';

dotenv.config();
const app = express();

import db from './db/db.js';

// const customCors = (req, callback) => {
//   let corsOptions;
//   const allowedOrigins = ['http://localhost:3000', 'https://kasir-depan.vercel.app'];
//   const origin = req.header('Origin');

//   if (allowedOrigins.includes(origin)) {
//       corsOptions = {
//           origin: true,
//           credentials: true,
//       };
//   } else {
//       corsOptions = {
//           origin: false,
//       };
//   }
//   callback(null, corsOptions);
// };

// app.use(cors(customCors));

app.use(cors({
  origin: 'http://localhost:3000',
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


//Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './uploads'); // Menyimpan file di folder 'uploads'
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Memberikan nama unik untuk file
  }
});

const upload = multer({ storage: storage });
export default upload
// Add this line to serve static files
app.use('/uploads', express.static('uploads'));


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