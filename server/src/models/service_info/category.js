var mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String, required: true,
    },
    sequenceNumber: {
        type: Number,
    },
    status: {
      type: String,
    },
  },
    {
      timestamps: true
    });
  
  const Category = mongoose.model('category', categorySchema)
  module.exports = Category;

