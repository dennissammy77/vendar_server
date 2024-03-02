const express = require('express');
const { create_client_account } = require('../controllers/auth.signup.controller');
const delete_client_account = require('../controllers/auth.delete.controller');
const sign_in_user = require('../controllers/auth.signin.controller');

const router = express.Router();

router.post('/signup',create_client_account);
router.post('/signin',sign_in_user);
router.delete('/delete',delete_client_account);

module.exports = router;
