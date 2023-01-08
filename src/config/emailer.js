const nodemailer = require('nodemailer')
console.log(process.env.HOST,process.env.PORTM, process.env.USER,process.env.PASS);
    const transport = nodemailer.createTransport({
        host: process.env.HOST,
        port: process.env.PORTM,
        secure: true,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        },
        tls:{
            rejectUnauthorized:false
        }
        
        // host: process.env.HOST_G,
        // port: process.env.PORT_G,
        // secure: true,
        // auth: {
        //     user: process.env.USER_G,
        //     pass: process.env.PASS_G
        // } 
    });
 
    module.exports = transport