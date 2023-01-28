const { verifyToken } = require('../utils/handleJwt')
const pool =require('../config/db');
const autMiddleware = async (req, res, next)=>{
    try {
        if(!req.headers.authorization){
            res.status(401).send("NEED_SESSION")
            return
        }

        const token = req.headers.authorization.split(' ').pop();//'Bearer','tokenzxy' y escojo el token con pop
        const dataToken = await verifyToken(token);

        if(!dataToken.id){//si no hay id porque no es correcto el token
             res.status(401).send("necesitas id")
             return
        }

        req.userIdToken = dataToken.id
        

        next()
        
    } catch (error) {
        res.status(400).send({"Error":"NO_SESSION"})
    }
}

module.exports = autMiddleware