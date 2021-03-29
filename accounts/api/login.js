const express                       = require('express');
const jwt                           = require('jsonwebtoken');
const bcrypt                        = require('bcryptjs');
const User                          = require('../../model/User')
const {loginValidation }            = require('../../validation/userValidation')
const {addAccountEvent}             = require('../eventHandler');
const router                        = express.Router();



router.post('/login',async (req,res) => {
    const { error , value } =  loginValidation(req.body);
    if(error){
        errorMessage = error.details[0].message;
        return res.status(400).json({result : false, message : errorMessage});
    }

    const user = await User.findOne({email:req.body.email});
    if(!user){
        return res.status(400).json({result : false, message : "email address not found"});
    }
    const passwordMatch = await bcrypt.compare(req.body.password,user.password);
    if(!passwordMatch){
        return res.status(400).json({result : false, message : "Password doesn't match"});
    }
    
    if(!user.emailVerified){
       return  res.status(400).json({result : false, message : "email address is not verified"});
    }

    

    const jwtSecret = process.env.JWT_SECRET;
    const jwtToken  = jwt.sign({id:user._id},jwtSecret,{expiresIn:'1d'})
    const saveEvent = await addAccountEvent("login",user._id);
    return res.json({result : true, message : "Logged in successfully",token : jwtToken});




})


module.exports = router;