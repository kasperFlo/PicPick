import mongoose, { Document, Model } from 'mongoose';

// ========== 1) FACTORY SCHEMA & MODEL ==========
export interface IFactory extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const { Schema, model, models } = mongoose;

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
    timestamps: true // adds createdAt & updatedAt
  }
);

const Factory: Model<IFactory> =
  models.Factory || model<IFactory>('Factory', FactorySchema);

export default Factory;


// ========== 2) PRODUCT PULLER FUNCTION & INTERFACE ==========

// Our unified interface for product data:
export interface ProductResult {
  source: string;       // e.g. "GoogleShopping", "Amazon", "BestBuy", etc.
  title: string;        // Product name/title
  price: number;        // Numeric price
  link?: string;        // URL to product page
  rating?: number;      // Average rating
  reviews?: number;     // Number of reviews
  description?: string; // Product description
}

/**
 * pullProductData - Aggregates product data from multiple sources
 *                   and returns it in a standardized array format.
 *
 * @param query A product search term (e.g. "laptop" or "iphone 14")
 * @returns An array of product data from the integrated sources
 */
export async function pullProductData(query: string): Promise<ProductResult[]> {
  // 1) Call each source in parallel (these are placeholders):
  const [googleProducts, bestBuyProducts, amazonProducts] = await Promise.all([
    pullFromGoogleShopping(query),
    pullFromBestBuy(query),
    pullFromAmazon(query)
  ]);

  // 2) Combine into a single array
  const combined = [
    ...googleProducts,
    ...bestBuyProducts,
    ...amazonProducts
  ];

  // 3) (Optional) sort or filter combined data if needed
  return combined;
}


// ========== 3) PLACEHOLDER FUNCTIONS FOR EXTERNAL APIS ==========
// In real code, you'd replace these with actual fetch calls to each service.

async function pullFromGoogleShopping(query: string): Promise<ProductResult[]> {
  // Example: Call SerpApi or Google Shopping directly, parse real results
  // For now, return a mock example
  return [
    {
      source: 'GoogleShopping',
      title: `Mock Google result for: ${query}`,
      price: 999.99,
      link: 'https://google.com/shopping/some_product',
      rating: 4.5,
      reviews: 1023,
      description: 'This is a mock description for a Google Shopping product.'
    }
  ];
}

async function pullFromBestBuy(query: string): Promise<ProductResult[]> {
  // Example: Call BestBuy API with your key, parse results
  // For now, return a mock
  return [
    {
      source: 'BestBuy',
      title: `Mock BestBuy result for: ${query}`,
      price: 899.99,
      link: 'https://bestbuy.com/product/123',
      rating: 4.7,
      reviews: 88,
      description: 'Mock description for BestBuy product.'
    }
  ];
}

async function pullFromAmazon(query: string): Promise<ProductResult[]> {
  // Example: Call Amazon Product Advertising API, parse results
  // For now, return a mock
  return [
    {
      source: 'Amazon',
      title: `Mock Amazon result for: ${query}`,
      price: 949.99,
      link: 'https://amazon.com/dp/B99999',
      rating: 4.0,
      reviews: 512,
      description: 'Mock description for Amazon product.'
    }
  ];
}

