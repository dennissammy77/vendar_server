const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWTGenerator = (payload)=>{
    const email = payload?.email;
    const account_type = payload?.account_type;
    const jwtOptions = {
        expiresIn: 3600,      // 300 seconds
        header: { 
            "alg": "HS256",
            "typ": "JWT"
        }
    }
    const token = jwt.sign(
        {email, account_type},
        process.env.ACCESS_TOKEN_KEY,
        jwtOptions
    )
    return token;
}
module.exports = JWTGenerator;