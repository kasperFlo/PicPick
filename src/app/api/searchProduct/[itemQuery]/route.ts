import { NextRequest, NextResponse } from 'next/server';
import { fetchProductListings } from '@/lib/ProductPullerManager';
import { dbConnect } from '@/lib/DB/db';
import ProductSearchResult from '@/lib/ProductAPI/ProductModels';
/**
 * This API route handles GET requests like:
 *    GET /api/searchProduct?q=macbook
 * 
 * It first checks MongoDB for existing results.
 * New searches are currently disabled.
 */
export async function GET(request: NextRequest, { params }: { params: { itemQuery: string } }) {
  try {
    // Connect to MongoDB

    console.log('Running searchProduct API...');



    await dbConnect();

    // Get query from URL params or route params
    const { searchParams } = new URL(request.url);
    const { itemQuery } = await params;
    const query = itemQuery || searchParams.get('q') || 'laptop';

    const queryString = Array.isArray(query) ? query[0] : query;

    console.log(`Searching for: ${query}`);

    // Check if we already have results for this query in MongoDB
    const existingResults = await ProductSearchResult.findOne({ 
      query: { $regex: new RegExp(queryString, 'i') } 
    }).sort({ createdAt: -1 });

    if (existingResults) {
      console.log(`Found existing results for query: ${query}`);
      return NextResponse.json({
        success: true,
        data: existingResults.results,
        source: 'cache'
      });
    }

    // This code is disabled but kept for future use
    /*
    // This function is in ProductPullerManager.ts
    // It merges results from SerpApi (and possibly others later).
    const listings = await fetchProductListings(query);

    // Save the search query and its results to MongoDB
    await ProductSearchResult.create({ query, results: listings });

    return NextResponse.json({
      success: true,
      data: listings,
      source: 'new'
    });
    */

    // New searches are disabled for now
    console.log('New searches are currently disabled');
    return NextResponse.json({
      success: false,
      error: 'New searches are temporarily disabled. Please try an existing query.',
      source: 'error'
    }, { status: 503 });


  } catch (error) {
    console.error('Error in searchProduct route:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product listings' },
      { status: 500 }
    );
  }
}
