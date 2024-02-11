import mysql from 'mysql'
import dotenv from "dotenv";
dotenv.config();

const options = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: process.env.DB_ENABLE_SSL === 'true' ? {
        minVersion: 'TLSv1.2',
        ca: process.env.TIDB_CA_PATH ? fs.readFileSync(process.env.TIDB_CA_PATH) : undefined
     } : null,
 }
const db = mysql.createConnection(options)
console.log(process.env.DB_HOST)
// const db = mysql.createConnection({
//     host: "gateway01.ap-southeast-1.prod.aws.tidbcloud.com", 
//     user: "NwcVrKHz8mQUFbQ.root", 
//     password: "", 
//     database: "kasir"
// })

export default db