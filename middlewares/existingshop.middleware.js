const { Shop } = require('../models/ShopSchema');

const ExistingShop=async(id)=>{
    const query = { _id: id};
    const projection = { name: 1, owner_ref_id: 1};
    const result = await Shop.findOne(query,projection).populate('shop_status').exec();
    if (result){
        return result;
    }else{
        return null;
    }
};
module.exports = {
    ExistingShop,
}