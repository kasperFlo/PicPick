import mongoose, { Document, Model } from 'mongoose';
import { dbConnect } from './db';

// ============ 1) USER INTERFACES & SCHEMA ============ //

// Define interfaces for our schemas
export interface IWishlistItem {
  link: string;
  price: number;
  name: string;
}

export interface IUser extends Document {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  wishlist: IWishlistItem[];
}

// Wishlist Item Schema
const WishlistItemSchema = new mongoose.Schema({
  link: { type: String, required: true },
  price: { type: Number, required: true },
  name: { type: String, required: true },
});

// User Schema Definition
const UserSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  wishlist: [WishlistItemSchema],
});

// Create or get the User model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// ============ 2) FACTORY INTERFACES & SCHEMA ============ //

export interface IFactory extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FactorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true // automatically adds "createdAt" and "updatedAt"
});

const Factory: Model<IFactory> =
  mongoose.models.Factory || mongoose.model<IFactory>('Factory', FactorySchema);


// ============ 3) REVIEW INTERFACES & SCHEMA ============ //

export interface IReview extends Document {
  factoryId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
}

const ReviewSchema = new mongoose.Schema({
  factoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Factory',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    default: ''
  }
}, {
  timestamps: true // automatically adds "createdAt" and "updatedAt"
});

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);


// ============ 4) INIT ADMIN USER FUNCTION ============ //

// Function to initialize admin user if it doesn't exist
export async function initAdminUser() {
  // Make sure DB is connected first
  await dbConnect();
  
  const adminExists = await User.findOne({ username: 'AdminTest' });
  if (adminExists != null) {
    console.log('Admin user exists:', adminExists);
    return;
  }
  
  // If admin doesn't exist, create one
  console.log('Admin user not found, creating one...');
  await User.create({
    username: 'AdminTest',
    email: 'admin@example.com',
    password: 'password123', // Ideally hashed for production
    firstName: 'Admin',
    lastName: 'User',
    createdAt: new Date(),
    wishlist: [
      {
        name: 'Sony WH-1000XM4 Wireless Headphones',
        link: 'https://www.amazon.com/Sony-WH-1000XM4-Canceling-Headphones-phone-call/dp/B0863TXGM3',
        price: 348.00
      },
      {
        name: 'Samsung 49-Inch Odyssey G9 Gaming Monitor',
        link: 'https://www.bestbuy.com/site/samsung-odyssey-g9-49-led-curved-qhd-gaming-monitor-white/6425569.p',
        price: 1399.99
      },
      {
        name: 'Apple MacBook Pro 16-inch',
        link: 'https://www.walmart.com/ip/Apple-MacBook-Pro-16-inch-M3-Pro-chip-with-12-core-CPU-and-18-core-GPU-36GB-Unified-Memory-512GB-SSD-Space-Black/5032356228',
        price: 2699.00
      },
      {
        name: 'NVIDIA GeForce RTX 4080 Graphics Card',
        link: 'https://www.newegg.com/nvidia-geforce-rtx-4080/p/N82E16814487016',
        price: 1199.99
      },
      {
        name: 'Logitech MX Master 3S Mouse',
        link: 'https://www.amazon.com/Logitech-Master-Advanced-Wireless-Mouse/dp/B09HM94VDS',
        price: 99.99
      }
    ]
  });
  
  console.log('Admin user created successfully');
}

// export all
export { User, Factory, Review };
