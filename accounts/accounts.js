const express                        = require('express');
const router                         = express.Router();
const signUpRoute                    = require('./api/signup');
const verifyEmailRoute               = require('./api/verifyEmail');
const loginRoute                     = require('./api/login')
const passwordResetRoute             = require('./api/passwordReset')
const forgotPasswordRoute            = require('./api/forgotPassword')


router.post('/signup',signUpRoute)
router.post('/verify/:uuid',verifyEmailRoute)
router.post('/login', loginRoute)
router.post('/passwordReset',passwordResetRoute)
router.post('/forgotPassword',forgotPasswordRoute)


module.exports = router;