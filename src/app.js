const express = require('express');
const app = express();
const router = require('./routes/images'); 
const cv = require('./routes/cv'); 
const vgamesRouter = require('./routes/vgames.routes');
const cors = require('cors');
const path = require('path')

//login
const session = require('express-session');
const cookieParser = require('cookie-parser');

const whiteList =['http://localhost:4200','http://localhost:3100','http://192.168.0.10:4200','https://miwe.onrender.com','https://mkjdev.com','http://mkjdev.com','http://127.0.0.1:5500', 'http://localhost']; //no sirve si es pedido por un server backend
app.use(cors({origin:whiteList}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
 

app.use(cookieParser('algo'));
app.use(session({
    secret:'algo',
    resave:true,        //si la sesión no se modificala guarda igual
    saveUninitialized:true     //si se inicia y no 
}))
app.use('/galeria', router)

//borrado auto según tiempo
// setInterval(() => {
//     const fs = require('fs')
//     var uploadsDir = (path.join(__dirname, '/uploads/email'));
//     var rimraf = require('rimraf')
//     fs.readdir(uploadsDir, function(err, files) {
//     files.forEach(function(file, index) {
//         fs.stat(path.join(uploadsDir, file), function(err, stat) {
//         var endTime, now;
//         if (err) {console.log("asdasd");
//             return console.error(err);
//         }
//         now = new Date().getTime();
//         endTime = new Date(stat.ctime).getTime() + 50000;
//         if (now > endTime) {
//             return rimraf(path.join(uploadsDir, file), function(err) {
//             if (err) {
//                 return console.error(err);
//             }
//             console.log('arachivo borrado');
//             });
//         }
//         });
//     });
//     });
// }, 10000);
//fin

app.use('/download', cv)
app.use('/games', vgamesRouter)
const transport = require('./config/emailer')
app.use('/mail', function (req, res) {
    const {email, name, last_name, phone, message} = req.body
console.log("Enviando correo desde página web");
    let options={
        from:process.env.USER, // sender address         req.body.email
        to: email,// destino a si mismo "mail1", "mail2"       process.env.USER
        subject: 'Correo desde página web', // Subject line
        attachments: [{
            filename: 'logo-page.png',
            path: __dirname +'/templates/logo-page.png',
            cid: 'logo-page' //my mistake was putting "cid:logo@cid" here! 
       }],
        html:` 
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <style>
                 .container{
                     background-image: linear-gradient(to right bottom, #2c282a, #2b2729, #2a2628, #292527, #282426, #272325, #262224, #252123, #242022, #231f21, #221e20, #211d1f);
                     color: white;
                     width: 600px; 
                     min-height: 500px;
                     border-radius: 10px; 
                     padding-top: 20px; 
                 }
                 .inset{
                    padding: 50px;
                    padding-top: 10px;
                 }
                 .mensaje{
                    text-align: justify;
                    font-weight: normal;
                 }
                 .nombre,.correo, .phone{
                    color: rgb(47, 144, 255);
                 }
                 img{
                    margin: 0 auto;
                    display: block;
                 }
                 
                
                    
            </style>
        </head>
        <body>
        
            <div class="container">
                <img src="cid:logo-page" alt="">
                <div class="inset">
                    <h3>Este message fue enviado por: <span class="nombre">${name} ${last_name}</span></h3>
                    <br>
                    <h2 class="mensaje">${message}</h2>
                    <br>
                    <h3>Correo electrónico: <span class="correo">${email}</span></h3>
                    <h3 class="phone">${phone}</h3>
                </div>
            </div>
        </body>
        </html>
        `}

        transport.sendMail(options, (error, info) => {
            if (error) {
                res.status(200).send({"message":error.message});
            } else {
                res.status(200).send({"message":"Enviando correo desde página web"});
            }
        });
})
 
app.use('/maqueta/', express.static(path.join(__dirname,'public')))

// app.use('/maqueta3', (req,res)=>{
//     // return res.status(200).send({"lskdjfsd":"sdkl"})
//     let file = ('./sendfiles/public/index.html',{root:__dirname})
//     res.send({file})
// })


// app.use('/maqueta3', async (req,res)=>{

// const {readFile} = require('fs/promises'); //{} para escoger  require('fs').readFile; una de sus propiedades
 
//     try{
//         res.send( await readFile('./src/sendfiles/public/index.html' , 'utf-8'));
//     }catch (error){
//         console.log(error);
//     }
// })

const fs = require('fs');
const Client = require('ftp');
const config ={
  host: process.env.HOST_FTP, // Aquí va el host del servidor FTP
  user: process.env.USER_FTP, // Aquí va el usuario FTP
  password: process.env.PASS_FTP // Aquí va la contraseña FTP
}
const path = require('path')
    //joining path of directory 
        const directoryPath = path.join(__dirname+'/unknown'); 
        //passsing directoryPath and callback function
        fs.readdir(directoryPath, function (err, files) {
            //handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            } 
            //listing all files using forEach
            files.forEach(function (file) {
                // Do whatever you want to do with the file
                console.log(file); 
            });
        });
module.exports = app
