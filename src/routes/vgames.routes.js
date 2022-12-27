const {Router}=require('express');
const vgamesRouter = Router();

const vgamesControll= require('../controllers/vgames')
//USERS
vgamesRouter.get('/get/:id', vgamesControll.getUser);

vgamesRouter.post('/post', vgamesControll.postUser)

vgamesRouter.patch('/update/:id', vgamesControll.putUser);//patch modificaciones parciales

vgamesRouter.delete('/delete/:id', vgamesControll.deleteUser);

//GAMES
vgamesRouter.get('/getgame/:id', vgamesControll.getGame);

vgamesRouter.get('/getgames', vgamesControll.getGames);

vgamesRouter.post('/postgame', vgamesControll.postGame)

vgamesRouter.patch('/updategame/:id', vgamesControll.putGame);//patch modificaciones parciales

vgamesRouter.delete('/deletegame/:id', vgamesControll.deleteGame);

//login
vgamesRouter.post('/login', vgamesControll.loginUser);


//exporto
module.exports = vgamesRouter;