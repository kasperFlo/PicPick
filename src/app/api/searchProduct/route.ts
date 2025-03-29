import { NextRequest, NextResponse } from 'next/server';
import { fetchProductListings } from '@/lib/ProductPullerManager';

export async function GET(request: NextRequest) {
  try {
    // 1) Grab ?q=someProduct from request
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'laptop';

    // 2) Call the aggregator to get standardized product listings
    const listings = await fetchProductListings(query);

    // 3) Return JSON
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
