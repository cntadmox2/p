const nodemailer = require('nodemailer')
 
    const transport = nodemailer.createTransport({
        host: "mkjdev.com",
        port: 465,
        auth: {
            user: "mghp@mkjdev.com",
            pass: "#mi12mi12M"
        },
    });
 
    module.exports = transport
 