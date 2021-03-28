const express                       = require('express');
const { v4: uuidv4 }                = require('uuid');
const User                          = require('../../model/User')
const {signupValidation }           = require('../../validation/userValidation')
const bcrypt                        = require('bcryptjs');
const {sendEmail}                   = require("../../email/email")
const {addAccountEvent}             = require('../eventHandler');
const router                        = express.Router();

//API to signup new users

router.post('/signup', async (req,res) => {
    const { error , value } =  signupValidation(req.body);   //Validate request.
    if(error){
        errorMessage = error.details[0].message;
        return res.status(400).json({result : false, message : errorMessage});
    }

    const user = await User.exists({email:req.body.email});  // Check if email already exist.
    if(user){
        return res.status(400).json({result : false, message : "email already exist"});
    }

    const hashedPassword = await bcrypt.hash(req.body.password,10);  // Hash password using bcrypt.js

    const newUser = new User({
        email    : req.body.email,
        password : hashedPassword,
        uuid     : uuidv4()
    })

    try{
        const saveUser   =  await newUser.save(); // Save new user.
        const emailBody  = "<html>\
                            <h3><a>Click Here to Activate Your email</a></h3>\
                        </html>"
        
        sendEmail('Verify Email <verify@samples.mailgun.org>',saveUser.email,"Verify Email","",emailBody); // Send email using mailgun.
        const saveEvent   = await addAccountEvent("signup");
        return res.json({result : true, message : saveUser._id,uuid : saveUser.uuid});
    }
    catch(err){
        return res.status(400).json({result : false, message : err.message});
    }
    
})

module.exports = router;