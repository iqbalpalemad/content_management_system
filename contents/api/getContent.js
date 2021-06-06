const express                          = require('express');
const Content                          = require('../../model/Content')
const {userAuth}                       = require('../../middleware/userAuth');
const {addContentEvent}                = require('../eventHandler');
const router                           = express.Router();


router.get('/:contentId',userAuth,async (req,res) => {
    try{
        const content = await Content.findOne({_id : req.params.contentId})
        if(!content){
            return res.status(400).json({result : false, message : "Content Not Found"});
        }
        if(content.deleted){
            return res.status(400).json({result : false, message : "Content Already Deleted"});
        }
        const saveEvent      = await addContentEvent(req.userId,content._id,"view");
        return  res.status(200).json({result : true, message : content});  
    }catch(err){
        return res.status(400).json({result : false, message : err.message});
    }

     
    
})


module.exports = router;