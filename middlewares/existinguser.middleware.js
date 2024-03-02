const { Client, Admin } = require('../models/ClientSchema');

const ExistingUser=async(email)=>{
    const query = { email: email};
    const projection = { email: 1, password: 1, name: 1, account_type: 1};
    const result = await Client.findOne(query,projection).populate('account_status_ref').exec();
    if (result){
        return result;
    }else{
        return null;
    }
}

const ExistingAdmin=async(uid)=>{
    const query = { client_ref: uid};
    const result = await Admin.findOne(query);
    if (result){
        return result;
    }else{
        return null;
    }
}

module.exports = {
    ExistingUser,
    ExistingAdmin
}