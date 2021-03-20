const express = require('express');
const User    = require('../model/User')
const {signupValidation, loginValidation } = require('../validation/userValidation')
const bcrypt  = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const dotenv   = require('dotenv');
const router = express.Router();
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
                                        res.json({result : true, message : result._id});
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


router.post('/verify/:uuid',(req,res) => {
    uuid = req.params.uuid;
    User.updateOne({uuid : uuid},{emailVerified:true},(err,data) => {
        if(err){
            res.status(400).json({result : false, message : err});
        }
        else{
            console.log(data);
            if(data.nModified == 0){
                res.json({result : false, message : "Invalid URL"});
            }
            else{
                res.json({result : true, message : "Email address verified"});
            }
            
        }
    })
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


router.post('/test',(req,res) => {
    console.log("test route");
    var jwtSecret = process.env.JWT_SECRET;
    var jwtToken  = jwt.sign({id:'123',email:'iqbal@nethram.com'},jwtSecret,{expiresIn:'1d'})
    jwt.verify(jwtToken,jwtSecret,(err,decoded) =>{
        console.log(err,"errror");
        console.log(decoded.id,"decoded");
    })
    res.status(200).send({ auth: true, token: jwtToken });
})

module.exports = router;