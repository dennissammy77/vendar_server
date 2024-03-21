const express = require('express');
const router = express.Router();
const { Create_New_Product } = require('../../controllers/products.controller.js');
const { AuthenticateToken } = require('../../')

router.post('new',AuthenticateToken,Create_New_Product);

module.exports = router;
