const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWTGenerator = (user)=>{
    const uid = user?._id.toHexString();
    const account_type = user?.account_type;
    const name = user?.name;

    const jwtOptions = {
        expiresIn: 200,      // 300 seconds
        header: { 
            "alg": "HS256",
            "typ": "JWT"
        }
    };

    const jwtPayload = {
        sub : uid,
        name: name,
        account_type : account_type,
    }

    try{
        const token = jwt.sign(
            jwtPayload,
            process.env.ACCESS_TOKEN_KEY,
            jwtOptions
        );
        return token;
    }catch(err){
        console.log(err)
    }

}

module.exports = JWTGenerator;