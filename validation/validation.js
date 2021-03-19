const Joi           = require('joi');



const signupValidation =  (signupData) => {
    const signupValidationSchema  = Joi.object({
        name : Joi.string()
                .required()
                .min(1)
                .max(1024),

        email : Joi.string()
                    .email()
                    .required(),
        password : Joi.string()
                      .required()
                      .min(6)
                      .max(64)
        

    }) 
    
    return  signupValidationSchema.validate(signupData)
}


const loginValidation = async (loginData) => {
    const loginValidationSchema  = Joi.object({
        email : Joi.string()
                    .email()
                    .required(),
        password : Joi.string()
                      .required()
                      .min(6)
                      .max(64)
        

    }) 

    return await loginValidationSchema.validateAsync(loginData)
}

module.exports.signupValidation = signupValidation;
module.exports.loginValidation  = loginValidation;