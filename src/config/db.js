const {createPool} = require('mysql2/promise');

const pool= createPool({
    host:process.env.HOSTDB_ON, //shared ip address de mi cpanel jodeeeer al fin coñooo
    user: process.env.USERDB_ON,
    password:process.env.PASSWORDDB_ON,
    database: process.env.DATABASE_ON

    // host:process.env.HOSTDB,
    // user: process.env.USERDB,
    // password:process.env.PASSWORDDB,
    // database: process.env.DATABASE
})

module.exports=pool
