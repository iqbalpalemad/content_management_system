const express                          = require('express');
const Content                          = require('../../model/Content')
const {userAuth}                       = require('../../middleware/userAuth');
const {contentShareValidation }        = require('../../validation/contentValidation')
const router                           = express.Router();
const {addContentEvent}                = require('../eventHandler');

router.post('/:contentId/share',userAuth,async (req,res) => {
    const { error , value } =  contentShareValidation(req.body);
    if(error){
        errorMessage = error.details[0].message;
        return res.status(400).json({result : false, message : errorMessage});
    }
    try{
        const content = await Content.findOne({_id : req.params.contentId})
        if(content.deleted){
            return res.status(400).json({result : false, message : "Content Already deleted"});
        }

        content.shared      = true;
        content.sharedWith  = req.body.sharedWith;
        content.sharedOn    = Date.now();
        content.permissions = req.body.permissions;
        const contentSave   = await content.save();
        const saveEvent      = await addContentEvent(req.userId,contentSave._id,"share");
        return res.json({result : true, message : "Content Shared Successfully"});
    }
    catch(err){
        return res.status(400).json({result : false, message : err.message});
    }
    
})

module.exports = router;