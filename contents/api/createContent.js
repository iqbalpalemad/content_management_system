const express                          = require('express');
const Content                          = require('../../model/Content')
const {userAuth}                       = require('../../middleware/userAuth');
const {createContentValidation}        = require('../../validation/contentValidation')
const {addContentEvent}                = require('../eventHandler');
const router                           = express.Router();


router.post('/create', userAuth,async (req,res) => {
    const { error , value } =  createContentValidation(req.body);
    if(error){
        errorMessage = error.details[0].message;
        return res.status(400).json({result : false, message : errorMessage});
    }

    const content = new Content({
        userId : req.userId,
        title  : req.body.title,
    })

    try{
        const saveContent = await  content.save();
        const saveEvent   = await addContentEvent(req.userId,saveContent._id,"create");
        return res.json({result : true, message : saveContent._id});
    }
    catch(err){
        return res.status(400).json({result : false, message : err.message});
    }
})

module.exports  = router;