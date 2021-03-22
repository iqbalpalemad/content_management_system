const Joi           = require('joi');

const createContentValidation =  (contentData) => {
    const createContentValidationSchema  = Joi.object({
        title : Joi.string()
                    .trim()
                    .required()
                    .min(1)
                    .max(1024)
        

    }) 
    
    return  createContentValidationSchema.validate(contentData)
}

const updateContentValidation =  (contentData) => {
    const updateContentValidationSchema  = Joi.object({
        title : Joi.string()
                    .trim()
                    .min(1)
                    .max(1024),
        body : Joi.string()
                    .trim()
                    .max(1024),
        id   : Joi.string()
                    .trim()
                    .required()


    }).or("title","body") 
    
    return  updateContentValidationSchema.validate(contentData)
}

const contentIdValidation =  (contentData) => {
    const contentIdValidationSchema  = Joi.object({
        id : Joi.string()
                    .trim()
                    .required()
        

    }) 
    
    return  contentIdValidationSchema.validate(contentData)
}

const contentShareValidation = (contentData) => {
    const contentShareValidationSchema  = Joi.object({
        id          : Joi.string()
                         .trim()
                         .required(),
        sharedWith  : Joi.string()
                         .trim()
                         .required(),
        permissions : Joi.array().items(Joi.string().valid('Read','Write'))
                         .required()
        

    }) 
    return  contentShareValidationSchema.validate(contentData)
}

const contentListValidation = (contentData) => {
    const contentListValidationSchema  = Joi.object({
        limit  : Joi.number()
                    .required(),
        page  : Joi.number()
                    .required(),
        owner : Joi.string()
                   .trim()
                   .required()
                   .valid('Collaborator','Visitor')
    }) 
    return  contentListValidationSchema.validate(contentData)
}

module.exports.createContentValidation = createContentValidation;
module.exports.updateContentValidation = updateContentValidation;
module.exports.contentIdValidation     = contentIdValidation;
module.exports.contentShareValidation  = contentShareValidation;
module.exports.contentListValidation   = contentListValidation;