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
const {AuthenticateToken} = require('./middlewares/authenticate.js');

app.set('trust proxy', true);
app.use('/api/auth',auth_routes);
app.get('/',(req,res)=>{
	res.send('Hello This is Vendar server page!! Good Luck Sam!!:)');
})
app.get('/protected',AuthenticateToken,(req,res)=>{
	res.send('Hello This is a protected route!!');
})

module.exports = app;