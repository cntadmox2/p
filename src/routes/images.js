const {Router} = require('express');
const router=Router()
var imageController = require('../controllers/image')


router.post('/upload',   (req, res)=>{
  imageController.saveImage()(req, res, function (err) {
    if(err){
      let message = '';
      console.log("sfsdsdf",err);
         if (err.code === 'LIMIT_FILE_SIZE'){
          message='Archivo excede el tamaño permitido'}
          else{ message='Tipo de archivo no permitido' };//sin .code es un error personalizado pero no sé como extraerlo
          return res.status(400).send({  message  })
 
    }

    // Everything went fine.
    const file = req.file;
    res.status(200).send( {
        
      Iname:file.filename  //si no se puede solo
        // fieldname: file.fieldname,
        // mimetype: file.mimetype,
        // originalname: file.originalname,
        // size: file.size
        
    })
  //res.send({  nameI:req.file.filename})
}) 
}) 

router.post('/saveinfo', imageController.saveInfo) 

router.get('/getinfo/:id', imageController.getInfo)

router.get('/getInfs', imageController.getInfs)

router.get('/getimage/:image', imageController.getImage)

router.put('/update/:id', imageController.updateInfo)

router.delete('/delete/:id', imageController.deleteImage)

router.post('/deleteImgupdated', imageController.deleteImgupdated)//puse post para no pasar por param en url /param sino en body junto con los headers en angular

module.exports = router