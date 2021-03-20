const Joi           = require('joi');



const signupValidation =  (signupData) => {
    const signupValidationSchema  = Joi.object({
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


const loginValidation =  (loginData) => {
    const loginValidationSchema  = Joi.object({
        email : Joi.string()
                    .email()
                    .required(),
        password : Joi.string()
                      .required()
                      .min(6)
                      .max(64)
        

    }) 

    return  loginValidationSchema.validate(loginData)
}

module.exports.signupValidation = signupValidation;
module.exports.loginValidation  = loginValidation;