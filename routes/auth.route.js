const express = require('express');
const { create_client_account } = require('../controllers/auth.signup.controller');
const delete_client_account = require('../controllers/auth.delete.controller');

const router = express.Router();

router.post('/signup',create_client_account);
router.delete('/delete',delete_client_account);

module.exports = router;