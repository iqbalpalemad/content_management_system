const ContentEvent        = require('../model/ContentEvent')

const addContentEvent = async (userId,contentId,event) => {
    const contentEvent = new ContentEvent({
        userId     : userId,
        contentId  : contentId,
        event      : event
    })

    try{
        const saveContentEvent = await  contentEvent.save()
        return true;
    }
    catch(err){
        return false;
    }
}


module.exports.addContentEvent = addContentEvent;