const express = require('express');
const app = express();
const router = require('./routes/images'); 
const cv = require('./routes/cv'); 
const cors = require('cors');
const path = require('path')
console.log("KLLJLKJKLJLJKKLJJK");
const whiteList =[ 'http://localhost:4200','http://localhost:3100','http://192.168.0.10:4200','http://localhost','https://miwe.onrender.com']; //no sirve si es pedido por un server backend
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
 
//fin

app.use('/download', cv)
module.exports = app
