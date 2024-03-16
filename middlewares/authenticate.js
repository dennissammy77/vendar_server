const jwt = require('jsonwebtoken');
const token_error = require('../lib/token_error/token_error');


const AuthenticateToken = (req, res, next) =>{
    // Extract the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const secretKey = process.env.ACCESS_TOKEN_KEY;

    if (!token) {
        return res.status(401).send(token_error);
    }

    // Verify and decode the token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).send(token_error);
        }

        // Add the decoded user information to the request object
        req.user = decoded;
        next();
    });
}

const VerifyToken = (req, res, next) =>{
    // Extract the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const secretKey = process.env.CODE_TOKEN_KEY;

    if (!token) {
        //return res.status(401).json({ message: 'No token provided' });
        return res.status(403).send(token_error);
    }

    // Verify and decode the token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            //return res.status(403).json({ message: 'Invalid token' });
            return res.status(403).send(token_error);
        }
        // Add the decoded user information to the request object
        req.user = decoded;
        next();
    });
}

module.exports = {
    AuthenticateToken,
    VerifyToken
};