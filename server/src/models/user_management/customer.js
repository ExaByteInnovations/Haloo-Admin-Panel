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
    city: {
        type: String,
    },
    phone: {
        type: String,
        unique: true,
        trim: true,
    },
    state: {
        type: String,
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
    token: { 
        type: String 
    },
    otp: {
        type: Number,
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