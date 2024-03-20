const logger = require('../../lib/logger.lib');
const { ExistingUser } = require('../../middleware/existinguser.middleware');
const { Product } = require('../../models/ProductSchema');
const { Shop } = require('../../models/ShopSchema');

const Create_New_Product = (async(req, res)=>{
    const payload = req.body;
    const email = req.params.email;

    let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0];
    if (!payload){
        return res.status(403).send({error:true,message:'Missing details'});
    }
    const result = await ExistingUser(payload?.email);
    try {
        if (!result){
            return res.status(200).send({error:true,message:'This Email does not have an existing account, try signing up'});
        }
        if (!result?.account_status_ref?.email_status){
            return res.status(200).send({error:true,message:'Your account has not been verified yet. Complete your registration and try again.'});
        }
        if (result?.account_status_ref?.suspension_status){
            return res.status(200).send({error:true,message:'Your account has been suspended! You did not follow our company guidelines.'});
        }
        if (result?.account_status_ref?.deletion_status){
            return res.status(200).send({error:true,message:'This account has been flagged for deletion.'});
        }
        const query = {shop_ref:shop_ref};
        const existing_shop = await Shop.findOne(query);
        if (!existing_shop){
            return res.status(200).send({error:true,message:'This shop does not exist'});
        }
        const NewProduct = await Product.create({
            name:           payload?.name,
            description:    payload?.description,
            price:          payload?.price,
            category:       payload?.category,
            items:          payload?.items,
            discount:       { type: Boolean},
            discountprice:  payload?.discountprice,
            shop_ref:       payload?.shop_ref,
            // owner ref
            owner_ref_id:   payload?.owner_ref_id,
        });
        existing_shop?.products.push(NewProduct);
        existing_shop.save()
        await Create_ProductStatus_Schema(NewProduct);
        logger.log('info',`${ip} - Product ${payload?.name} added to shop: ${existing_shop?.name} shop_id: ${existing_shop?._id} created`);
		return res.status(200).json({error:null,message:'store created successfully'});
    } catch (error) {
        logger.log('error',`${ip} - System Error-[creating new product for a user id: ${result?._id}, email: ${result?.email}, shop_id: ${payload?.shop_ref}]`);
        return res.sendStatus(500);
    }
});

const Create_ProductStatus_Schema=async(Product_Details)=>{
	try{
		const NewStatus = await ShopStatus.create({
			product_ref:	        Product_Details?._id,
			suspension_status:	    false,
			suspension_reason:	    '',
			approval_status:	    false,
			deletion_status:	    false,
			email_status:		    false
		});
		const id = Product_Details?._id;
		const query = {_id:id};
		const updateProduct = {
			product_status: NewStatus?._id
		}
		await Product.updateOne(query,updateProduct)
	}catch(err){
        logger.log('error',`${ip} - System Error [Creating product status item]`);
	}
}