import { NextRequest, NextResponse } from 'next/server';
import { fetchProductListings } from '@/lib/ProductPullerManager';
import { dbConnect } from '@/lib/DB/db';
import ProductSearchResult from '@/lib/ProductAPI/ProductModels';

/**
 * This API route handles GET requests like:
 *    GET /api/searchProduct?q=macbook
 * 
 * It calls fetchProductListings(query), which in turn calls
 * SerpApi Google Shopping (via pullFromGoogle) to get real product data.
 * The results are then stored in MongoDB.
 */
export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'laptop';

    // This function is in ProductPullerManager.ts
    // It merges results from SerpApi (and possibly others later).
    const listings = await fetchProductListings(query);

    // Save the search query and its results to MongoDB
    await ProductSearchResult.create({ query, results: listings });

    return NextResponse.json({
      success: true,
      data: listings,
    });
  } catch (error) {
    console.error('Error in searchProduct route:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product listings' },
      { status: 500 }
    );
  }
}
