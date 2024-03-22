const express = require('express');

const router = express.Router();

const { Create_New_Product } = require('../controllers/products/product.new.controller.js');
const { AuthenticateToken } = require('../middlewares/authenticate.js')

router.post('/new/:email',AuthenticateToken,Create_New_Product);

module.exports = router;