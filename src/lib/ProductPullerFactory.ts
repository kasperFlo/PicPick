import mongoose, { Document, Model } from 'mongoose';

const { Schema, model, models } = mongoose;

// ========== INTERFACE ==========

export interface IFactory extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ========== SCHEMA ==========

const FactorySchema = new Schema<IFactory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true // adds "createdAt" and "updatedAt"
  }
);

// ========== MODEL CREATION ==========

const Factory: Model<IFactory> =
  models.Factory || model<IFactory>('Factory', FactorySchema);

export default Factory;
