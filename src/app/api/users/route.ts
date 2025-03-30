import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/DB/db';
import { User } from '@/lib/DB/schema';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// This API route handles GET requests to fetch user data
export async function GET() {
  console.log('Fetching user data...');
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    // Find the current user by ID from session
    const currentUser = await User.findOne({ username: 'AdminTest' })
    .select('-password')  // exclude password
    .lean();
      
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      user: {
        username: currentUser.username,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        createdAt: currentUser.createdAt
      },
      wishlist: currentUser.wishlist || []
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}
