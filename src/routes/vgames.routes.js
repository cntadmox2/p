const {Router}=require('express');
const vgamesRouter = Router();

const vgamesControll= require('../controllers/vgames')
const authMiddleware = require('../middleware/session')
const authEmail = require('../middleware/verify')
//USERS

vgamesRouter.post('/verify-user', vgamesControll.verifyUser);

vgamesRouter.post('/exist-email', vgamesControll.existEmail);

vgamesRouter.get('/get/:id', vgamesControll.getUser);
//REGISTER
vgamesRouter.post('/verify-email/:verification', authEmail, vgamesControll.verifyEmail);

vgamesRouter.post('/post', vgamesControll.postUser)

vgamesRouter.patch('/update/:id', vgamesControll.putUser);//patch modificaciones parciales

vgamesRouter.delete('/delete/:id', vgamesControll.deleteUser);

//GAMES
vgamesRouter.get('/getgame/:id', vgamesControll.getGame);

vgamesRouter.get('/getgames', vgamesControll.getGames);

vgamesRouter.get('/mygames', authMiddleware, vgamesControll.myGames);    //midleware que permite o no pasar según token

vgamesRouter.post('/postgames', authMiddleware, vgamesControll.postGames)

vgamesRouter.patch('/updategame',  authMiddleware, vgamesControll.updategame);//patch modificaciones parciales
//uso post porque angular no puede enviar body por delete o aún no sé como
vgamesRouter.post('/deletegame', authMiddleware, vgamesControll.deleteGame);


//login
vgamesRouter.post('/login', vgamesControll.loginUser);

vgamesRouter.post('/verify-token', vgamesControll.verifyToken);


 

 

//exporto
module.exports = vgamesRouter;