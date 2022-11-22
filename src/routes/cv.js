const {Router} = require('express');
const cv=Router()

const descargar = require('../controllers/cv');

cv.get('/cv', descargar.dcv)

cv.post('/sendmail', descargar.sendEmail)

cv.post('/upload',   (req, res)=>{
    descargar.saveElement()(req, res, function (err) {
    if (err) {
        let message = '';
        console.log("sfsdsdf", err);
        if (err.code === 'LIMIT_FILE_SIZE') {
            message = 'Archivo excede el tamaño permitido'
        } else {
            message = 'Tipo de archivo no permitido'
        }; //sin .code es un error personalizado pero no sé como extraerlo
        return res.status(400).send({
            message
        })

    }
    const file = req.file;
    res.status(200).send({

        Iname: file.filename
    })
     
    })
    })

module.exports = cv