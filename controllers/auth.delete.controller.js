const Logger = require('../lib/logger.lib.js');
const {
	Client,
	Admin,
	Staff,
	Vendor,
	Customer,
	AccountStatus
} = require('../models/ClientSchema.js');

/**
 * This controller looks forward to deleting a user account as well as all user data 
 * i.e staffs, vendors, customers, products, shop data etc;
 * 
 * on deletion the data for user will be flagged for deletion instead of being deleted first.
 * {uid} - param(user if)
 * it will be easier if I have a shop to join all the different sections
 * 
 */
const delete_client_account=(async(req,res)=>{
    let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0];
	const uid = req?.param?.uid;
	const flag = req?.param?.flag;
	if (!uid || !flag){
		return res.status(403).send({error:true,message:'Missing details'});
	}

	const result = await ExistingUser(payload.email);
	if (result){
		return res.status(200).send({error:true,message:'This Email already has an existing account, try signing in'});
	}

	switch(flag){
		case 'stage':
			// change account status for all users
			await flag_user(uid);
			break;
		default:
			throw new Error('Flag: undefined')
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
		throw new Error('Flag: undefined')
	}
}

const delete_user=async(uid)=>{
	const query = {client_ref:uid};
	try{
		await AccountStatus.deleteOne(query);
	}catch(err){
		throw new Error('Flag: undefined')
	}
}

//const 

// const delete_client_account=(async(req, res)=>{
// 	const client_id = req.query.id;
// 	const deletion_flag = req.query.flag;
	
// 	if(!id){
// 		return res.sendStatus(400);
// 	}
// 	// check for deltion flag
// 	if (!deletion_flag){
// 		return res.sendStatus(400);
// 	}
// 	// check for existing user
// 	const query = {_id:client_id};
// 	const result = await Client.findById(query);

// 	if(!result){
// 		return res.status(400).send('This account does not exist');
// 	};

// 	// Flag for deletion
// 	if (deletion_flag === 'hold'){
// 		const result = await Flag_Account_Deletion(client_id);
// 		if (result === 'OK'){
// 			return res.sendStatus(200);
// 		}
// 		return res.sendStatus(400);
// 	}else if(deletion_flag === 'delete'){
		
// 	}
// });

// const Flag_Account_Deletion=async(client_id)=>{
// 	const query = {client_ref: client_id};
// 	const updateUser = {
// 		deletion_status:	true,
// 	};
// 	try{
// 		await AccountStatus.updateOne(query,updateUser).then((response)=>{
// 			return 'OK'
// 		})
// 	}catch(err){
// 		Logger({level:'error',message:err});
// 		//return res.status(400).send('Error while flagging account for deletion')
// 		return null;
// 	}
// }

// const delete_account=async(result)=>{
// 	if (result?.account_type === 'admin'){
// 		await delete_admin_schema(result);
// 		await delete_account_status(result);
// 	}
// }

// const delete_admin_schema=async({id})=>{
// 	const query = {client_ref: id};
// 	try {
// 		await Admin.findByIdAndDelete(query)
// 	} catch (error) {
// 		Logger({level:'error',message:err});
// 	}
// 	return ;
// }


module.exports = delete_client_account