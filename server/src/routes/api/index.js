const express = require('express');
const MainRouter = express.Router();


MainRouter.use('/review', require('./review.js'));
MainRouter.use('/job', require('./job.js'));
MainRouter.use('/serviceinfo', require('./service_info'));
MainRouter.use('/usermanagement', require('./user_management'));
MainRouter.get('/', (req, res) => { res.send('Hello World!'); });

module.exports = MainRouter;