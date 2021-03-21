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
                    .trim()
                    .email()
                    .required(),
        password : Joi.string()
                      .trim()
                      .required()
                      .min(6)
                      .max(64)
        

    }) 

    return  loginValidationSchema.validate(loginData)
}

const passwordResetValidation =  (userData) => {
    const passwordResetValidationSchema  = Joi.object({
        id : Joi.string()
                    .trim()
                    .required(),
        password : Joi.string()
                      .trim()
                      .required()
                      .min(6)
                      .max(64)
        

    }) 

    return  passwordResetValidationSchema.validate(userData)
}

const forgotPasswordValidation = (userData) => {
    const forgotPasswordSchema  = Joi.object({
        email : Joi.string()
                    .trim()
                    .email()
                    .required()
        
    }) 

    return  forgotPasswordSchema.validate(userData)
}

module.exports.signupValidation         = signupValidation;
module.exports.loginValidation          = loginValidation;
module.exports.passwordResetValidation  = passwordResetValidation;
module.exports.forgotPasswordValidation = forgotPasswordValidation;