const express = require('express');
const db = require('./config/database.js');
const cors = require('cors');

const app = express()
db.connect();
app.use(express.json());

let origins = ['http://localhost:3000']

app.use(cors({
	credentials:true,
	origins: origins
}));

const auth_routes = require('./routes/auth.route.js');
const shop_routes = require('./routes/shop.route.js');
const product_routes = require('./routes/product.route.js');

const {AuthenticateToken} = require('./middlewares/authenticate.js');

app.set('trust proxy', true);

app.use('/api/auth',auth_routes);
app.use('/api/shop',shop_routes);
app.use('/api/product',product_routes);

app.get('/',(req,res)=>{
	res.send('Hello This is Vendar server page!! Good Luck!!:)');
})
app.get('/protected',AuthenticateToken,(req,res)=>{
	res.status(200).send('Hello This is a protected route!!');
})

module.exports = app;