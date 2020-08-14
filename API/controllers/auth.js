require('dotenv').config();
const Account = require('../models/account');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.signup = async (req,res,next)=>{ 
    let existingAccount = await Account.findOne({email: req.body.email});
    if (existingAccount)
    {
        const error = new Error();
        error.message = 'Account already exist';
        error.statusCode = 401;
        return next(error);
    }
    existingAccount = await Account.findOne({login: req.body.login});
    if (existingAccount){
        const error = new Error();
        error.message = 'Account already exist';
        error.statusCode = 401;
        return next(error);
    }
    const account = new Account({...req.body,password: await bcrypt.hash(req.body.password,12)});
    await account.save();
    res.status(201).json({
        account: account,
        message: 'Succesfully created account'
    })
};

module.exports.login = async (req,res,next)=>{
    const login = req.body.login;
    const password = req.body.password;
    const account = await Account.findOne({login: login});
    if (!account)
    {
        const error = new Error();
        error.message = 'Account not exist';
        error.statusCode = 400;
        return next(error);
    }
    const logged = await bcrypt.compare(password,account.password);
    if(logged)
    {
        const token = await jwt.sign({
            id: account._id.toString()
        },process.env.SECRET_KEY,{
            expiresIn: '1h'
        });
        res.status(200).json({
            message: 'Logged',
            token: token
        });
    }
    else {
        const error = new Error();
        error.message = 'Wrong Password';
        error.statusCode = 401;
        return next(error);
    }
};