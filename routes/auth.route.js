const express = require('express');
const { create_client_account, Create_Vendor_Account } = require('../controllers/auth.signup.controller');
const delete_client_account = require('../controllers/auth.delete.controller');
const sign_in_user = require('../controllers/auth.signin.controller');
const { AuthenticateToken } = require('../middlewares/authenticate');
const {Verify_User,Verified_User} = require('../controllers/auth.verify.controller');
const { create_super_admin_account, create_shop_admin_account } = require('../controllers/users/user.account.controller');

const router = express.Router();

router.post('/signup',create_client_account);
router.post('/signin',sign_in_user);

router.delete('/delete/:uid/:email/:account_type/:flag',AuthenticateToken,delete_client_account);

router.post('/create/vendor',AuthenticateToken,Create_Vendor_Account);
router.put('/verify/:email',Verify_User);
router.get('/verified/:email/:uid',Verified_User);

router.post('/create/super_staff',AuthenticateToken,create_super_admin_account);
router.post('/create/shop_admin',AuthenticateToken,create_shop_admin_account);

module.exports = router;