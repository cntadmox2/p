var Image= require('../models/image');
var fs=require('fs');
var path = require('path');
const multer = require('multer');


var controller={
    saveInfo:function (req,res) {
       var image = new Image()
       image.name = req.body.name
       image.description = req.body.description
       image.image = req.body.image
       

       image.save((err, imag)=>{
        if(err) return res.status(500).send({message:'Error al guardar',kk:err});

        if(!imag) return res.status(404).send({message:'No se encuentra'});

        return res.status(200).send({imag});
       })
    },
 

    saveImage:function(req,res){
        
        const storage = multer.diskStorage({     //configuración de ubicación y nombre
            destination: (req, file, cb) => {
                cb(null, 'src/uploads')
            },
            filename: (req, file, cb) => {   //file.fieldname :'namefileform', .encoding : '7bit', .mimetype : 'image/png', .originalname
                const ext = file.originalname.split('.').pop() //obtengo extensión
                cb(null, `${Date.now()}.${ext}`)    //cambio nombre
            }
        })

        return (multer({
            storage,    //dest: path
            fileFilter: function (req, file, callback) {//path.join, .dirname, parse ....
                var ext = path.extname(file.originalname);//ext obtenida (con . incluido)
                if(ext !== '.png' && ext !== '.PNG' && ext !== '.jpg' && ext !== '.JPG' && ext !== '.gif' && ext !== '.GIF' && ext !== '.jpeg' && ext !== '.JPEG') {
                //return res.status(500).send({message:'Solo imágen permitida'});
                return callback(new Error('Solo imagen'))
                }
                callback(null, true)
            }
             ,limits: { fileSize: 2000000}
        
        })).single('file')
         
    },

    getImage:function(req, res){//.image es el nombre.jpg
        var file=req.params.image;
        var path_file = './src/uploads/'+file;
        //console.log("pide imagen file",path_file);
        fs.access(path_file, fs.constants.F_OK, (inexiste)=>{
            if(!inexiste) return res.status(200).sendFile(path.resolve(path_file));
          
            return res.status(404).send({
              message: 'No  existe imagen'
            })
        });
      },
      getInfo:function(req, res){
        var imageId = req.params.id;
        
        Image.findById(imageId, (err, image)=>{
 
            if(err) return res.status(500).send({message:'error al devolver datos'});
            //si no existe
            if(!image) return res.status(404).send({message:'Imagen n existe'});
            //si lo encuntra respuesta exito, envía objeto
            return res.status(200).send({ image });
        });
    },

    getInfs:function (req,res) {
        Image.find( ).exec((err, imagenes)=>{
            if(err) return res.status(500).send({message:'Error al devolver imagenes'});
            //si no existe
            if(!imagenes) res.status(404).send({message:':getImage:no hay imágenes'});
            //si lo encuntra respuesta exito, envía objeto
            return res.status(200).send({ imagenes });// {} no es necesario
        });
    },

    updateInfo:function (req,res) {
        const imageId = req.params.id
        
        var update=req.body; 
        console.log(update.image);
        Image.findByIdAndUpdate(   imageId,   update, {new:true}, (err, imageUpdated)=>{
            if(err) return res.status(500).send({message:'Error al actualizar',kk:err});

            if(!imageUpdated) return res.status(404).send({message:'No se encuentra'});

            return res.status(200).send({'update':imageUpdated});

        })
    },

    deleteImage:function (req,res) {
        const imageId = req.params.id
        Image.findByIdAndRemove (imageId,(err,imageRemove)=>{
            if(err) return res.status(500).send({message:'Error al borrar'});
            
            if(!imageRemove) return res.status(404).send({message:'Borrar:imagen no existe '})
                                
            fs.unlink("src/uploads/"+imageRemove.image, (err)=>{
                return res.status(200).send({mensajitoo:'Borrado',x:imageRemove})
            });
        });
    },

    deleteImgupdated:function (req,res) {//borra img al update
        var image=req.body.image; 
            console.log("borrar ",image);
            fs.unlink("src/uploads/"+image, (err)=>{
                return res.status(200).send({'remove':image});
            });

    }



}

module.exports=controller;