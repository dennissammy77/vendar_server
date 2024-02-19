const ExistingUser = require('../middlewares/existinguser.middleware.js');
const Hash_Str = require('../middlewares/hashstr.middleware.js');
const JWTGenerator = require('../middlewares/jwtgenerator.middleware.js');
const {
	Client,
	Admin,
	Staff,
	Vendor,
	Customer,
	AccountStatus
} = require('../models/ClientSchema.js');

const create_client_account = (async(req, res)=>{
	const payload = req.body;
	
	if (!payload?.email){
		return res.status(400).send('No input Found');
	}
	
	const result = await ExistingUser(payload.email);
	if (result){
		return res.status(400).send('This Email already has an existing account, try logging in');
	}
	// hash password
	const Hashed_Password = Hash_Str(payload?.password);
	// access token
	const Access_Token = JWTGenerator(payload);
	try{
		const NewClient = await Client.create({
				name:					payload?.name,
				username:				payload?.username,
				email:					payload?.email,
				mobile:					payload?.mobile,
				password:				Hashed_Password,
				account_type:			payload?.account_type
		});
		if (payload?.account_type === 'admin'){
			Create_Admin_Schema(NewClient);
		}
		return res.status(200).send(Access_Token);
	}catch(err){
		console.log(err)
		return res.status(400).send(err)
	}
});

const Create_Admin_Schema=async({User})=>{
	try{
		const NewAdmin = await Admin.create({
			role: '',
		})
		const id = User?._id;
		const query = {_id:id};
		const updateClient = {
			admin_account_ref: NewAdmin?._id
		}
		await Client.updateOne(query,updateClient)
	}catch(err){
		console.log(err)
	}
}

const Create_Staff_Schema=async({User})=>{
	try{
		const NewStaff = await Staff.create({
			role: '',
		})
		const id = User?._id;
		const query = {_id:id};
		const updateClient = {
			staff_account_ref: NewStaff?._id
		}
		await Client.updateOne(query,updateClient)
	}catch(err){
		console.log(err)
	}
}

const Create_Vendor_Schema=async({User})=>{
	try{
		const NewVendor = await Vendor.create({
			products: [],
			transactions:	[]
		})
		const id = User?._id;
		const query = {_id:id};
		const updateClient = {
			vendor_account_ref: NewVendor?._id
		}
		await Client.updateOne(query,updateClient)
	}catch(err){
		console.log(err)
	}
}

const Create_Customer_Schema=async({User})=>{
	try{
		const NewCustomer = await Customer.create({
			gender: '',
			address: ''
		})
		const id = User?._id;
		const query = {_id:id};
		const updateClient = {
			customer_account_ref: NewCustomer?._id
		}
		await Client.updateOne(query,updateClient)
	}catch(err){
		console.log(err)
	}
}

// const Create_Customer_Schema=async({User})=>{
// 	try{
// 		const NewCustomer = await Customer.create({
// 			gender: '',
// 			address: ''
// 		})
// 		const id = User?._id;
// 		const query = {_id:id};
// 		const updateClient = {
// 			customer_account_ref: NewCustomer?._id
// 		}
// 		await Client.updateOne(query,updateClient)
// 	}catch(err){
// 		console.log(err)
// 	}
// }

module.exports = {
	create_client_account
}
