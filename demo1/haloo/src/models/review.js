var mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    ratingBy: {
      type: String,
    },
    ratingFor: {
      type: String,
    },
    whoRated: {
      type: String,
    },
    jobNumber: {
      type: Number, required: true,
    },
    rating: {
        type: Number,
    },
    comment: {
      type: String,
    }, 
  },
    {
      timestamps: true
    });
  
  const Review = mongoose.model('review', reviewSchema)
  module.exports = Review;

