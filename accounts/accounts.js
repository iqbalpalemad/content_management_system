const express = require('express');
const User    = require('../model/User')
const {signupValidation, loginValidation } = require('../validation/validation')

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
                    const user = new User({
                        name : req.body.name,
                        email : req.body.email,
                        password : req.body.password
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
            }
        })

        
    }
})

module.exports = router;