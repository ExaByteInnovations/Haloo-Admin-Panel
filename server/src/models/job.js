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
    customer: {
        type: String,
    },
    propertyName: {
        type: String,
    },
    category:{
        type: String,
    },
    subCategory:{
        type: String,
    },
    status:{
        type: String,
    },
    jobCategory:{
        type: String, required: true,
    }
  },
    {
      timestamps: true
    });
  
  const Job = mongoose.model('job', jobSchema)
  module.exports = Job;

