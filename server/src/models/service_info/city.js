var mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    cityName: {
        type: String, required: true,
    },
    stateName: {
        type: String, required: true,
    },
    status: {
      type: String,
    },
  },
    {
      timestamps: true
    });
  
  const City = mongoose.model('city', citySchema)
  module.exports = City;

