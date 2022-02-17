var mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    customerName: {
        type: String,
    },
    profileImage: {
        type: String,
    },
    companyName: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    type: {
        type: String,
        enum : ['customer','vendor'],
    },
    online: {
        type: Boolean,
        default: false,
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