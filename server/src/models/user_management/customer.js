var mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    customerName: {
        type: String, required: true,
    },
    profileImage: {
        type: String,
    },
    emailAddress: {
        type: String,
    },
    phone: {
        type: String,
        unique: true,
    },
    ageBracket: {
        type: String,
    },
    averageRating: {
        type: Number,
    },
    address: {
        type: String,
    },
    pincode: {
        type: Number,
    },
    lastAccessOn: {
        type: Date,
    },
    codStatus: {
      type: String,
      default: 'active',
    },
    status: {
        type: String,
        default: 'active',
    },
  },
    {
      timestamps: true
    });
  
  const Customer = mongoose.model('customer', customerSchema)
  module.exports = Customer;