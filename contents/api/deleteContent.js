const express                          = require('express');
const Content                          = require('../../model/Content')
const {userAuth}                       = require('../../middleware/userAuth');
const router                           = express.Router();
const {addContentEvent}                = require('../eventHandler');


router.delete('/:contentId',userAuth,async (req,res) => {
   

    try{
        const content = await Content.findOne({_id : req.params.contentId})
        if(content.deleted){
            return res.status(400).json({result : false, message : "Content Already deleted"});
        }

        content.deleted      = true;
        content.deletedOn    = Date.now();
        const saveContent    = await content.save()
        const saveEvent      = await addContentEvent(req.userId,saveContent._id,"delete");
        return res.status(200).json({result : true, message : "Content Deleted"});
    }
    catch(err){
        res.status(400).json({result : false, message : err.message});
    }
    
})

module.exports = router;