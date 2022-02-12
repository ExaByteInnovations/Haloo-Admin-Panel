var mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    companyName: {
        type: String, required: true,
    },
    logo: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    emailAddress: {
        type: String,
    },
    phoneNumber: {
        type: String,
        unique: true,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    address: {
        type: String,
    },
    pincode: {
        type: Number,
    },
    averageRating: {
        type: Number,
    },
    lastAccessOn: {
        type: Date,
    },
    status: {
        type: String,
        default: 'active',
    },
  },
    {
      timestamps: true
    });
  
  const Customer = mongoose.model('vendor', vendorSchema)
  module.exports = Customer;