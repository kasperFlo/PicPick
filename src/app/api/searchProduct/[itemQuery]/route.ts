import { NextRequest, NextResponse } from 'next/server';
import { fetchProductListings } from '@/lib/ProductPullerManager';
import { dbConnect } from '@/lib/DB/db';
import ProductSearchResult from '@/lib/ProductAPI/ProductModels';
import { fetchProductListings } from '@/lib/ProductPullerManager';

// Sort helper: push any product.link that contains "amazon.com" to the bottom.
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
    await dbConnect();

    const { itemQuery } = await context.params;
    const { searchParams } = new URL(request.url);
    const queryFromURL = searchParams.get('q');
    const queryString = itemQuery || queryFromURL || 'laptop';

    // Check cache
    const existingResults = await ProductSearchResult.findOne({
      query: { $regex: new RegExp(queryString, 'i') },
    }).sort({ createdAt: -1 });

    if (existingResults) {
      const sortedCache = prioritizeDirectLinks(existingResults.results);
      return NextResponse.json({
        success: true,
        data: sortedCache,
        source: 'cache',
      });
    }

    // If no cache, fetch new results
    const listings = await fetchProductListings(queryString);

    // Sort so Amazon fallback links go last
    const sortedListings = prioritizeDirectLinks(listings);

    // Remove old entry if it exists
    await ProductSearchResult.deleteOne({ query: queryString });

    // Create new entry
    await ProductSearchResult.create({ query: queryString, results: sortedListings });

    return NextResponse.json({
      success: true,
      data: sortedListings,
      source: 'new',
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