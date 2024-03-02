const jwt = require('jsonwebtoken');
const { ExistingAdmin } = require('./existinguser.middleware');

const AuthenticateToken = (req, res, next) =>{
    // Extract the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const secretKey = process.env.ACCESS_TOKEN_KEY;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // Verify and decode the token
    console.log(secretKey)
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        // Add the decoded user information to the request object
        req.user = decoded;
        next();
    });
}

// const verifyAdminTokenAuthorization = async(req,res,next) => {
//     const existing_admin_user = await ExistingAdmin(req?.sub);
//     AuthenticateToken(req,res,()=>{
//         if (req.sub === existing_admin_user?.client_ref?._id){
//             next();
//         }else{
//             res.status(403).json("You are not allowed to do that!")
//         }
//     })
// }

module.exports = {
    AuthenticateToken,
    //verifyAdminTokenAuthorization
};