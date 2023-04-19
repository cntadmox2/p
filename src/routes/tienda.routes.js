const {Router}=require('express');
const tiendaRouter = Router();

const tiendaControll= require('../controllers/tienda')
const authMiddleware = require('../middleware/session')
const authEmail = require('../middleware/verify')

tiendaRouter.post('/categoria', tiendaControll.postCategoria);
tiendaRouter.get('/get_categoria', tiendaControll.getCategoria);
tiendaRouter.post('/create-product', tiendaControll.createProducto);

module.exports = tiendaRouter;