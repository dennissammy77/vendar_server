const { Shop } = require("../../models/ShopSchema");

const get_shops = (async (req, res)=>{
    const shops = await Shop.find().populate('staff').populate('vendors').populate('products').exec();
    return res.status(200).send(shops);
});

const get_shop = (async (req, res)=>{
    const shops = await Shop.find().populate('staff').populate('vendors').exec();
    return res.status(200).send(shops);
});

module.exports = {
    get_shops
}