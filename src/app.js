const express = require('express');
const app = express();
const router = require('./routes/images'); 
const cv = require('./routes/cv'); 
const cors = require('cors');
const path = require('path')

const whiteList =['http://localhost:4200','http://localhost:3100','http://192.168.0.10:4200','http://localhost','https://miwe.onrender.com','https://mkjdev.com','http://mkjdev.com']; //no sirve si es pedido por un server backend
app.use(cors({origin:whiteList}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

//app.use(express.static(path.join(__dirname,'miweb/')))
// app.use(  (req, res,next) => {
//   console.log(path.join(__dirname,'miweb/index.html'));
//     res.sendFile(path.join(__dirname,'miweb/t.txt'))
   
   
// })
app.use('/galeria', router)



    

//borrado auto según tiempo
setInterval(() => {
    const fs = require('fs')
    var uploadsDir = (path.join(__dirname, '/uploads/email'));
    var rimraf = require('rimraf')
    fs.readdir(uploadsDir, function(err, files) {
    files.forEach(function(file, index) {
        fs.stat(path.join(uploadsDir, file), function(err, stat) {
        var endTime, now;
        if (err) {console.log("asdasd");
            return console.error(err);
        }
        now = new Date().getTime();
        endTime = new Date(stat.ctime).getTime() + 50000;
        if (now > endTime) {
            return rimraf(path.join(uploadsDir, file), function(err) {
            if (err) {
                return console.error(err);
            }
            console.log('arachivo borrado');
            });
        }
        });
    });
    });
}, 20000);
//fin

app.use('/download', cv)
module.exports = app
