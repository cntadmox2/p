const jsonwebtoken = require('jsonwebtoken');
const JWT_EMAIL = process.env.JWT_EMAIL;
const tokenEmail = async (user)=>{ //pasar objeto user
    return jsonwebtoken.sign(
       {
        email: user.email,
        username: user.username
    },
    JWT_EMAIL,
    {expiresIn:"10m"}
    )
};

const verifyTokenEmail = async (tokenJwt)=>{
    try {
        return jsonwebtoken.verify(tokenJwt, JWT_EMAIL) //TokenExpiredError o {email: '', username:''} si vigente
    } catch (error) {
        return error
    }
}

module.exports = {tokenEmail, verifyTokenEmail}