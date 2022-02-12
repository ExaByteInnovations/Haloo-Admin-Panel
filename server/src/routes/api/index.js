const express = require('express');
const MainRouter = express.Router();
const auth = require('../../middleware/auth');

MainRouter.use('/review', auth, require('./review.js'));
MainRouter.use('/job', auth, require('./job.js'));
MainRouter.use('/serviceinfo', auth, require('./service_info'));
MainRouter.use('/usermanagement', auth, require('./user_management'));
MainRouter.use('/auth', require('./auth'));
MainRouter.use('/setting', require('./setting'));
MainRouter.get('/', auth, (req, res) => { console.log('req.user',req.user);res.send('Hello World!'); });

module.exports = MainRouter;