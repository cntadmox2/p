'use strict'                         //cargar librería mongoose para hace consultas
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ProjectSchema= Schema({
    name: String,
    description: String,
    image:String
});



module.exports = mongoose.model( 'Image', ProjectSchema);
                                //solo minúsculas y una s al final y ya