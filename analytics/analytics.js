const express                        = require('express');
const router                         = express.Router();
const contentEventRoute              = require('./api/content')
const completeEventRoute             = require('./api/complete');

router.post('/content/',contentEventRoute); 
router.post('/',completeEventRoute)

module.exports = router;