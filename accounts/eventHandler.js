const AccountEvent        = require('../model/AccountEvent')


const addAccountEvent = async (event) => {
    const accountEvent = new AccountEvent({
        event      : event
    })

    try{
        const saveAccountEvent = await  accountEvent.save()
        return true;
    }
    catch(err){
        return false;
    }
}


module.exports.addAccountEvent = addAccountEvent;