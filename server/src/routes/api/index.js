const express = require('express');
const MainRouter = express.Router();
const auth = require('../../middleware/auth');


MainRouter.use('/review', auth, require('./review.js'));
MainRouter.use('/job', auth, require('./job.js'));
MainRouter.use('/serviceinfo', auth, require('./service_info'));
MainRouter.use('/usermanagement', auth, require('./user_management'));
MainRouter.use('/auth', require('./auth'));
MainRouter.use('/setting', auth, require('./setting'));
MainRouter.use('/support', auth, require('./support'));
MainRouter.use('/staticfile', auth, require('./static_file'));
MainRouter.use('/', auth, require('./provider'));
MainRouter.use('/', auth, require('./customer'));
MainRouter.get('/', auth, (req, res) => { console.log('req.user',req.user);res.send('Hello World!'); });

module.exports = MainRouter;