const logger = require("../../lib/logger.lib");
const { ExistingUser } = require("../../middlewares/existinguser.middleware");
const { Client } = require("../../models/ClientSchema");

const updateUserDetails = (async(req,res)=>{
    const payload = req.body;
    let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0];
    try{
        if (!payload){
            return res.status(403).send({error:true,message:'Missing details'});
        };
        const result = await ExistingUser(payload?.email);
        if (!result){
            return res.status(200).send({error:true,message:'This Email does not have an existing account, try signing up'});
        };
        if (result?.account_status_ref?.suspension_status){
            return res.status(200).send({error:true,message:'Your account has been suspended! You did not follow our company guidelines.'});
        }
        if (result?.account_status_ref?.deletion_status){
            return res.status(200).send({error:true,message:'Your account has been flagged for deletion!'});
        }
		const query = {email:email};
        const updateClient = {
            name:					payload?.name,
            username:				payload?.username,
            mobile:					payload?.mobile,
            account_type:			payload?.account_type,
            shop_ref:	            payload?.shop_id,
		}
		await Client.updateOne(query,updateClient);
        //password_reset_confirmation(email_payload)
        return res.status(200).send({error:null,message:'Account updated successfully updated'});
    }catch(err){
        logger.log('error',`${ip} - System Error[on updating user details]`)
        return res.sendStatus(500);
    }
});

module.exports = updateUserDetails;