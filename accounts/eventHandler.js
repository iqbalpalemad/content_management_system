const AccountEvent        = require('../model/AccountEvent')


const addAccountEvent = async (event,userId="") => {
    const accountEvent = new AccountEvent({
        event      : event
    })

    if(userId != ""){
        accountEvent.userId = userId;
    }

    try{
        const saveAccountEvent = await  accountEvent.save()
        return true;
    }
    catch(err){
        return false;
    }
}


module.exports.addAccountEvent = addAccountEvent;