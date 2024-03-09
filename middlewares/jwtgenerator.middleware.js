const jwt = require('jsonwebtoken');
require('dotenv').config();

const AuthTokenGenerator = (user)=>{
    const uid = user?._id.toHexString();
    const account_type = user?.account_type;
    const name = user?.name;

    const jwtOptions = {
        expiresIn: 2000,
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
        logger.log('error',`System Error[on creating authentication token]`);
    }

}
const CodeTokenGenerator = (otpcode)=>{

    const jwtOptions = {
        expiresIn: 90,
        header: { 
            "alg": "HS256",
            "typ": "JWT"
        }
    };

    const jwtPayload = {
        code:otpcode
    }

    try{
        const token = jwt.sign(
            jwtPayload,
            process.env.CODE_TOKEN_KEY,
            jwtOptions
        );
        return token;
    }catch(err){
        logger.log('error',`System Error[on creating verification token]`);
    }

}

module.exports = {
    AuthTokenGenerator,
    CodeTokenGenerator
};