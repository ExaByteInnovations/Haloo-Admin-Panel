require("dotenv").config();
var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var path = require('path');

// importing models
const Review = require('./src/models/review')
const Job = require('./src/models/job')
const Category = require('./src/models/service_info/category')

var cors = require('cors')

var app = express()

app.use(cors())

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(bodyParser.json())


app.use('/uploads', express.static('./uploads'));

mongoose.connect(
  'mongodb+srv://Alex:Alex@cluster0-myor5.mongodb.net/Haloo?retryWrites=true&w=majority',
  {useNewUrlParser: true, useUnifiedTopology: true}
)

var db = mongoose.connection

db.on('error', console.error.bind(console, 'Connection error'))
db.once('open', function (callback) {
  console.log('Connection succeeded.')
})

// forwarding models to routes
app.use((req, res, next) => {
  console.log(`Request_Endpoint: ${req.method} ${req.url}`)
  req.review = Review
  req.job = Job
  // req.category = Category
  next()
})

// Require Route
require('./src/routes')(app)



var port = process.env.PORT || 3000

app.listen(port, function () {
  console.log('listining to port 3000')
})
