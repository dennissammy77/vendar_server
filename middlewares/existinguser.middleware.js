const { Client } = require('../models/ClientSchema');

const ExistingUser=async(email)=>{
    const query = { email: email};
    const projection = { email: 1, password: 1, name: 1};
    const result = await Client.findOne(query,projection);
    if (result){
        return result;
    }else{
        return null;
    }
}

module.exports = ExistingUser