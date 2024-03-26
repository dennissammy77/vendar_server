const logger = require('../../lib/logger.lib.js');
const {ExistingUser} = require('../../middlewares/existinguser.middleware.js');
const Hash_Str = require('../../middlewares/hashstr.middleware.js');
const {AuthTokenGenerator} = require('../../middlewares/jwtgenerator.middleware.js');

const {
	Client,
	ShopAdmin,
	AccountStatus,
	SuperAdmin,
} = require('../../models/ClientSchema.js');
const { welcome_new_user } = require('../email.controller.js');

const create_client_account = (async(req, res)=>{
	const payload = req.body;
    let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0];
	
	if (!payload?.email){
		return res.status(403).send({error:true,message:'Missing details'});
	}
	
	const result = await ExistingUser(payload.email);
	if (result){
		return res.status(200).send({error:true,message:'This Email already has an existing account, try signing in'});
	}

	// hash password
	const Hashed_Password = Hash_Str(payload?.password);
	// access token
	if (payload?.account_type === ''){
		return res.status(200).send({error:true,message:'account type: undefined'});
	}
	try{
		const NewClient = await Client.create({
				name:					payload?.name,
				username:				payload?.username,
				email:					payload?.email,
				mobile:					payload?.mobile,
				password:				Hashed_Password,
				account_type:			payload?.account_type
		});

		const Access_Token = AuthTokenGenerator(NewClient);
		switch(payload?.account_type) {
			case 'super_admin':
				await Create_Super_Admin_Schema(NewClient);
				await Create_AccountStatus_Schema(NewClient)
				break;
			case 'shop_admin':
				await Create_Shop_Admin_Schema(NewClient);
				await Create_AccountStatus_Schema(NewClient)
				break;
			default:
				throw new Error('account type not defined')
		}
		logger.log('info',`${ip} - ${result?.name} signed up`);
		const email_payload = {
			name: payload?.name,
			email: payload?.email,
			_id: NewClient?._id
		}
        welcome_new_user(email_payload);
		return res.status(200).json({token:Access_Token,error:null,message:'sign up successful'});
	}catch(err){
        logger.log('error',`${ip} - System Error: Creating a new account for ${payload?.name}, Tel:${payload?.mobile}, Email:${payload?.email}`)
        return res.sendStatus(500);
	}
});

const Create_Super_Admin_Schema=async(User)=>{
	try{
		const NewSuperAdmin = await SuperAdmin.create({
			client_ref:	User?._id,
			role: '',
		})
		const id = User?._id;
		const query = {_id:id};
		const updateClient = {
			super_admin_account_ref: NewSuperAdmin?._id
		}
		await Client.updateOne(query,updateClient)
	}catch(err){
		logger.log('error',`Failed to create super admin schema and update user details`)
		return err
	}
}

const Create_Shop_Admin_Schema=async(User)=>{
	try{
		const NewShopAdmin = await ShopAdmin.create({
			client_ref:	User?._id,
			role: 'manager',
		})
		const id = User?._id;
		const query = {_id:id};
		const updateClient = {
			shop_admin_account_ref: NewShopAdmin?._id
		}
		await Client.updateOne(query,updateClient)
	}catch(err){
		logger.log('error',`Failed to create super admin schema and update user details`)
		return err
	}
}

const Create_AccountStatus_Schema=async(User)=>{
	try{
		const NewStatus = await AccountStatus.create({
			client_ref:	User?._id,
			suspension_status:	false,
			suspension_reason:	'',
			approval_status:	false,
			deletion_status:	false,
			email_status:		false
		})
		const id = User?._id;
		const query = {_id:id};
		const updateClient = {
			account_status_ref: NewStatus?._id
		}
		await Client.updateOne(query,updateClient)
	}catch(err){
		logger.log('error',`Failed to create user account status schema and update user details`)
	}
}

module.exports = {
	create_client_account
}