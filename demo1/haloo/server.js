var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

const Review = require('./src/models/review')
const Job = require('./src/models/job')
var cors = require('cors')

var app = express()

app.use(cors())

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(bodyParser.json())

mongoose.connect(
  'mongodb+srv://Alex:Alex@cluster0-myor5.mongodb.net/Haloo?retryWrites=true&w=majority',
  {useNewUrlParser: true, useUnifiedTopology: true}
)

var db = mongoose.connection

db.on('error', console.error.bind(console, 'Connection error'))
db.once('open', function (callback) {
  console.log('Connection succeeded.')
})

app.use((req, res, next) => {
  console.log(`Request_Endpoint: ${req.method} ${req.url}`)
  req.review = Review
  req.job = Job
  next()
})

// Require Route
const api = require('./src/api/routes')
// Configure app to use route
app.use('/api/', api)

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

var port = process.env.PORT || 3000

app.listen(port, function () {
  console.log('listining to port 3000')
})
