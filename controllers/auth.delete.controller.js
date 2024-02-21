const Logger = require('../lib/logger.lib.js');
const {
	Client,
	Admin,
	Staff,
	Vendor,
	Customer,
	AccountStatus
} = require('../models/ClientSchema.js');

const delete_client_account=(async(req, res)=>{
	const client_id = req.query.id;
	const deletion_flag = req.query.flag;
	
	if(!id){
		return res.sendStatus(400);
	}
	// check for deltion flag
	if (!deletion_flag){
		return res.sendStatus(400);
	}
	// check for existing user
	const query = {_id:client_id};
	const result = await Client.findById(query);

	if(!result){
		return res.status(400).send('This account does not exist');
	};

	// Flag for deletion
	if (deletion_flag === 'hold'){
		const result = await Flag_Account_Deletion(client_id);
		if (result === 'OK'){
			return res.sendStatus(200);
		}
		return res.sendStatus(400);
	}else if(deletion_flag === 'delete'){
		
	}
});

const Flag_Account_Deletion=async(client_id)=>{
	const query = {client_ref: client_id};
	const updateUser = {
		deletion_status:	true,
	};
	try{
		await AccountStatus.updateOne(query,updateUser).then((response)=>{
			return 'OK'
		})
	}catch(err){
		Logger({level:'error',message:err});
		//return res.status(400).send('Error while flagging account for deletion')
		return null;
	}
}

const delete_account=async(result)=>{
	if (result?.account_type === 'admin'){
		await delete_admin_schema(result);
		await delete_account_status(result);
	}
}

const delete_admin_schema=async({id})=>{
	const query = {client_ref: id};
	try {
		await Admin.findByIdAndDelete(query)
	} catch (error) {
		Logger({level:'error',message:err});
	}
	return ;
}


module.exports = delete_client_account