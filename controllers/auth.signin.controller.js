const {ExistingUser} = require('../middlewares/existinguser.middleware.js');
const bcrypt = require('bcryptjs');
const JWTGenerator = require('../middlewares/jwtgenerator.middleware.js');
const logger = require('../lib/logger.lib.js');

const sign_in_user=(async(req,res)=>{
    const {email, password} = req.body;
    let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0];
    try{
        if (!email || !password){
            return res.status(403).send({error:true,message:'Missing details'});
        }
        const result = await ExistingUser(email);
        if (!result){
            return res.status(200).send({error:true,message:'This Email does not have an existing account, try signing up'});
        }
        
        if(bcrypt.compareSync(password, result?.password)){
            // Check if user's account has been suspended or deleted
            const Access_Token = JWTGenerator(result);
            if (result?.account_status_ref?.suspension_status){
                return res.status(200).send({error:true,message:'Your account has been suspended! You did not follow our company guidelines.'});
            }
            if (result?.account_status_ref?.deletion_status){
                return res.status(200).send({error:true,message:'Your account has been flagged for deletion!'});
            }
            logger.log('info',`${ip} - ${result?.name} signed in`);
            return res.status(200).json({token:Access_Token,error:null,message:'sign in successful'});
        }
        return res.status(200).send({error:true,message:'Invalid credentials'});
    }catch(err){
        logger.log('error',`${ip} - System Error`)
        return res.sendStatus(500);
    }
});

module.exports = sign_in_user;