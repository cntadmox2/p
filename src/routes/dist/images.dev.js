"use strict";

var _require = require('express'),
    Router = _require.Router;

var router = Router();

var imageController = require('../controllers/image');

var ftp = require('ftp');

var fs = require('fs');

var client = new ftp();
var config = {
  host: process.env.HOST_FTP,
  // Aquí va el host del servidor FTP
  user: process.env.USER_FTP,
  // Aquí va el usuario FTP
  password: process.env.PASS_FTP,
  // Aquí va la contraseña FTP
  connTimeout: 10000
}; // router.post('/upload', (req, res) => {
//   //req lo pasa al middleware
//   imageController.saveImage()(req, res, (err) => {
//     //aquí ya tiene valor req
//     if (err) {
//       console.error(err);
//         res.status(500).send({ error: 'Error al subir archivo' });
//     } else {
//       //cambiar nombre
//     client.on('ready', () => {
//       let stream = new Buffer.from(req.file.buffer);
//       // Generar un nuevo nombre de archivo único
//       const newFileName = Date.now() + '_' + req.file.originalname;
//       client.put(stream, `/public_html/uploads/${newFileName}`, (err) => {
//         if (err) {
//           console.error(err);
//             res.status(500).send({ error: 'Error al subir archivo' });
//         } else {
//           console.log(`Imagen ${newFileName} enviado a server FTP`);
//           if (!res.headersSent){
//             res.send({ Iname: newFileName });
//           }
//           stream = null;
//         }
//       });
//     });
//     client.connect(config);
//     }
//   });
// });
//MALL: client.on('read  está dentro de la función de callback
// router.post('/upload', imageController.saveImage().single('file'), (req, res) => {
//   console.log('Comenzando la carga de la imagen');
//   if (req.file) {
//                 console.log("dentro req.file");
//     client.on('ready', () => {
//       const stream = Buffer.from(req.file.buffer);
//       // Generar un nuevo nombre de archivo único
//       const newFileName = Date.now() + '_' + req.file.originalname;
//       console.log("dentro de ready");
//       client.put(stream, `/public_html/uploads/${newFileName}`, (err) => {
//         if (err) {
//           console.error(err);
//           res.status(500).send({ error: 'Error al subir archivo' });
//         } else {
//           console.log(`Imagen ${newFileName} enviado a server FTP`);
//           if (!res.headersSent){
//             res.status(200).send({ Iname: newFileName });
//             console.log('Enviada res 200');
//           }
//         }
//         client.end();
//       });
//     });
//     client.connect(config);
//   } else {
//     res.status(400).send({ error: 'No se encontró ningún archivo para subir' });
//   }
// });
//UTLIMO
// router.post('/upload', imageController.saveImage().single('file'), (req, res) => {
//   if (req.file){
//     const client = new ftp();
//     client.on('ready', () => {
//       console.log('Cliente FTP conectado');
//     });
//     client.connect(config);
//     client.on('ready', () => {
//       const stream = new Buffer.from(req.file.buffer);
//       const newFileName = Date.now() + '_' + req.file.originalname;
//       client.put(stream, `/public_html/uploads/${newFileName}`, (err) => {
//         if (err) {
//           console.error(err);
//           if (!res.headersSent){
//             res.status(500).send({ error: 'Error al subir archivo' });
//           }
//         } else {
//           console.log(`Imagen ${newFileName} enviado a server FTP`);
//           if (!res.headersSent){
//             res.send({ Iname: newFileName });
//           }
//         }
//       });
//     });
//   }else {
//     if (!res.headersSent){
//       res.status(400).send({ error: 'No se encontró ningún archivo para subir' });
//     }
//   }
// });
//BIEN FUERA DE CB

router.post('/upload', function (req, res) {
  var client = new ftp();
  client.on('ready', function () {
    console.log('Cliente FTP conectado');
  });
  imageController.saveImage()(req, res, function (err) {
    if (err) {
      console.error(err);

      if (!res.headersSent) {
        res.status(500).send({
          error: 'Error al subir archivo'
        });
      }
    } else {
      client.connect(config);
      client.on('ready', function () {
        var stream = new Buffer.from(req.file.buffer);
        var newFileName = Date.now() + '_' + req.file.originalname;
        client.put(stream, "/public_html/assets/uploads/".concat(newFileName), function (err) {
          if (err) {
            console.error(err);

            if (!res.headersSent) {
              res.status(500).send({
                error: 'Error al subir archivo'
              });
            }
          } else {
            console.log("Imagen ".concat(newFileName, " enviado a server FTP"));

            if (!res.headersSent) {
              res.send({
                Iname: newFileName
              });
            }
          }
        });
      });
    }
  });
});
router.get('/load', imageController.cargBacknd);
router.post('/saveinfo', imageController.saveInfo);
router.get('/getinfo/:id', imageController.getInfo);
router.get('/getInfs', imageController.getInfs);
router.get('/getimage/:image', imageController.getImage);
router.put('/update/:id', imageController.updateInfo);
router["delete"]('/delete/:id', imageController.deleteImage);
router.post('/deleteImgupdated', imageController.deleteImgupdated); //puse post para no pasar por param en url /param sino en body junto con los headers en angular

module.exports = router;