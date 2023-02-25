const download = require('download');
const { model } = require('mongoose');
const path = require('path')
 const transport = nodemailer.createTransport({
        name: process.env.USER_C,
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
        
        // host: process.env.HOST_G,
        // port: process.env.PORT_G,
        // secure: true,
        // auth: {
        //     user: process.env.USER_G,
        //     pass: process.env.PASS_G
        // } 
    });
var fs = require('fs');
const multer = require('multer');

var descargar ={
  dcv:function (req, res) { //cv descarga
    console.log("descargad");
    res.status(200).sendFile(path.join(__dirname, '../cv.pdf'));
  },


  sendEmail: async (req, res) => {//creo quesolo se puede enviar a sí mismo
  console.log(req.body.email,req.body.name,req.body.message, req.body.image, req.body.file)
  let options={
    from: process.env.USER_C, // sender address
    to: process.env.USER_C,// destino a si mismo "mail1", "mail2"
    subject: req.body.email , // Subject line
    text: "", // plain text body
    html: `<b>${req.body.name} ${req.body.namereq.body.message}</b>` 
    }
    if (req.body.image != "" && req.body.file != "") {
      options.attachments = [{ // utf-8 string as an attachment
          filename: req.body.image.slice(14), //enviar como nombre original
          path: 'src/uploads/email/' + req.body.image
        },
        {
          filename: req.body.file.slice(14), //enviar como nombre original
          path: 'src/uploads/email/' + req.body.file
        }
      ]
    }else{
      if (req.body.image != "") {
        options.attachments = [{ // utf-8 string as an attachment
          filename: req.body.image.slice(14), //enviar como nombre original
          path: 'src/uploads/email/' + req.body.image
        }]
      }else{
         if(req.body.file != ""){
        options.attachments = [{ // utf-8 string as an attachment
          filename: req.body.file.slice(14), //enviar como nombre original
          path: 'src/uploads/email/' + req.body.file
        }]
      }
      }
    }
 
    
    //fs.readFileSync('src/templates/email.html', 'utf-8')+
    await transport.sendMail(options, (error, info) => {
      if (error) {
        console.log(error.message);
        res.status(500) 
      } else {
        console.log("hecho");
        res.status(200).send({info})
      }
    });
  },

  saveElement:function(req,res){
        
    const storage = multer.diskStorage({     //configuración de ubicación y nombre
        destination: (req, file, cb) => {
            cb(null, 'src/uploads/email')
        },
        filename: (req, file, cb) => {   //file.fieldname :'namefileform', .encoding : '7bit', .mimetype : 'image/png', .originalname
            const ext = file.originalname.split('.').pop() //obtengo extensión
            cb(null, `${Date.now()}-${file.originalname}`)    //cambio nombre
        }
    })

    return (multer({
        storage,    //dest: path
        fileFilter: function (req, file, callback) {//path.join, .dirname, parse ....
            var ext = path.extname(file.originalname);//ext obtenida (con . incluido)
            if(ext !== '.png' && ext !== '.PNG' && ext !== '.jpg' && ext !== '.JPG' && ext !== '.gif' && ext !== '.GIF' && ext !== '.jpeg' && ext !== '.JPEG' && ext !== '.xlsx' && ext !== '.xls' && ext !== '.doc' && ext !== '.docx' && ext !== '.ppt' && ext !== '.pptx' && ext !== '.txt' && ext !== '.pdf' && ext !== '.zip' && ext !== '.rar') {
            //return res.status(500).send({message:'Solo imágen permitida'});
            return callback(new Error('Solo imagen'))
            }
            callback(null, true)
        }
         ,limits: { fileSize: 2000000}
    
    })).single('file')
     
},

} 

module.exports = descargar;
