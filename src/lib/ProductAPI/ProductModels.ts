// File: /src/lib/ProductAPI/ProductModels.ts

import mongoose, { Document, Model } from 'mongoose';

export interface ProductListingInfo {
  name: string;
  price: {
    value: number;
    currency: string;
    formatted: string;
  };
  seller: string;
  platform: string;
  link: string;
  image: string;
  rating?: {
    value: number;
    count: number;
  };
  shipping?: string;
  condition?: string;
}

// For your MongoDB usage:
export interface IProductSearchResult extends Document {
  query: string;
  results: ProductListingInfo[];
  createdAt: Date;
}

// Example Mongoose schema for caching search results
const ProductSearchResultSchema = new mongoose.Schema({
  query: { type: String, required: true },
  results: { type: Array, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ProductSearchResult: Model<IProductSearchResult> =
  mongoose.models.ProductSearchResult ||
  mongoose.model<IProductSearchResult>('ProductSearchResult', ProductSearchResultSchema);

export default ProductSearchResult;
