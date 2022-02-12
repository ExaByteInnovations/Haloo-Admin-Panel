var mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    quote: {
      type: Number, 
    },
    city: {
        type: String,
    },
    jobTitle: {
      type: String,
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'customer',
    },
    propertyName: {
        type: String,
    },
    category:{
      type: mongoose.Schema.Types.ObjectId, ref: 'customer',
    },
    subCategory:{
      type: mongoose.Schema.Types.ObjectId, ref: 'customer',
    },
    status:{
        type: String,
    },
    // jobCategory:{
    //     type: String, 
    // },
    vendorId:{
      type: mongoose.Schema.Types.ObjectId, ref: 'vendor',
    },
    jobTotal:{
      type: Number,
    },
  },
    {
      timestamps: true
    });
  
  const Job = mongoose.model('job', jobSchema)
  module.exports = Job;

