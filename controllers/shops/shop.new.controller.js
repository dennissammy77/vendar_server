const logger = require('../../lib/logger.lib');
const { ExistingUser } = require('../../middlewares/existinguser.middleware');
const { Client } = require('../../models/ClientSchema');
const { Shop, ShopStatus } = require('../../models/ShopSchema');
const { new_shop_created_confirmation } = require('../email.controller');

const Create_New_Shop = (async(req,res)=>{
    const payload = req.body;
    const email = req.params.email;
    let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0];
    if (!payload){
        return res.status(403).send({error:true,message:'Missing details'});
    }
    const result = await ExistingUser(email);
    try{
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
        if (result?.account_type !== 'shop_admin'){
            return res.status(200).send({error:true,message:'This Account is not authorized to create a new store.'});
        }
        const shop_name = payload?.name;
        const query = {name:shop_name};
        const existing_shop = await Shop.findOne(query);
        if (existing_shop){
            return res.status(200).send({error:true,message:'A shop with this name already exists'});
        }
        const NewShop = await Shop.create({
            name:           payload?.name,
            description:    payload?.description,
            mobile:         payload?.mobile,
            location:       payload?.location,
            email:          payload?.email,
            instagram_url:  payload?.instagram_url,
            twitter_url:    payload?.twitter_url,
            tiktok_url:     payload?.tiktok_url,
            whatsapp_url:   payload?.whatsapp_url,
            // owner ref
            owner_ref_id:   result?._id,
            staff:          [],    
            vendors:        [],
            customers:      [],
            products:       [],
            transactions:   [],
            notifications:  []
        });
        NewShop?.staff.push(result);
        NewShop.save()
        const shop_payload = {
            _id: NewShop._id,
            uid: result?._id
        }
        const email_payload = {
			name: result?.name,
			email: result?.email,
			company: payload?.name,
		}
        new_shop_created_confirmation(email_payload)
        await Create_ShopStatus_Schema(shop_payload);
        await Update_Client(shop_payload);
		logger.log('info',`${ip} - shop: ${payload?.name} shop_id: ${NewShop?._id} created`);
		return res.status(200).json({error:null,message:'store created successfully'});
    }catch(error){
        logger.log('error',`${ip} - System Error-[creating new shop account: uid: ${result?._id}, email: ${result?.email}]`);
        return res.sendStatus(500);
    }
});

const Create_ShopStatus_Schema=async(Shop_Details)=>{
	try{
		const NewStatus = await ShopStatus.create({
			shop_ref:	        Shop_Details?._id,
			suspension_status:	false,
			suspension_reason:	'',
			approval_status:	false,
			deletion_status:	false,
			email_status:		false
		});
		const id = Shop_Details?._id;
		const query = {_id:id};
		const updateShop = {
			shop_status: NewStatus?._id
		}
		await Shop.updateOne(query,updateShop)
	}catch(err){
        logger.log('error',`${ip} - System Error [Creating shop status account]`);
	}
}

const Update_Client=async(Shop_Details)=>{
    try {
        const id = Shop_Details?.uid;
        const shop_id = Shop_Details?._id;
        const query = {_id:id};
        const updateClient = {
            shop_ref: shop_id
        }
        await Client.updateOne(query,updateClient);
    } catch (error) {
        logger.log('error',`${ip} - System Error [updating user account on the created shop, shop_id: ${shop_id}, owner_id: ${id}]`);
    }
};

module.exports = Create_New_Shop;