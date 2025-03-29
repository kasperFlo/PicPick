import mongoose, { Document, Model } from 'mongoose';

// ========== 1) Mongoose Model (Optional) ==========
export interface IFactory extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const { Schema, model, models } = mongoose;

const FactorySchema = new Schema<IFactory>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

const Factory: Model<IFactory> =
  models.Factory || model<IFactory>('Factory', FactorySchema);

export default Factory;


// ========== 2) PRODUCT LISTING INTERFACE ==========

export interface ProductListingInfo {
  name: string;                      // e.g. "Apple MacBook Pro 14-inch"
  price: {
    value: number;                   // e.g. 1499.99
    currency: string;               // e.g. "USD"
    formatted: string;              // e.g. "$1,499.99"
  };
  seller: string;                    // e.g. "Best Buy" or "Amazon"
  platform: string;                  // e.g. "GoogleShopping", "Amazon", "BestBuy"
  link: string;                      // product detail page
  image: string;                     // main product image URL
  rating?: {
    value: number;                   // e.g. 4.7
    count: number;                   // e.g. 120 (number of reviews)
  };
  shipping?: string;                 // e.g. "Free shipping"
  condition?: string;               // e.g. "New" or "Refurbished"
}


// ========== 3) MAIN FUNCTION TO FETCH AGGREGATED LISTINGS ==========

/**
 * fetchProductListings - Aggregates product data from multiple sources
 * (Google, Amazon, BestBuy, etc.) and returns a standardized array of
 * ProductListingInfo objects.
 *
 * @param query - Search term (e.g. "macbook" or "iphone")
 * @returns Promise<ProductListingInfo[]>
 */
export async function fetchProductListings(
  query: string
): Promise<ProductListingInfo[]> {
  // 1) Call each source in parallel (these are placeholders):
  const [googleData, amazonData, bestBuyData] = await Promise.all([
    pullFromGoogle(query),
    pullFromAmazon(query),
    pullFromBestBuy(query),
  ]);

  // 2) Combine into one array
  const combined = [...googleData, ...amazonData, ...bestBuyData];

  // 3) Return sorted/filtered if needed, or just return combined as-is
  return combined;
}


// ========== 4) PLACEHOLDER DATA FETCHERS ==========
// In real code, these would fetch data from external APIs (GoogleShopping, Amazon, etc.)
// and shape them into ProductListingInfo format.

async function pullFromGoogle(query: string): Promise<ProductListingInfo[]> {
  // Example mock data:
  return [
    {
      name: `Google Mock - ${query}`,
      price: {
        value: 899.99,
        currency: 'USD',
        formatted: '$899.99',
      },
      seller: 'BestDealz',
      platform: 'GoogleShopping',
      link: 'https://google.com/shopping/...',
      image: 'https://via.placeholder.com/200x200?text=GoogleMock',
      rating: {
        value: 4.5,
        count: 230,
      },
      shipping: 'Free shipping',
      condition: 'New',
    },
  ];
}

async function pullFromAmazon(query: string): Promise<ProductListingInfo[]> {
  return [
    {
      name: `Amazon Mock - ${query}`,
      price: {
        value: 999.99,
        currency: 'USD',
        formatted: '$999.99',
      },
      seller: 'Amazon',
      platform: 'Amazon',
      link: 'https://amazon.com/dp/123ABC',
      image: 'https://via.placeholder.com/200x200?text=AmazonMock',
      rating: {
        value: 4.2,
        count: 512,
      },
      shipping: 'Free Prime Delivery',
      condition: 'New',
    },
  ];
}

async function pullFromBestBuy(query: string): Promise<ProductListingInfo[]> {
  return [
    {
      name: `BestBuy Mock - ${query}`,
      price: {
        value: 1099.99,
        currency: 'USD',
        formatted: '$1,099.99',
      },
      seller: 'Best Buy',
      platform: 'BestBuy',
      link: 'https://bestbuy.com/site/product/999',
      image: 'https://via.placeholder.com/200x200?text=BestBuyMock',
      rating: {
        value: 4.7,
        count: 74,
      },
      shipping: 'Standard shipping',
      condition: 'New',
    },
  ];
}
