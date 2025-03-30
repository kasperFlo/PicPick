import { NextRequest, NextResponse } from 'next/server';
import { fetchProductListings } from '@/lib/ProductPullerManager';
import { dbConnect } from '@/lib/DB/db';
import ProductSearchResult from '@/lib/ProductAPI/ProductModels';
import { fetchProductListings } from '@/lib/ProductPullerManager';

// Helper to push amazon.com links to bottom
function prioritizeDirectLinks(products: any[]) {
  const copy = [...products];
  copy.sort((a, b) => {
    const aIsAmazon = a.link.includes('amazon.com') ? 1 : 0;
    const bIsAmazon = b.link.includes('amazon.com') ? 1 : 0;
    return aIsAmazon - bIsAmazon;
  });
  return copy;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ itemQuery?: string }> }
) {
  try {
    // 1) Connect to MongoDB
    await dbConnect();

    // 2) Parse route param + query string
    const { itemQuery } = await context.params;
    const { searchParams } = new URL(request.url);
    const queryFromURL = searchParams.get('q');
    const queryString = itemQuery || queryFromURL || 'laptop';

    // 3) Check the cache
    const existingResults = await ProductSearchResult.findOne({
      query: { $regex: new RegExp(queryString, 'i') }
    }).sort({ createdAt: -1 });

    // If cache is found, sort and return
    if (existingResults) {
      const sortedCache = prioritizeDirectLinks(existingResults.results);
      return NextResponse.json({
        success: true,
        data: sortedCache,
        source: 'cache'
      });
    }

    // 4) If no cache, call aggregator (which may hit SerpApi)
    const listings = await fetchProductListings(queryString);

    // 5) Sort the new results
    const sortedListings = prioritizeDirectLinks(listings);

    // 6) Remove old entry (if any), then save new
    await ProductSearchResult.deleteOne({ query: queryString });
    await ProductSearchResult.create({ query: queryString, results: sortedListings });

    // 7) Return fresh, sorted results
    return NextResponse.json({
      success: true,
      data: sortedListings,
      source: 'new'
    });

    /* ==== used when new searches are disabled ====
        // New searches are disabled for now
        console.log('New searches are currently disabled');
        return NextResponse.json({
          success: false,
          error: 'New searches are temporarily disabled. Please try an existing query.',
          source: 'error'
        }, { status: 503 });
    */

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product listings' },
      { status: 500 }
    );
  }
}
