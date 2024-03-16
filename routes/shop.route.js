const express = require('express');
const { AuthenticateToken } = require('../middlewares/authenticate');
const Create_New_Shop = require('../controllers/shops/shop.new.controller');
const Update_Shop_Details = require('../controllers/shops/shop.update.controller');

const router = express.Router();

router.post('/create/new/:email',AuthenticateToken,Create_New_Shop);
router.put('/update/shop/:email/:flag',AuthenticateToken,Update_Shop_Details);

module.exports = router;