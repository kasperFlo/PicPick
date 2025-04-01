// File: /src/lib/ProductAPI/serpApi.ts

import { NextRequest, NextResponse } from 'next/server';
import { ProductListingInfo } from '../ProductModels';

// Helper function to determine the platform from source or link
function determinePlatform(source: string, link: string): string {
  if (!source) return 'Unknown';
  
  const sourceLower = source.toLowerCase();
  if (sourceLower.includes('amazon')) return 'Amazon';
  if (sourceLower.includes('walmart')) return 'Walmart';
  if (sourceLower.includes('bestbuy') || sourceLower.includes('best buy')) return 'Best Buy';
  if (sourceLower.includes('ebay')) return 'eBay';
  if (sourceLower.includes('newegg')) return 'Newegg';
  
  // If not found in source, check the URL
  if (link) {
    const url = new URL(link);
    const domain = url.hostname;
    
    if (domain.includes('amazon')) return 'Amazon';
    if (domain.includes('walmart')) return 'Walmart';
    if (domain.includes('bestbuy')) return 'Best Buy';
    if (domain.includes('ebay')) return 'eBay';
    if (domain.includes('newegg')) return 'Newegg';
  }
  
  // Return the source name if no specific platform is identified
  return source;
}

export async function GET(request: NextRequest) {
  console.log('Fetching data from Google Shopping (SerpApi)...');
  
  try {
    // 1) Parse query string param "q"
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'Airpods Pro Max';
    
    // 2) Build the SerpApi URL
    const serpApiKey = process.env.SERPAPI_KEY;
    if (!serpApiKey) {
      return NextResponse.json(
        { error: 'Missing SERPAPI_KEY in environment variables.' },
        { status: 500 }
      );
    }
    
    const serpApiUrl = new URL('https://serpapi.com/search.json');
    serpApiUrl.searchParams.set('engine', 'google_shopping');
    serpApiUrl.searchParams.set('q', query);
    serpApiUrl.searchParams.set('api_key', serpApiKey);
    serpApiUrl.searchParams.set('gl', 'ca');    // country
    serpApiUrl.searchParams.set('direct_link', 'true'); // <-- Request direct links

    console.log('SerpApi request:', serpApiUrl.toString());
    
    // 3) Fetch data from SerpApi
    const response = await fetch(serpApiUrl.toString(), {
      method: 'GET'
    });
    
    if (!response.ok) {
      throw new Error(`SerpApi request failed with status ${response.status}`);
    }
    
    // 4) Get JSON and transform into our model
    const data = await response.json();
    
    // Transform the shopping_results into our ProductListingInfo model
    const rawShopping = data.shopping_results || [];
    
    const products: ProductListingInfo[] = rawShopping.map((item: any) => {
      // Extract numeric price
      const priceValue = parseFloat(item.price?.replace(/[^0-9.]/g, '') || '0');
      // If SerpApi returned a "product_link" (direct link), use it; otherwise fall back to item.link
      const finalLink = item.product_link || item.link || '';
      // Determine platform from source or link
      const platform = determinePlatform(item.source, finalLink);

      return {
        name: item.title,
        price: {
          value: priceValue,
          currency: item.price?.includes('$') ? 'USD' : 'CAD',
          formatted: item.price || '$0'
        },
        seller: item.source || 'Unknown Seller',
        platform,
        link: finalLink,
        image: item.thumbnail || '',
        rating: item.rating
          ? {
              value: item.rating,
              count: item.reviews || 0
            }
          : undefined,
        shipping: item.shipping,
        condition: item.condition
      };
    });
    
    return NextResponse.json({
      success: true,
      query,
      products,
      metadata: {
        totalResults: products.length,
        searchInfo: data.search_information || {},
        searchMetadata: data.search_metadata || {}
      }
    });
    
  } catch (error) {
    console.error('Error fetching Google Shopping results:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Google Shopping data' },
      { status: 500 }
    );
  }
}
