const logger = require('../../lib/logger.lib');
const { Shop, ShopStatus } = require('../../models/ShopSchema');
const { ExistingShop } = require('../../middlewares/existingshop.middleware');
const { ExistingUser } = require('../../middlewares/existinguser.middleware');

const Update_Shop_Details = (async (req,res)=>{
    const payload = req.body;
    const email = req.params.email;
    const flag = req.params.flag;
    let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0];
    if (!payload){
        return res.status(403).send({error:true,message:'Missing details'});
    }
    const result = await ExistingUser(email);
    if (!result){
        return res.status(200).send({error:true,message:'This Email does not have an existing account, try signing up'});
    }
    if (result?.account_status_ref?.suspension_status){
        return res.status(200).send({error:true,message:'Your account has been suspended! You did not follow our company guidelines.'});
    }
    if (result?.account_status_ref?.deletion_status){
        return res.status(200).send({error:true,message:'This account has been flagged for deletion.'});
    };
    const existing_shop = await ExistingShop(payload?._id);
    if (!existing_shop){
        return res.status(200).send({error:true,message:'This shop does not exist'});
    };
    if (existing_shop?.shop_status?.suspension_status && flag == 'details'){
        return res.status(200).send({error:true,message:'Your shop has been suspended! You did not follow our company guidelines.'});
    }
    if (existing_shop?.shop_status?.deletion_status && flag == 'details'){
        return res.status(200).send({error:true,message:'Your shop has been flagged for deletion'});
    }
    try {
        if (flag === 'details'){
            const query = { _id: payload._id};
            const update = {
                name:           payload?.name,
                description:    payload?.description,
                mobile:         payload?.mobile,
                location:       payload?.location,
                email:          payload?.email,
                instagram_url:  payload?.instagram_url,
                twitter_url:    payload?.twitter_url,
                tiktok_url:     payload?.tiktok_url,
                whatsapp_url:   payload?.whatsapp_url,
                owner_ref_id:   payload?._id,
            };
            await Shop.updateOne(query,update);
            logger.log('info',`${ip} - shop: ${payload?.name} shop_id: ${payload?._id} updated`);
            return res.status(200).send({error:null,message:'store updated successfully'});
        }else if (flag ==='status'){
            await Update_Shop_status(payload);
            logger.log('info',`${ip} - shop: ${payload?.name} shop_id: ${payload?._id} updated`);
            return res.status(200).send({error:null,message:'store updated successfully'});
        }else{
            return res.status(200).send({error:true,message:'store could not be updated'});
        }
    }catch(err){
        console.log(err)
        logger.log('error',`${ip} - System Error-[updating shop details shop_name: ${existing_shop?.name} shop_id: ${existing_shop?._id}`);
        return res.status(500).send({error:true,message:'Internal server error'});
    }
});

const Update_Shop_status = async(Shop) => {
    const {_id,suspension_status,suspension_reason,approval_status,deletion_status,email_status} = Shop;
    const query = {shop_ref:_id};
    const update = {
        suspension_status,
        suspension_reason,
        approval_status,
        deletion_status,
        email_status
    }
    try {
        await ShopStatus.updateOne(query, update)
    } catch (error) {
        logger.log('error', error);
    }
}

module.exports = Update_Shop_Details;