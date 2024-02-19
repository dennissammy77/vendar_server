const mongoose = require('mongoose');
const { Schema } = mongoose;

const ClientSchema = new mongoose.Schema({
	//
	name:					{ type: String },
	username:				{ type: String },
	email:					{ type: String , unique:true },
	mobile:					{ type: String },
	password:				{ type: String },
	account_type:			{ type: String },
	admin_account_ref:		{ type: mongoose.Schema.Types.ObjectId, ref: "Admin"},
	staff_account_ref:		{ type: mongoose.Schema.Types.ObjectId, ref: "Staff"},
	vendor_account_ref:		{ type: mongoose.Schema.Types.ObjectId, ref: "Vendor"},
	customer_account_ref:	{ type: mongoose.Schema.Types.ObjectId, ref: "Customer"},
	account_status:			{ type: mongoose.Schema.Types.ObjectId, ref: "Account_Status"},
	shop_ref:				{ type: mongoose.Schema.Types.ObjectId, ref: "Shop"},
	notification_ref:		{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }
});

const AdminSchema = new Schema({
	role:		{ type: String },
});

const StaffSchema = new Schema({
	role:		{ type: String },
});

const VendorSchema = new Schema({
	products:		[{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],
	transcations:	[{type: mongoose.Schema.Types.ObjectId, ref: 'Transaction'}]
});

const CustomerSchema = new Schema({
	gender:		{ type: String },
	address:	{ type: String },
});

const AccountStatusSchema = new Schema({
	suspension_status:	{ type: Boolean },
	suspension_reason:	{ type: String },
	approval_status:	{ type: Boolean },
	deletion_status:	{ type: Boolean },
	email_status:		{ type:	Boolean }
});

const Client = mongoose.model('Client',ClientSchema);
const Admin =	mongoose.model('Admin',AdminSchema);
const Staff = mongoose.model('Staff',StaffSchema);
const Vendor = mongoose.model('Vendor',VendorSchema);
const Customer = mongoose.model('Customer',CustomerSchema);
const AccountStatus = mongoose.model('Account_Status',AccountStatusSchema);

module.exports = {
	Client,
	Admin,
	Staff,
	Vendor,
	Customer,
	AccountStatus
}
