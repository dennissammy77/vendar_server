const express = require('express');
const { AuthenticateToken } = require('../middlewares/authenticate');
const Create_New_Shop = require('../controllers/shops/shop.new.controller');
const Update_Shop_Details = require('../controllers/shops/shop.update.controller');
const delete_shop = require('../controllers/shops/shop.delete.controller');
const { get_shops } = require('../controllers/shops/shop.controller');

const router = express.Router();

router.post('/create/new/:email',AuthenticateToken,Create_New_Shop);
router.put('/update/shop/:email/:flag',AuthenticateToken,Update_Shop_Details);
router.delete('/delete/:shop_id/:email/:flag',AuthenticateToken,delete_shop);
router.get('/all',get_shops);


module.exports = router;