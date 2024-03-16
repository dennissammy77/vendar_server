const express = require('express');
const { create_client_account } = require('../controllers/users/auth.signup.controller');
const delete_client_account = require('../controllers/users/auth.delete.controller');
const sign_in_user = require('../controllers/users/auth.signin.controller');
const { AuthenticateToken, VerifyToken } = require('../middlewares/authenticate');
const {Verify_User,Verified_User} = require('../controllers/users/auth.verify.controller');
const { create_super_admin_account, create_shop_admin_account, create_vendor_account, email_test } = require('../controllers/users/user.account.controller');
const { SendOtpCode, password_reset } = require('../controllers/users/auth.password.controller');

const router = express.Router();

router.post('/signup',create_client_account);
router.post('/signin',sign_in_user);

router.delete('/delete/:uid/:email/:account_type/:flag',AuthenticateToken,delete_client_account);
router.post('/verify/:email',Verify_User);
router.get('/verified/:email/:uid',AuthenticateToken,Verified_User);

router.post('/create/super_staff',AuthenticateToken,create_super_admin_account);
router.post('/create/shop_admin',AuthenticateToken,create_shop_admin_account);
router.post('/create/vendor',AuthenticateToken,create_vendor_account);
router.post('/create/user/test',AuthenticateToken,email_test);

//password
router.post('/password/reset/code/:email/:code',SendOtpCode);
router.post('/password/reset/confirm',VerifyToken,password_reset);

module.exports = router;