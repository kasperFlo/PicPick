import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Review } from '@/lib/schema';

// This API route handles GET requests to fetch review data
// and POST requests to create a new Review

// GET /api/reviews
export async function GET() {
  console.log('Fetching all reviews...');
  
  try {
    await dbConnect();
    
    // If you want to see the associated factory/user data:
    const reviews = await Review.find()
      .populate('factoryId userId')
      .lean();

    return NextResponse.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/reviews
export async function POST(request: Request) {
  console.log('Creating a new review...');
  
  try {
    await dbConnect();

    // Parse the incoming request body
    const data = await request.json();

    // Create a new review
    const newReview = await Review.create(data);

    return NextResponse.json({
      success: true,
      data: newReview
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
