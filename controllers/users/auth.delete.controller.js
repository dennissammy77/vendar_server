const logger = require('../../lib/logger.lib.js');
const { ExistingUser } = require('../../middlewares/existinguser.middleware.js');
const {
	Client,
	AccountStatus,
	SuperAdmin,
	ShopAdmin,
	Vendor,
} = require('../../models/ClientSchema.js');
const { deleted_user_account } = require('../email.controller.js');

/**
 * This controller looks forward to deleting a user account as well as all user data 
 * i.e staffs, vendors, customers, products, shop data etc;
 * 
 * on deletion the data for user will be flagged for deletion instead of being deleted first.
 * {uid} - param(user if)
 * it will be easier if I have a shop to join all the different sections
 * 
 */
const delete_account=(async(req,res)=>{
    let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0];
	const uid = req?.params?.uid;
	const email = req?.params?.email;
	const account_type = req?.params?.account_type;
	const flag = req?.params?.flag;

	if (!uid || !flag){
		return res.status(403).send({error:true,message:'Missing details'});
	}

	const result = await ExistingUser(email);
	if (!result){
		return res.status(200).send({error:true,message:'This Email does not have an existing account'});
	}
	try {
		if(flag === 'stage'){
			await flag_user(uid);
            logger.log('info',`${ip} - ${result?.name} flagged account for deletion`);
            return res.status(200).json({error:null,message:'Account Flagged for deletion'});
		};
		if(flag === 'deletion'){
			if(account_type == 'super_admin'){
				await delete_super_admin_schema(uid);
				logger.log('info',`${ip} - ${result?.name} account(super-admin) has been deleted`);
				deleted_user_account(result)
				return res.status(200).json({error:null,message:'Account deleted '});
			}
			if(account_type == 'shop_admin'){
				await delete_shop_admin_schema(uid);
				logger.log('info',`${ip} - ${result?.name} account(shop-admin) has been deleted`);
				deleted_user_account(result)
				return res.status(200).json({error:null,message:'Account deleted '});
			}
			if(account_type == 'vendor'){
				await delete_vendor_schema(uid);
				logger.log('info',`${ip} - ${result?.name} account(vendor) has been deleted`);
				deleted_user_account(result)
				return res.status(200).json({error:null,message:'Account deleted '});
			}
		}else{
			return res.status(200).json({error:true,message:`Error in ${flag} account`});
		}
	} catch (error) {
		logger.log('error',`${ip} - Error in ${flag} ${account_type} account (${uid})`);
		return res.status(200).json({error:true,message:`Error in ${flag} account`});
	}
});

const flag_user=async(uid)=>{
	const query = {client_ref:uid};
	const updateClient = {
		deletion_status: true
	}
	try{
		await AccountStatus.updateOne(query,updateClient);
	}catch(err){
		throw new Error('Error while flagging acount for deletion')
	}
}

const delete_super_admin_schema=async(uid)=>{
	try{
		await AccountStatus.deleteOne({client_ref:uid});
		await SuperAdmin.deleteOne({client_ref:uid});
		await Client.deleteOne({_id:uid});
	}catch(err){
		throw new Error('Flag: undefined')
	}
};
const delete_shop_admin_schema=async(uid)=>{
	try{
		await AccountStatus.deleteOne({client_ref:uid});
		await ShopAdmin.deleteOne({client_ref:uid});
		await Client.deleteOne({_id:uid});
	}catch(err){
		throw new Error('Flag: undefined')
	}
};
const delete_vendor_schema=async(uid)=>{
	try{
		await AccountStatus.deleteOne({client_ref:uid});
		await Vendor.deleteOne({client_ref:uid});
		await Client.deleteOne({_id:uid});
	}catch(err){
		throw new Error('Flag: undefined')
	}
};

module.exports = delete_account