var mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
    customerId: {
        type: String, required: true,
    },
    query: {
        type: Number,
    },
    status:{
        type: String,
        default: 'pending'
    }
  },
    {
      timestamps: true
    });
  
  const Support = mongoose.model('support', supportSchema)
  module.exports = Support;

