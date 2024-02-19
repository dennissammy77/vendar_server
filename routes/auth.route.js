const express = require('express');
const { create_client_account } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/signup',create_client_account);

module.exports = router;