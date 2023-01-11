const express       = require('express');
const mongoose      = require('mongoose');
const dotenv        = require('dotenv');
const accountRoutes = require('./accounts/accounts');
const contentRoutes = require('./contents/contents')
const analyticRoute = require('./analytics/analytics')
const app           = express();
dotenv.config();



if(process.env.NODE_ENV !== "test"){
    mongoose.connect(process.env.DB_CONNECT,
        { useUnifiedTopology: true, useNewUrlParser: true }, () =>{
        console.log("connected to db");
    })
}
app.use(express.json());
app.use('/accounts',accountRoutes);   //Routes related to account user action
app.use('/contents',contentRoutes);   //Routes related to content actions
app.use('/analytics',analyticRoute);   //Routes related to analytics actions


module.exports = app;