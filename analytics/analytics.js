const express                        = require('express');
const router                         = express.Router();
const contentEventRoute              = require('./api/content')
const completeEventRoute             = require('./api/complete');
const uniqueEventRoute               = require('./api/unique');


router.post('/',completeEventRoute)
router.post('/content/',contentEventRoute); 
router.post('/unique/',uniqueEventRoute); 

module.exports = router;