const nodemailer = require('nodemailer')
 
    const transport = nodemailer.createTransport({
        host: process.env.HOST,
        port: process.env.PORTM,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        },
    });
 
    module.exports = transport
 
