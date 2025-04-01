import mongoose, { Document, Model } from 'mongoose';
const { Schema, model, models } = mongoose;  // Importing the necessary modules done this way ig


// ========== 1) SCHEMAS ==========

// For an individual wishlist item
const WishlistItemSchema = new Schema({
  link: { type: String, required: true },
  price: { type: Number, required: true },
  name: { type: String, required: true },
});

// For the User itself
const UserSchema = new Schema({
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, 'First Name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password should be at least 6 characters'],
    },
    wishlist: [WishlistItemSchema],
  },
  {
    timestamps: true 
  }
);

// ========== 3) MODEL CREATION ==========

export const User = model('User' , UserSchema); 
export const Wishlist = model('Wishlist' , WishlistItemSchema); 
