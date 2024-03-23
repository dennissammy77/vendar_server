const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new mongoose.Schema({
    name:           { type: String},
    description :   { type: String},
    price:          { type: String},
    category:       { type: String},
    items:          { type: String},
    discount:       { type: Boolean},
    discountprice:  { type: String},
    shop_ref:       { type: String},
    product_image:  { type: String},
    owner_ref_id:   { type: mongoose.Schema.Types.ObjectId, ref: "Client"},
    // owner ref
    product_status: { type: mongoose.Schema.Types.ObjectId, ref: "Product_Status"},
});

const ProductStatusSchema = new Schema({
	product_ref:		{ type: String},
	suspension_status:	{ type: Boolean },
	suspension_reason:	{ type: String },
	approval_status:	{ type: Boolean },
	deletion_status:	{ type: Boolean },
    publish_status:     { type: Boolean}
});

const Product = mongoose.model('Product', ProductSchema);
const ProductStatus = mongoose.model('Product_Status', ProductStatusSchema);

module.exports = { Product, ProductStatus };