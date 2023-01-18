const {Router}=require('express');
const vgamesRouter = Router();

const vgamesControll= require('../controllers/vgames')
const autMiddleware = require('../middleware/session')
//USERS

vgamesRouter.post('/verify-user', vgamesControll.verifyUser);

vgamesRouter.post('/verify-email', vgamesControll.verifyMail);

vgamesRouter.get('/get/:id', vgamesControll.getUser);

vgamesRouter.post('/post', vgamesControll.postUser)

vgamesRouter.patch('/update/:id', vgamesControll.putUser);//patch modificaciones parciales

vgamesRouter.delete('/delete/:id', vgamesControll.deleteUser);

//GAMES
vgamesRouter.get('/getgame/:id', vgamesControll.getGame);

vgamesRouter.get('/getgames', vgamesControll.getGames);

vgamesRouter.get('/mygames', autMiddleware, vgamesControll.myGames);    //midleware que permite o no pasar según token

vgamesRouter.post('/postgames', autMiddleware, vgamesControll.postGames)

vgamesRouter.patch('/updategame',  autMiddleware, vgamesControll.updategame);//patch modificaciones parciales
//uso post porque angular no puede enviar body por delete o aún no sé como
vgamesRouter.post('/deletegame', autMiddleware, vgamesControll.deleteGame);

vgamesRouter.post('/sendemail', vgamesControll.sendEmail)

//login
vgamesRouter.post('/login', vgamesControll.loginUser);

vgamesRouter.post('/verify-token', vgamesControll.verifyToken); 
 

 

//exporto
module.exports = vgamesRouter;