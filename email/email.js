
const mailgun = require("mailgun-js");

const sendEmail = async (from,to,subject,text='',html='') => {
    var mai_gun_api    = process.env.MAIL_GUN_KEY;
    var mai_gun_domain = process.env.MAIL_GUN_DOMAIN;
    const mg = mailgun({apiKey: mai_gun_api, domain: mai_gun_domain});
    const data = {
        from    : from,
        to      : to,
        subject : subject,
        text    : text,
        html    : html
    };
    try{
        sendMail = await mg.messages().send(data);
        return true;
    }
    catch(err){
        return false;
    }
}

module.exports.sendEmail = sendEmail;