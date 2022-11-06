const {Router} = require('express');
const cv=Router()

const descargar = require('../controllers/cv');

cv.get('/cv', descargar)

module.exports = cv