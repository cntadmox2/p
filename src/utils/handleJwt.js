//helpers

const jsonwebtoken = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const tokenSign = async (user)=>{ //pasar objeto user
    return   jsonwebtoken.sign(
       { 
        _id: user._id,
        username: user.username
    },
    JWT_SECRET,
    {expiresIn:"1h"}
    )
};

const verifyToken = async (tokenJwt)=>{
    try {
        return jsonwebtoken.verify(tokenJwt, JWT_SECRET)
    } catch (error) {
        
    }
}

module.exports = {tokenSign, verifyToken}

const data = {
    token: await tokenSign(),
    user:dataUser
}
 
// user={
// "id":32432,
// "username":"xxxxx"

// }
// tokenSign(user)