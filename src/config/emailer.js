const nodemailer = require('nodemailer')

    const transport = nodemailer.createTransport({
        name: process.env.USER,
        host: process.env.HOST,
        port: process.env.PORTM,
        secure: true,
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        },
        tls:{
            rejectUnauthorized:false//este y el secure false son de fazt, con mail.correo.com, puerto 587
        }
        
        // host: process.env.HOST_G,
        // port: process.env.PORT_G,
        // secure: true,
        // auth: {
        //     user: process.env.USER_G,
        //     pass: process.env.PASS_G
        // } 
    });


    const transport2 = nodemailer.createTransport({
        nname: process.env.USER_C,
        host: process.env.HOST,
        port: process.env.PORTM,
        secure: true,
        auth: {
            user: process.env.USER_C,
            pass: process.env.PASS_C
        },
        tls:{
            rejectUnauthorized:false//este y el secure false son de fazt, con mail.correo.com, puerto 587
        }
    });
 
    module.exports = transport