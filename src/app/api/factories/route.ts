import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { Factory } from '@/lib/schema';

// This API route handles GET requests to fetch Factory data
// and POST requests to create a new Factory

// GET /api/factories
export async function GET() {
  console.log('Fetching all factories...');
  
  try {
    await dbConnect();
    
    // Find all factories in the database
    const factories = await Factory.find().lean();

    return NextResponse.json({
      success: true,
      data: factories
    });
  } catch (error) {
    console.error('Error fetching factories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch factories' },
      { status: 500 }
    );
  }
}

// POST /api/factories
export async function POST(request: Request) {
  console.log('Creating a new factory...');
  
  try {
    await dbConnect();
    
    // Parse the incoming request body
    const data = await request.json();

    // Create a new factory document
    const newFactory = await Factory.create(data);

    return NextResponse.json({
      success: true,
      data: newFactory
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating factory:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create factory' },
      { status: 500 }
    );
  }
}
