const app = require('express')();
const bodyParser = require('body-parser');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const mongoose = require('mongoose');
const helmet = require('helmet');
require('dotenv').config();

app.use(helmet());
 
app.use(bodyParser.json());

app.use((req, res, next) => {//cors policy
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, person2, input, X-Requested-With, Origin, Accept');
    next();
  });

app.use('/auth',authRoute);

app.use('/user',userRoute);

app.use((error,req,res,next)=>{//error handling
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({
      message: message
    });
});

mongoose.connect(process.env.DB_URL,{useNewUrlParser: true,useUnifiedTopology:true})
.then(result=>{
    console.log('connected with database');
    const server=app.listen(3000);
    const socket = require('./utils/socket').init(server);
    socket.on('connect',socket=>{
      console.log('connected');
    });
})
.catch(err=>{
    console.log(err);
})