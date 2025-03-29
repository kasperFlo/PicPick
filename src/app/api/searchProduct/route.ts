// app/api/searchProduct/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { pullProductData } from '@/lib/ProductPullerManager';

// This API route handles GET requests to fetch product data from the factory
export async function GET(request: NextRequest) {
  try {
    // Extract the search query parameter: ?q=someSearchTerm
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'laptop';

    console.log(`searchProduct/route.ts - Received query: ${query}`);

    // Use our "factory" function to pull data from multiple sources
    const results = await pullProductData(query);

    // Return the combined product results in JSON
    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Error in searchProduct route:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
