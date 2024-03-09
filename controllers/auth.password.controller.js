const logger = require("../lib/logger.lib");
const { ExistingUser } = require("../middlewares/existinguser.middleware");
const bcrypt = require('bcryptjs');
const { password_reset_otp_code, password_reset_confirmation } = require("./email.controller");
const {CodeTokenGenerator} = require("../middlewares/jwtgenerator.middleware");
const Hash_Str = require("../middlewares/hashstr.middleware");
const { Client } = require("../models/ClientSchema");

const SendOtpCode=(async(req,res)=>{
    const email = req.params.email;
    const otpcode = req.params.code;
    let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0];
    try{
        if (!email){
            return res.status(403).send({error:true,message:'Missing details'});
        }
        const result = await ExistingUser(email);
        if (!result){
            return res.status(200).send({error:true,message:'This Email does not have an existing account, try signing up'});
        }
        if (result?.account_status_ref?.deletion_status){
            return res.status(200).send({error:true,message:'This account has been flagged for deletion.'});
        }
        const email_payload={
            email,
            otpcode,
        }
        password_reset_otp_code(email_payload);
        const CODE_TOKEN = CodeTokenGenerator(otpcode);
        return res.status(200).json({token:CODE_TOKEN,error:null,message:'Email Sent successfully'});
    }catch(err){
        logger.log('error',`${ip} - System Error-[sending otp code email]`)
        return res.sendStatus(500);
    }
});
const password_reset = (async(req,res)=>{
    const {email, password} = req.body;
    let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0];
    try{
        if (!email || !password){
            return res.status(403).send({error:true,message:'Missing details'});
        };
        const result = await ExistingUser(email);
        if (!result){
            return res.status(200).send({error:true,message:'This Email does not have an existing account, try signing up'});
        };
        if (result?.account_status_ref?.suspension_status){
            return res.status(200).send({error:true,message:'Your account has been suspended! You did not follow our company guidelines.'});
        }
        if (result?.account_status_ref?.deletion_status){
            return res.status(200).send({error:true,message:'Your account has been flagged for deletion!'});
        }
        const Hashed_Password = Hash_Str(password);
		const query = {email:email};
        const updateClient = {
			password: Hashed_Password
		}
		await Client.updateOne(query,updateClient);
        const email_payload={
            email
        }
        password_reset_confirmation(email_payload)
        return res.status(200).send({error:null,message:'Password successfully updated'});
    }catch(err){
        logger.log('error',`${ip} - System Error[on resetting password]`)
        return res.sendStatus(500);
    }
});

module.exports = {SendOtpCode,password_reset};