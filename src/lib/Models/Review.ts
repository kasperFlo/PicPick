import mongoose, { Document, Model } from 'mongoose';

const { Schema, model, models } = mongoose;

// ========== INTERFACE ==========

export interface IReview extends Document {
  factoryId: mongoose.Types.ObjectId; // or IFactory if populating
  userId: mongoose.Types.ObjectId;    // or IUser if populating
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

// ========== SCHEMA ==========

const ReviewSchema = new Schema<IReview>(
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

const Review: Model<IReview> =
  models.Review || model<IReview>('Review', ReviewSchema);

export default Review;
