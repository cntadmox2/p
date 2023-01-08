//helpers

const jsonwebtoken = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const tokenSign = async (user)=>{ //pasar objeto user
    return   jsonwebtoken.sign(
       {
        id: user.id,
        email: user.email
    },
    JWT_SECRET,
    {expiresIn:"4h"}
    )
};

const verifyToken = async (tokenJwt)=>{
    try {
        return jsonwebtoken.verify(tokenJwt, JWT_SECRET) //TokenExpiredError o {email: '', iat: , exp:} si vigente
    } catch (error) {
        return error
    }
}

module.exports = {tokenSign, verifyToken}


 
// user={
// "id":32432,
// "username":"xxxxx"

// }
// tokenSign(user)
