const Account = require('../models/account');

module.exports.signup = (req,res,next)=>{
    const account = new Account({...req.body});
    console.log(account);
};