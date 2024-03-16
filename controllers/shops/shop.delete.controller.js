const logger = require('../../lib/logger.lib');
const { Shop, ShopStatus } = require('../../models/ShopSchema');
const { ExistingShop } = require('../../middlewares/existingshop.middleware');
const { ExistingUser } = require('../../middlewares/existinguser.middleware');

const delete_shop=(async(req,res)=>{
    let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0];
	const uid = req?.params?.uid;
	const shop_id = req?.params?.shop_id;
	const email = req?.params?.email;
	const account_type = req?.params?.account_type;
	const flag = req?.params?.flag;

	if (!uid || !flag || !email || !account_type || !shop_id) {
		return res.status(403).send({error:true,message:'Missing details'});
	}

	const result = await ExistingUser(email);
	if (!result){
		return res.status(200).send({error:true,message:'This Email does not have an existing account'});
	}
    const existing_shop = await ExistingShop(payload?._id);
    if (!existing_shop){
        return res.status(200).send({error:true,message:'This shop does not exist'});
    };
	try {
		if(flag === 'stage'){
			await flag_shop(shop_id);
            logger.log('info',`${ip} - ${result?.name} shop flagged for deletion`);
            return res.status(200).json({error:null,message:'Shop Flagged for deletion'});
		}else{
            return res.status(200).send({error:true,message:'store could not be deleted'});
        }
	} catch (error) {
		logger.log('error',`${ip} - Error in ${flag} ${account_type} account (${uid})`);
		return res.status(200).json({error:true,message:`Error in ${flag} account`});
	}
});

const flag_shop=async(shop_id)=>{
    const query = {shop_ref:shop_id};
	const update = {
		deletion_status: true
	}
	try{
		await ShopStatus.updateOne(query,update);
	}catch(err){
		throw new Error('Error while flagging shop for deletion')
	}
}

module.exports = delete_shop;