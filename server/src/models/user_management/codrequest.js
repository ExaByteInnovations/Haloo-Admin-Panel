var mongoose = require('mongoose');

const codRequestSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'customer'
    },
    status: {
      type: String,
      default: 'pending',
    },
  },
    {
      timestamps: true
    });
  
  const CodRequest = mongoose.model('codRequest', codRequestSchema)
  module.exports = CodRequest;

