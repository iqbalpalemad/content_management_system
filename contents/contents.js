const express                          = require('express');
const router                           = express.Router();
const getAllContentsRoute              = require('./api/getAllcontents');
const contentShareRoute                = require('./api/shareContent');
const getContentRoute                  = require('./api/getContent');
const deleteContentRoute               = require('./api/deleteContent');
const updateContentRoute               = require('./api/updateContent');
const createContentRoute               = require('./api/createContent')

router.post('/create',createContentRoute);          // Create new content
router.post('/:contentId',updateContentRoute);      // Update existing content
router.delete('/:contentId',deleteContentRoute);    // Delete existing content
router.get('/:contentId',getContentRoute);          // Get existing content
router.post('/:contentId/share',contentShareRoute); // Share existing content
router.get('/',getAllContentsRoute);                // Get all contens



module.exports = router;
