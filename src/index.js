//solo npm i x usé
if (process.env.NODE_ENV==='development'){
    const path = require('path')
    require('dotenv').config();
}


var app = require('./app')
const mongoose = require('mongoose');
const port =  process.env.PORT || 3100;

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)  
            
        //'mongodb://localhost:27017/miweb',{ useNewUrlParser:true, useUnifiedTopology: true })

        // 'mongodb+srv://cntadmox:xaIG9SuECizZbbUQ@cluster0.qvnkqen.mongodb.net/?retryWrites=true&w=majority')   
         
        app.listen(port, () => console.log("Puerto==> ",port));
    } catch (error) {
        console.log(error);
    }

}

connectDB()

 