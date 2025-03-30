import mongoose, { Document, Model } from 'mongoose';


// ========== 1) Mongoose Model ==========
 
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

// We'll export it in case you still use it:
export default Factory;

/**
 * ========== 2) ProductListingInfo Interface ==========
 * This defines how each product should look once we've fetched
 * and transformed it from SerpApi (or other sources).
 */
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

/**
 * ========== 3) Main Aggregator Function ==========
 * fetchProductListings - Aggregates product data from multiple sources.
 * Right now, we only integrate SerpApi (Google Shopping).
 * 
 * @param query - The search term (e.g., "macbook").
 * @returns Promise<ProductListingInfo[]>
 */
export async function fetchProductListings(
  query: string
): Promise<ProductListingInfo[]> {
  // We only call SerpApi / Google for now, but you could
  // add Amazon or BestBuy calls similarly in the future.
  const [googleData] = await Promise.all([
    pullFromGoogle(query),
  ]);

  // Combine all results (right now it's just googleData).
  return [...googleData];
}

/**
 * ========== 4) SerpApi (Google Shopping) Integration ==========
 * This function makes a real HTTP request to SerpApi's Google Shopping engine,
 * retrieves multiple result arrays (shopping_results, inline_shopping_results,
 * featured_shopping_results), then merges them into a single array of ProductListingInfo.
 */
async function pullFromGoogle(query: string): Promise<ProductListingInfo[]> {
  try {
    const serpApiKey = process.env.SERPAPI_KEY;
    if (!serpApiKey) {
      console.error('SERPAPI_KEY not found in environment variables');
      return [];
    }

    // Build SerpApi URL (enabling direct_link for new layout)
    const url = new URL('https://serpapi.com/search.json');
    url.searchParams.set('engine', 'google_shopping');
    url.searchParams.set('q', query);
    url.searchParams.set('api_key', serpApiKey);
    url.searchParams.set('direct_link', 'true'); // request direct links

    console.log(`pullFromGoogle() -> ${url.toString()}`);

    // Fetch from SerpApi
    const response = await fetch(url.toString(), { method: 'GET' });
    if (!response.ok) {
      console.error('SerpApi request failed:', response.status);
      return [];
    }

    const data = await response.json();

    // Combine all relevant arrays to get more results
    const rawShopping = data.shopping_results || [];
    const rawInline = data.inline_shopping_results || [];
    const rawFeatured = data.featured_shopping_results || [];
    const combined = [...rawShopping, ...rawInline, ...rawFeatured];

    // Filter to only items that have a product_link property
    const filtered = combined.filter((item: any) => item.product_link);

    // Map filtered items to your ProductListingInfo shape
    const results: ProductListingInfo[] = filtered.map((item: any) => {
      const name = item.title || 'No Title';
      const priceNumber = item.extracted_price || 0;
      const currency = 'USD';
      const formattedPrice = item.price || `$${priceNumber}`;
      const seller = item.source || 'Unknown seller';
      // We intentionally do NOT fall back to item.link or anything else,
      // since you only want items that definitely have a product_link.
      // We'll set link = item.product_link directly.
      const linkCandidate = item.product_link;
      const image = item.thumbnail || '';
      const ratingValue = item.rating || 0;
      const ratingCount = item.reviews || 0;
      const shipping = item.delivery || 'N/A';
      const condition = item.second_hand_condition || 'New';

      return {
        name,
        price: {
          value: priceNumber,
          currency,
          formatted: formattedPrice,
        },
        seller,
        platform: 'GoogleShopping',
        link: linkCandidate, // Use product_link as the final link
        image,
        rating:
          ratingValue > 0
            ? { value: ratingValue, count: ratingCount }
            : undefined,
        shipping,
        condition,
      };
    });

    return results;
  } catch (error) {
    console.error('Error in pullFromGoogle:', error);
    return [];
  }
}
