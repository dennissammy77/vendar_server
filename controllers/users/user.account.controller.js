const logger = require("../../lib/logger.lib");
const { ExistingUser } = require("../../middlewares/existinguser.middleware");
const Hash_Str = require("../../middlewares/hashstr.middleware");
const { Client, AccountStatus, SuperAdmin, ShopAdmin, Vendor } = require("../../models/ClientSchema");
const { created_account_by_admin } = require("../email.controller");

const create_super_admin_account=(async(req,res)=>{
    let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0];
    const payload = req.body;
    if(!payload){
        return res.status(403).send({error:true,message:'Missing details'});
    }
	const result = await ExistingUser(payload.email);
    if (result){
		return res.status(200).send({error:true,message:'This Email already has an existing account, send them their sign in credentials.'});
	}
	const Hashed_Password = Hash_Str(payload?.password);
	if (payload?.account_type === '' || payload?.role === ''){
		return res.status(200).send({error:true,message:'account required details: undefined'});
	}
    try{
		const NewClient = await Client.create({
				name:					payload?.name,
				username:				payload?.username,
				email:					payload?.email,
				mobile:					payload?.mobile,
				password:				Hashed_Password,
				account_type:			payload?.account_type,
		});
		const user_payload = {
			_id: NewClient?._id,
			role: payload?.role
		}
		await Create_AccountStatus_Schema(user_payload);
		await Create_Super_Admin_Schema(user_payload);
		logger.log('info',`${ip} - ${payload?.name} account created`);
		const email_payload = {
			name: payload?.name,
			email: payload?.email,
			company: payload?.company,
			password:	payload?.password,
		}
        created_account_by_admin(email_payload)
		return res.status(200).json({error:null,message:'account created successfully'});
	}catch(err){
        logger.log('error',`${ip} - System Error-[creating a super admin acc]`)
        return res.sendStatus(500);
	}
});
const create_shop_admin_account=(async(req,res)=>{
    let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0];
    const payload = req.body;
    if(!payload){
        return res.status(403).send({error:true,message:'Missing details'});
    }
	const result = await ExistingUser(payload.email);
    if (result){
		return res.status(200).send({error:true,message:'This Email already has an existing account, send them their sign in credentials.'});
	}
	const Hashed_Password = Hash_Str(payload?.password);
	if (payload?.account_type === '' || payload?.role === '' || payload?.shop_ref === ''){
		return res.status(200).send({error:true,message:'account required details: undefined'});
	}
    try{
		const NewClient = await Client.create({
				name:					payload?.name,
				username:				payload?.username,
				email:					payload?.email,
				mobile:					payload?.mobile,
				password:				Hashed_Password,
				account_type:			payload?.account_type,
				shop_ref:				payload?.shop_ref
		});
		const user_payload = {
			_id: NewClient?._id,
			role: payload?.role
		}
		await Create_AccountStatus_Schema(user_payload);
		await Create_Shop_Admin_Schema(user_payload);
		logger.log('info',`${ip} - ${payload?.name} account created`);
		const email_payload = {
			name: payload?.name,
			email: payload?.email,
			company: payload?.company,
			password:	payload?.password,
		}
        created_account_by_admin(email_payload)
		return res.status(200).json({error:null,message:'account created successfully'});
	}catch(err){
        logger.log('error',`${ip} - System Error-[creating a shop admin account]`)
        return res.sendStatus(500);
	}
});
const create_vendor_account=(async(req,res)=>{
    let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0];
    const payload = req.body;
    if(!payload){
        return res.status(403).send({error:true,message:'Missing details'});
    }
	const result = await ExistingUser(payload.email);
    if (result){
		return res.status(200).send({error:true,message:'This Email already has an existing account, send them their sign in credentials.'});
	}
	const Hashed_Password = Hash_Str(payload?.password);
	if (payload?.account_type === '' || payload?.shop_ref === ''){
		return res.status(200).send({error:true,message:'account required details: undefined'});
	}
    try{
		const NewClient = await Client.create({
				name:					payload?.name,
				username:				payload?.username,
				email:					payload?.email,
				mobile:					payload?.mobile,
				password:				Hashed_Password,
				account_type:			payload?.account_type,
				shop_ref:				payload?.shop_ref
		});
		const user_payload = {
			_id: NewClient?._id,
		}
		await Create_AccountStatus_Schema(user_payload);
		await Create_Vendor_Schema(user_payload);
		logger.log('info',`${ip} - ${payload?.name} account - (vendor) created`);
		const email_payload = {
			name: payload?.name,
			email: payload?.email,
			company: payload?.company,
			password:	payload?.password,
		}
        created_account_by_admin(email_payload)
		return res.status(200).json({error:null,message:'account created successfully'});
	}catch(err){
        logger.log('error',`${ip} - System Error [Creating Vendor account]`)
        return res.sendStatus(500);
	}
});
const email_test=(async(req,res)=>{
    const payload = req.body;
	const email_payload = {
		name: payload?.name,
		email: payload?.email,
		company: payload?.company,
		password:	payload?.password,
	}
	created_account_by_admin(email_payload)
})
//schemas
const Create_AccountStatus_Schema=async(User)=>{
	try{
		const NewStatus = await AccountStatus.create({
			client_ref:	User?._id,
			suspension_status:	false,
			suspension_reason:	'',
			approval_status:	true,
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
        logger.log('error',`${ip} - System Error [Creating account status account]`);
		//throw new Error('error')
	}
}
const Create_Super_Admin_Schema=async(User)=>{
	try{
		const NewSuperAdmin = await SuperAdmin.create({
			client_ref:	User?._id,
			role: User?.role,
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
			role: User?.role,
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
const Create_Vendor_Schema=async(User)=>{
	try{
		const NewVendor = await Vendor.create({
			client_ref:	User?._id,
		})
		const id = User?._id;
		const query = {_id:id};
		const updateClient = {
			vendor_account_ref: NewVendor?._id
		}
		await Client.updateOne(query,updateClient)
	}catch(err){
		logger.log('error',`Failed to create super admin schema and update user details`)
		return err
	}
}

module.exports = {
    create_super_admin_account,
	create_shop_admin_account,
	create_vendor_account,
	email_test
}