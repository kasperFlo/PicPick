import mongoose, { Document, Model } from 'mongoose';

const { Schema, model, models } = mongoose;

// ========== SCHEMA ==========

const ReviewSchema = new Schema(
  {
    factoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Factory',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true
  }
);

// ========== MODEL CREATION ==========

const Review = model('Review' , ReviewSchema);
export default Review;
