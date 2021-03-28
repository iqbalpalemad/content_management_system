const express                          = require('express');
const Content                          = require('../../model/Content')
const {userAuth}                       = require('../../middleware/userAuth');
const {updateContentValidation}        = require('../../validation/contentValidation')
const {addContentEvent}                = require('../eventHandler');
const router                           = express.Router();


router.post('/:contentId',userAuth,async (req,res) => {
    const { error , value } =  updateContentValidation(req.body);
    if(error){
        errorMessage = error.details[0].message;
        return res.status(400).json({result : false, message : errorMessage});
    }
    const content = await Content.findOne({_id : req.params.contentId})
    if(content.deleted){
        return res.status(400).json({result : false, message : "Content Already deleted"});
    }

    if(req.body.title){
        content.title = req.body.title;
    }
    if(req.body.body){
        content.body = req.body.body
    }

    content.updatedOn = Date.now();

    try{
        const saveContent    = await content.save()
        const saveEvent      = await addContentEvent(req.userId,saveContent._id,"update");
        return res.json({result : true, message : saveContent._id});
    }catch(err){
        res.status(400).json({result : false, message : err.message});
    }
})

module.exports = router;