const {createPool} = require('mysql2/promise');

 
 
const pool= createPool({
    host:process.env.HOSTDB,
    user: process.env.USERDB,
    password:process.env.PASSWORDDB,
    database: process.env.DATABASE
})

module.exports=pool