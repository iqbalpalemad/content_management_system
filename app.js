const express  = require('express');
const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const accountRoutes = require('./accounts/accounts');
const contentRoutes = require('./contents/contents')
const app           = express();
dotenv.config();




mongoose.connect(process.env.DB_CONNECT,
    { useUnifiedTopology: true, useNewUrlParser: true }, () =>{
    console.log("connected to db");
})
app.use(express.json());
app.use('/accounts',accountRoutes);
app.use('/contents',contentRoutes);


app.listen(5000, () => {
    console.log("server is up and running")
})