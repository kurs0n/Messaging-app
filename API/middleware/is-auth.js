const jwt = require('jsonwebtoken');
require('dotenv').config();
module.exports.isAuth = (req,res,next)=>{
    const authtoken = req.get('Authorization');
    if(!authtoken){
        const error = new Error();
        error.message = "Not authenticated!";
        error.statusCode = 401;
        throw error;
    }
    const token = authtoken.split(' ')[1];// Bearer
    let decodeToken;
    try{
        decodeToken = jwt.verify(token,process.env.SECRET_KEY);//veryfing is our token validate with our secret which we have in .env file
    }
    catch(err){
        err.statusCode = 500;
        throw err; 
    }
    if (!decodeToken){
        const error = new Error();
        error.message = "Not authenticated!";
        error.statusCode = 401; 
        throw error; 
    }
    req.userId = decodeToken.id;// setting req.userId with this decode token userId
    next();
};