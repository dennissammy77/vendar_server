const mongoose = require('mongoose');
const { Schema } = mongoose;

const ClientSchema = new mongoose.Schema({
	name:					{ type: String },
	username:				{ type: String },
	email:					{ type: String , unique:true },
	mobile:					{ type: String },
	password:				{ type: String },
	account_type:			{ type: String },
	// vendar company users
	super_admin_account_ref:		{ type: mongoose.Schema.Types.ObjectId, ref: "SuperAdmin"},
	// shop owner users
	shop_admin_account_ref:		{ type: mongoose.Schema.Types.ObjectId, ref: "ShopAdmin"},
	vendor_account_ref:		{ type: mongoose.Schema.Types.ObjectId, ref: "Vendor"},
	customer_account_ref:	{ type: mongoose.Schema.Types.ObjectId, ref: "Customer"},
	account_status_ref:		{ type: mongoose.Schema.Types.ObjectId, ref: "Account_Status"},
	// company details		
	shop_ref:				{ type: mongoose.Schema.Types.ObjectId, ref: "Shop"},
	notification_ref:		{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }
});

// vendar company users
const SuperAdminSchema = new Schema({
	client_ref:	{ type: String},
	role:		{ type: String },
});

// Shop Owners users
const ShopAdminSchema = new Schema({
	client_ref:	{ type: String},
	role:		{ type: String },
});

const VendorSchema = new Schema({
	client_ref:		{ type: String},
	products:		[{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],
	transcations:	[{type: mongoose.Schema.Types.ObjectId, ref: 'Transaction'}]
});

const CustomerSchema = new Schema({
	client_ref:	{ type: String},
	gender:		{ type: String },
	address:	{ type: String },
});

const AccountStatusSchema = new Schema({
	client_ref:			{ type: String},
	suspension_status:	{ type: Boolean },
	suspension_reason:	{ type: String },
	approval_status:	{ type: Boolean },
	deletion_status:	{ type: Boolean },
	email_status:		{ type:	Boolean },
});

const Client = mongoose.model('Client',ClientSchema);
const SuperAdmin =	mongoose.model('SuperAdmin',SuperAdminSchema);
const ShopAdmin =	mongoose.model('ShopAdmin',ShopAdminSchema);
const Vendor = mongoose.model('Vendor',VendorSchema);
const Customer = mongoose.model('Customer',CustomerSchema);
const AccountStatus = mongoose.model('Account_Status',AccountStatusSchema);

module.exports = {
	Client,
	ShopAdmin,
	Vendor,
	Customer,
	AccountStatus,
	SuperAdmin,
}