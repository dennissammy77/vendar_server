const mongoose = require('mongoose');
require('dotenv').config();

const user_name = process.env.MONGODB_USER
const user_pswd = process.env.MONGODB_PSWD
const user_cluster = process.env.MONGODB_CLUSTER

const URI =  `mongodb+srv://${user_name}:${user_pswd}@${user_cluster}.od6xjdu.mongodb.net/development?retryWrites=true&w=majority`;
//const URI =  `mongodb+srv://${user_name}:${user_pswd}@${user_cluster}.od6xjdu.mongodb.net/Production?retryWrites=true&w=majority`;

exports.connect=()=>{
	mongoose.connect(
		URI
	).then(()=>{
		console.log('db connected succssfully')
	}).catch((err)=>{
		console.log(err);
		return err;
	})
}
