const express = require('express');
const User    = require('../model/User')
const {signupValidation, loginValidation } = require('../validation/validation')
const bcrypt  = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

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

module.exports = router;