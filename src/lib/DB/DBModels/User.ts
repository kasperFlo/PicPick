import mongoose, { Document, Model } from 'mongoose';

const { Schema, model, models } = mongoose;

// ========== 1) INTERFACES ==========

// For an individual wishlist item
export interface IWishlistItem {
  link: string;
  price: number;
  name: string;
}

// For the user document
export interface IUser extends Document {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  wishlist: IWishlistItem[];
  createdAt: Date;
  updatedAt?: Date;
}

// ========== 2) SCHEMAS ==========

// For the array of wishlist items
const WishlistItemSchema = new Schema({
  link: { type: String, required: true },
  price: { type: Number, required: true },
  name: { type: String, required: true },
});

// For the User itself
const UserSchema = new Schema<IUser>(
  {
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
    timestamps: true // automatically adds "createdAt" and "updatedAt"
  }
);

// ========== 3) MODEL CREATION ==========

// Avoid recompiling model if it's already compiled (Next.js quirk)
const User: Model<IUser> = models.User || model<IUser>('User', UserSchema);

export default User;
