const express = require('express');
const User    = require('../model/User')
const {signupValidation, loginValidation,passwordResetValidation,forgotPasswordValidation } = require('../validation/userValidation')
const bcrypt  = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const dotenv   = require('dotenv');
const {sendEmail} = require("../email/email")
const mailgun = require("mailgun-js");
const router = express.Router();
const {userAuth} = require('../middleware/userAuth');
dotenv.config();

router.post('/signup', (req,res) => {
    const { error , value } =  signupValidation(req.body);
    if(error){
        errorMessage = error.details[0].message;
        res.status(400).json({result : false, message : errorMessage});
    }
    else{
        
        User.exists({email:req.body.email}, (err,result) => {
            if(err){
                res.status(400).json({result : false, message : err.message});
            }
            else{
                if(result){
                    res.status(400).json({result : false, message : "email already exist"});
                }
                else{
                    bcrypt.hash(req.body.password,10, (err,hash) => {
                        if(err){
                            res.status(400).json({result : false, message : err});
                        }
                        else{
                            const user = new User({
                                email    : req.body.email,
                                password : hash,
                                uuid     : uuidv4()
                            })
                            try{
                                user.save((err,result) => {
                                    if(err){
                                        console.log("error from here");
                                        console.log(err.message);
                                        res.status(400).json({result : false, message : err.message});
                                    }
                                    else{
                                        var emailBody = "<html>\
                                                            <h3><a>Click Here to Activate Your email</a></h3>\
                                                        </html>"
                                        
                                        sendEmail('Verify Email <verify@samples.mailgun.org>',user.email,"Verify Email","",emailBody);
                                        res.json({result : true, message : result._id,uuid : result.uuid});

                                    }
                                })
                            }
                            catch(err){
                                res.status(400).send(err.message);
                            }
                        }
                    })
                    
                }
            }
        })

        
    }
})


router.post('/verify/:uuid',async (req,res) => {
    uuid = req.params.uuid;
    const updateVerified = await User.updateOne({uuid : uuid},{emailVerified:true});
    if(updateVerified.nModified == 0){
        res.json({result : false, message : "Invalid URL"});
    }
    else{
        res.json({result : true, message : "Email address verified"});
    }
 
})



router.post('/login', (req,res) => {
    const { error , value } =  loginValidation(req.body);
    if(error){
        errorMessage = error.details[0].message;
        res.status(400).json({result : false, message : errorMessage});
    }
    else{
        User.findOne({email:req.body.email}, (err,user) => {
            if(err){
                res.status(400).json({result : false, message : err.message});
            }
            else{
                if(!user){
                    res.status(400).json({result : false, message : "email address not found"});
                }
                else if(!user.emailVerified){
                    res.status(400).json({result : false, message : "email address is not verified"});
                }
                else{
                    bcrypt.compare(req.body.password,user.password, (err,result) => {
                        if(err){
                            res.status(400).json({result : false, message : err});
                        }
                        else{
                            if(result){
                                var jwtSecret = process.env.JWT_SECRET;
                                var jwtToken  = jwt.sign({id:user._id},jwtSecret,{expiresIn:'1d'})
                                res.json({result : true, message : "Logged in successfully",token : jwtToken});
                            }
                            else{
                                res.status(400).json({result : false, message : "Password doesn't match"});
                            }
                        }
                    })
                }
            }
        })
    }
    
})

router.post('/passwordReset',userAuth, async (req,res) => {
    const { error , value } =  passwordResetValidation(req.body);
    if(error){
        errorMessage = error.details[0].message;
        res.status(400).json({result : false, message : errorMessage});
    }
    else{
        
        const salt              = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(req.body.password, salt);

        const updatePassword    = await User.updateOne({_id : req.body.id},{password:encryptedPassword,passwordUpdatedOn:Date.now()});
        if(updatePassword.nModified == 0){
            res.json({result : false, message : "Error in update"});
        }
        else{
            res.json({result : true, message : "Password Updated Successfully"});
        }
    }
})

router.post('/forgotPassword',async (req,res) => {
    const { error , value } =  forgotPasswordValidation(req.body);
    if(error){
        errorMessage = error.details[0].message;
        res.status(400).json({result : false, message : errorMessage});
    }
    else{
        var emailBody = "<html>\
                        <h3><a>Click Here to Reset Your passw0rd</a></h3>\
                    </html>"
        var emailSend = await  sendEmail('Password Reset <reset@samples.mailgun.org>',req.body.email,"Password Reset","",emailBody);
        if(emailSend){
            res.json({result : true, message : "Email sent Successfully"});
        }
        else{
            res.status(400).json({result : false, message : "email send failed"});
        }
    }

})


router.post('/test',async (req,res) => {
    var emailBody = "<html>\
                        <h3><a>Click Here to Activate Your email</a></h3>\
                    </html>"
    
    var emailSend = await  sendEmail('Verify Email <verify@samples.mailgun.org>','iqbalpalemad@gmail.com',"Verify Email","",emailBody);
    console.log(emailSend);
    res.status(200).json({ auth: true});
})

module.exports = router;