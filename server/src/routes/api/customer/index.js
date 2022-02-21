const express = require('express');
const router = express.Router();

router.use('/requestprovider', require('./request_provider'));
router.use('/', require('./provider_detail'));


module.exports = router;