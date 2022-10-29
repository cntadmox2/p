const express = require('express');
const app = express();
const router = require('./routes/images'); 
const cors = require('cors');


const whiteList =['http://localhost:4200','http://192.168.0.10:4200','http://localhost','https://miwe.onrender.com','https://mkjdev.com']; //no sirve si es pedido por un server backend
app.use(cors({origin:whiteList}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const path = require('path')
app.get('/', (req, res) => {
  res.sendFile(path.resolve('src/uploads/1663563087069.jpg'))
})
app.use('/galeria', router)

// const path = require('path')
// app.use('/galeria', (req,res)=>{
//   res.sendFile(path.resolve('src/uploads/1663563087069.jpg'))
// })

module.exports = app
