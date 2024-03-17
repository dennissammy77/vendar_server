const logger = require('../../lib/logger.lib');
const { Shop, ShopStatus } = require('../../models/ShopSchema');
const { ExistingShop } = require('../../middlewares/existingshop.middleware');
const { ExistingUser } = require('../../middlewares/existinguser.middleware');
const { Client, AccountStatus, Vendor, ShopAdmin } = require('../../models/ClientSchema');

const delete_shop=(async(req,res)=>{
    let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0];

	const shop_id = req?.params?.shop_id;
	const email = req?.params?.email;
	const flag = req?.params?.flag;

	if (!flag || !email || !shop_id) {
		return res.status(403).send({error:true,message:'Missing details'});
	}

	const result = await ExistingUser(email);
	if (!result){
		return res.status(200).send({error:true,message:'This Email does not have an existing account'});
	}
    const existing_shop = await ExistingShop(shop_id);
    if (!existing_shop){
        return res.status(200).send({error:true,message:'This shop does not exist'});
    };
	try {
		if(flag === 'stage'){
			await flag_shop(shop_id);
            logger.log('info',`${ip} - ${existing_shop?.name} shop flagged for deletion`);
            return res.status(200).json({error:null,message:'Shop Flagged for deletion'});
		}else if(flag === 'deletion'){
			await delete_shop_schema(shop_id);
			const query = {email:email};
			const updateClient = {
				$unset: {
					"shop_ref":1
				}
			}
			await Client.updateOne(query,updateClient);
            logger.log('info',`${ip} - ${existing_shop?.name} shop account deleted`);
            return res.status(200).json({error:null,message:'shop account deleted successfully'});
		}else{
            return res.status(200).send({error:true,message:'store could not be deleted'});
        }
	} catch (error) {
		logger.log('error',`${ip} - Error in ${flag} account (${shop_id})`);
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
};

const delete_shop_schema=async(shop_id)=>{
	try{
		const existing_shop = await Shop.findOne({_id: shop_id}).populate('vendors').populate('staff').exec();
		const vendors = existing_shop.vendors;
		const staffs = existing_shop.staff;
		console.log(staffs);
		/**
		 * Delete Existing Vendors from the	store
		 */
		for(i=0; i<vendors.length; i++){
			let id = vendors[i]?.account_status_ref
			await AccountStatus.deleteOne({_id:id});
			console.log(`uid:${id} deleted` )
		}
		for(i=0; i<vendors.length; i++){
			let id = vendors[i]?.vendor_account_ref
			await Vendor.deleteOne({_id:id});
			console.log(`uid:${id} deleted` )
		}
		for(i=0; i<vendors.length; i++){
			let id = vendors[i]?._id
			await Client.deleteOne({_id:id});
			console.log(`uid:${id} deleted` )
		}
		/**
         * Delete Existing Staff from the    store
         */
		for(i=0; i<staffs.length; i++){
			let id = staffs[i]?.account_status_ref;
			if (existing_shop.owner_ref_id.toString() === staffs[i]._id.toString()){
				//console.log(`staff:${staffs[i].name} skipped the delete`);
				continue ;
			}
            await AccountStatus.deleteOne({_id:id});
            //console.log(`uid:${id} deleted` )
        }
		for(i=0; i<staffs.length; i++){
			let id = staffs[i]?.shop_admin_account_ref;
			if (existing_shop.owner_ref_id.toString() === staffs[i]._id.toString()){
				//console.log(`staff:${staffs[i].name} skipped the delete`);
				continue ;
			}
            await ShopAdmin.deleteOne({_id:id});
            //console.log(`uid:${id} deleted` )
        }
		for(i=0; i<staffs.length; i++){
			let id = staffs[i]?._id;
			if (existing_shop.owner_ref_id.toString() === staffs[i]._id.toString()){
				//console.log(`staff:${staffs[i].name} skipped the delete`);
				continue ;
			}
            await Client.deleteOne({_id:id});
            //console.log(`uid:${id} deleted` )
        }
		await ShopStatus.deleteOne({shop_ref:shop_id});
		await Shop.deleteOne({_id:shop_id});
	}catch(err){
		logger.log('error',`Error in deleting shop account shop id: ${shop_id}`);
	}
};

module.exports = delete_shop;