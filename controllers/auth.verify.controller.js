const {ExistingUser} = require('../middlewares/existinguser.middleware.js');
const logger = require('../lib/logger.lib.js');
const { AccountStatus } = require('../models/ClientSchema.js');
const { verify_user } = require('./email.controller.js');

const Verify_User=(async(req,res)=>{
    const email = req.params.email;
    let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0];
    try{
        if (!email){
            return res.status(403).send({error:true,message:'Missing details'});
        }
        const result = await ExistingUser(email);
        verify_user(result)
        if (!result){
            return res.status(200).send({error:true,message:'This Email does not have an existing account, try signing up'});
        }
        if (result?.account_status_ref?.email_status){
            return res.status(200).send({error:true,message:'This email has already been verified. thank you for trying.'});
        }

        const updateAccountStatus = {
            email_status:   true
        }
        const uid = result?._id;
        await AccountStatus.updateOne({client_ref: uid},updateAccountStatus).then(()=>{
            logger.log('info',`${ip} - ${result?.name} signed in`);
            return res.status(200).json({error:null,message:'Account verified successfully'});
        });
    }catch(err){
        logger.log('error',`${ip} - System Error`)
        return res.sendStatus(500);
    }
});

module.exports = Verify_User;