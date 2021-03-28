const Joi           = require('joi');

const eventValidation =  (eventData) => {
    const eventValidationSchema  = Joi.object({
        startTime : Joi.date().iso().required(),
        endTime   : Joi.date().iso().greater(Joi.ref('startTime')).required(),
        id : Joi.string()
    })
    return  eventValidationSchema.validate(eventData)
}

module.exports.eventValidation         = eventValidation;