// File: /app/api/searchProduct/[itemQuery]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/DB/db';
import ProductSearchResult from '@/lib/ProductAPI/ProductModels';
import { fetchProductListings } from '@/lib/ProductPullerManager';




export async function GET(
  request: NextRequest, 
  context: { params: Promise<{ itemQuery?: string }> }
) {
  try {
    console.log('Running searchProduct API...');
    
    // 1) Connect to MongoDB
    await dbConnect();

    // 2) Await context.params in Next.js 13 for dynamic routes
    const { itemQuery } = await context.params;

    // 3) Also parse query string ?q=
    const { searchParams } = new URL(request.url);
    const queryFromURL = searchParams.get('q');

    // 4) Final query string: prefer route param over ?q=, fallback to "laptop"
    const queryString = itemQuery || queryFromURL || 'laptop';
    console.log(`Searching for: ${queryString}`);

    // 5) Check if we already have results in MongoDB (case-insensitive)
    const existingResults = await ProductSearchResult.findOne({
      query: { $regex: new RegExp(queryString, 'i') }
    }).sort({ createdAt: -1 });

    if (existingResults) {
      console.log(`Found existing results for query: ${queryString}`);
      return NextResponse.json({
        success: true,
        data: existingResults.results,
        source: 'cache'
      });
    }

    // 6) If no cache entry, call our aggregator from ProductPullerManager
    const listings = await fetchProductListings(queryString);

    // 7) Save new results to MongoDB
    console.log('Saving to DB');
    const oldEntry = await ProductSearchResult.findOne({ query: queryString });
    if (oldEntry) {
      console.log(`Removing old results for query: ${queryString}`);
      await ProductSearchResult.deleteOne({ query: queryString });
    }
    await ProductSearchResult.create({ query: queryString, results: listings });

    // 8) Return fresh results
    return NextResponse.json({
      success: true,
      data: listings,
      source: 'new'
    });

  } catch (error) {
    console.error('Error in searchProduct route:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product listings' },
      { status: 500 }
    );
  }
}
