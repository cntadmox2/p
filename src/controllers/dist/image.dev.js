"use strict";

var Image = require('../models/image');

var fs = require('fs');

var path = require('path');

var multer = require('multer');

var ftp = require('ftp');

var mime = require('mime-types');

var config = {
  host: process.env.HOST_FTP,
  // Aquí va el host del servidor FTP
  user: process.env.USER_FTP,
  // Aquí va el usuario FTP
  password: process.env.PASS_FTP,
  // Aquí va la contraseña FTP
  connTimeout: 10000
};
var controller = {
  cargBacknd: function cargBacknd(req, res) {
    //  galeria/load
    res.status(200).send({
      "ok": "cargado"
    });
  },
  saveInfo: function saveInfo(req, res) {
    Image.create({
      name: req.body.name,
      description: req.body.description,
      image: req.body.image
    }, function (err, imag) {
      if (err) {
        console.log("Error al guardar info", err);
        return res.status(500).send({
          message: 'Error al guardar',
          kk: err
        });
      }

      if (!imag) {
        return res.status(404).send({
          message: 'No se encuentra'
        });
      }

      return res.status(201).send({
        imag: imag
      });
    });
  },
  saveImage: function saveImage() {
    var storage = multer.memoryStorage();
    var upload = multer({
      storage: storage,
      fileFilter: function fileFilter(req, file, callback) {
        var ext = path.extname(file.originalname);

        if (ext !== '.png' && ext !== '.PNG' && ext !== '.jpg' && ext !== '.JPG' && ext !== '.gif' && ext !== '.GIF' && ext !== '.jpeg' && ext !== '.JPEG') {
          callback(new Error('Solo imagen'));
        }

        callback(null, true);
      },
      limits: {
        fileSize: 2000000
      }
    });
    return upload.single('file');
  },
  getImage: function getImage(req, res) {
    var client = new ftp();
    var file = req.params.image;
    var path_file = "/public_html/assets/uploads/".concat(file);
    client.on('ready', function () {
      client.get(path_file, function (err, stream) {
        if (err) {
          console.error(err);
          client.end();
          return res.status(404).send({
            message: 'No existe la imagen'
          });
        }

        res.set('Content-Type', 'image/jpeg');
        stream.pipe(res);
        console.log("getImage");
        stream.once('close', function () {
          client.destroy(); // <-- cerrar el cliente FTP
        });
      });
    });
    client.connect(config);
  } //después aunque...
  //   getImage: function(req, res) {
  //       const client = new ftp();
  //     const file = req.params.image;
  //     const path_file = `/public_html/uploads/${file}`;
  //     client.connect(config);
  //     client.on('ready', () => {
  //     client.get(path_file, (err, stream) => {
  //       if (err) {
  //         res.status(500).send(err.message);
  //         return;
  //       }
  //       const contentType = mime.lookup(file); // Obtener el tipo MIME adecuado
  //       res.setHeader('Content-Type', contentType);
  //       stream.pipe(res);
  //       stream.on('end', () => {
  //         client.end();
  //       });
  //     });
  //   });
  // }
  ,
  getInfo: function getInfo(req, res) {
    var imageId = req.params.id;
    Image.findById(imageId, function (err, image) {
      if (err) return res.status(500).send({
        message: 'error al devolver datos'
      }); //si no existe

      if (!image) return res.status(404).send({
        message: 'Imagen n existe'
      }); //si lo encuntra respuesta exito, envía objeto

      console.log("getInfo");
      return res.status(200).send({
        image: image
      });
    });
  },
  getInfs: function getInfs(req, res) {
    Image.find().exec(function (err, imagenes) {
      if (err) return res.status(500).send({
        message: 'Error al devolver imagenes'
      }); //si no existe

      if (!imagenes) res.status(404).send({
        message: ':getImage:no hay imágenes'
      }); //si lo encuntra respuesta exito, envía objeto

      console.log("getInfs");
      return res.status(200).send({
        imagenes: imagenes
      }); // {} no es necesario
    });
  },
  updateInfo: function updateInfo(req, res) {
    var imageId = req.params.id;
    var update = req.body;
    console.log(update.image);
    Image.findByIdAndUpdate(imageId, update, {
      "new": true
    }, function (err, imageUpdated) {
      if (err) return res.status(500).send({
        message: 'Error al actualizar',
        kk: err
      });
      if (!imageUpdated) return res.status(404).send({
        message: 'No se encuentra'
      });
      return res.status(200).send({
        'update': imageUpdated
      });
    });
  },
  //BORRAR archivo según el id
  deleteImage: function deleteImage(req, res) {
    var client = new ftp();
    var imageId = req.params.id;
    Image.findByIdAndRemove(imageId, function (err, imageRemove) {
      console.log("tratar borrar ", imageId);
      if (err) return res.status(500).send({
        message: 'Error al borrar'
      });
      if (!imageRemove) return res.status(404).send({
        message: 'Borrar:imagen no existe '
      });
      client.on('ready', function () {
        client["delete"]('/public_html/assets/uploads/' + imageRemove.image, function (err) {
          if (err) {
            console.error(err);
            client.end();
            return res.status(500).send('Error al eliminar archivo en servidor FTP');
          }

          console.log('Archivo eliminado correctamente en servidor FTP');
          client.end();
          return res.status(200).send({
            mensajitoo: 'Borrado',
            x: imageRemove
          });
        });
      });
    });
    client.connect(config);
  },
  deleteImgupdated: function deleteImgupdated(req, res) {
    //borra img al update
    var client = new ftp();
    var image = req.body.image;
    console.log("borrar ", image);
    client.on('ready', function () {
      var file = req.params.image;
      client["delete"]("/public_html/assets/uploads/" + image, function (err) {
        if (err) {
          console.error(err);
          client.end();
          return res.status(500).send('Error al eliminar archivo');
        }

        console.log('Archivo eliminado correctamente');
        client.end();
        return res.status(200).send({
          'remove': image
        });
      });
    });
    client.connect(config);
  }
};
module.exports = controller;