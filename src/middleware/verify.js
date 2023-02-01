const {  verifyTokenEmail} = require('../utils/handleJwtVerify')
const pool =require('../config/db');
const authEmail = async (req, res, next)=>{
    try {
        if(!req.headers.authorization){
            console.log("EED_SESSION-different-browse");
            res.status(401).send("NEED_SESSION-different-browser")
            return
        }

        const token = req.headers.authorization.split(' ').pop();//'Bearer','tokenzxy' y escojo el token con pop
        const dataToken = await verifyTokenEmail(token);
console.log("es",dataToken);
        if(!dataToken.email){//si no hay id porque no es correcto el token
             res.status(401).send("Token expirado o inválido")
             return
        }

        req.userEmailToken = dataToken.email
        req.userName = dataToken.username

        next()
        
    } catch (error) {
        res.status(400).send({"Error":"NO_SESSION"})
    }
}

module.exports = authEmail