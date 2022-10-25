//solo npm i x usé
var app = require('./app')
const mongoose = require('mongoose');
const port =  process.env.PORT || 3100;

const connectDB = async()=>{
    try {
        await mongoose.connect('mongodb+srv://cntadmox:xaIG9SuECizZbbUQ@cluster0.qvnkqen.mongodb.net/?retryWrites=true&w=majority');

        // await mongoose.connect('mongodb+srv://cntadmox:xaIG9SuECizZbbUQ@cluster0.qvnkqen.mongodb.net/?retryWrites=true&w=majority')   
         
        app.listen(port, () => console.log("==============="));
    } catch (error) {
        console.log(error);
    }

}

connectDB()

