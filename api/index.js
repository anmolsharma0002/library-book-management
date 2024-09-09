var express = require('express');
var router = express.Router();

// Version 1 Routes

/** -- Client Routes -- */
router.use('/v1/client', require('./v1/client'));

/** -- Declare Admin Routes Below -- **/

/** -- Version 2 Routes Will be Declared Below -- */

module.exports = router;