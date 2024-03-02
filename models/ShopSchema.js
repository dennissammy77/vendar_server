const mongoose = require('mongoose');
const { Schema } = mongoose;

const ShopSchema = new mongoose.Schema({
    name:           { type: String},
    description :   { type: String},
    mobile:         { type: String},
    location:       { type: String},
    email:          { type: String},
    instagram_url:  { type: String},
    twitter_url:    { type: String},
    tiktok_url:     { type: String},
    whatsapp_url:   { type: String},
    // owner ref
    owner_ref_id:   { type: mongoose.Schema.Types.ObjectId, ref: "Admin"},
    staff:          [{ type: mongoose.Schema.Types.ObjectId, ref: "Staff"}],    
    vendors:        [{ type: mongoose.Schema.Types.ObjectId, ref: "Vendor"}],
    customers:      [{ type: mongoose.Schema.Types.ObjectId, ref: "Customer"}],
    products:       [{ type: mongoose.Schema.Types.ObjectId, ref: "Product"}],
    transactions:   [{ type: mongoose.Schema.Types.ObjectId, ref: "Transactions"}],
    notifications:  [{ type: mongoose.Schema.Types.ObjectId, ref: "Notifications"}],
    shop_status:    { type: mongoose.Schema.Types.ObjectId, ref: "Shop_Status"},
});

const ShopStatusSchema = new Schema({
	shop_ref:			{ type: String},
	suspension_status:	{ type: Boolean },
	suspension_reason:	{ type: String },
	approval_status:	{ type: Boolean },
	deletion_status:	{ type: Boolean },
	email_status:		{ type:	Boolean },
    publish_status:     { type: Boolean}
});