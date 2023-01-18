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
        

        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.MONGODB_URI)
            
        //    'mongodb://localhost:27017/miweb',{ useNewUrlParser:true, useUnifiedTopology: true })
        //    process.env.MONGODB_URI
         
        app.listen(port, () => console.log("Puerto==> ",port));
    } catch (error) {
        console.log(error);
    }

}

"file:///C:/Users/NkSh/.vscode/extensions/webrender.synthwave-x-fluoromachine-0.0.12/synthwave-x-fluoromachine.css",
"file:///C:/Users/NkSh/.vscode/extensions/thecodemonkey.synthwave-x-fluoromachine-epic-animations-1.4.13/synthwave-x-fluoromachine.css",
"file:///C:/Users/NkSh/.vscode/extensions/thecodemonkey.synthwave-x-fluoromachine-epic-animations-1.4.13/epic-80s-transitions.css"

connectDB()

 