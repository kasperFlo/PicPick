import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/DB/DBmanager';
import { User } from '@/lib/DB/DBModels/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// This API route handles GET requests to fetch user data
export async function GET() {
  await dbConnect(); // Ensure the database is connected
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    
    // Find the current user by ID from session
    console.log('Fetching user data...');
    const currentUser = await User.findOne({ username: 'AdminTest' }) // currently hard coded but will be replaced with session.user.id
    .select('-password')  
    .lean();
      
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // get Responce with user data
    return NextResponse.json({ 
      Code: 200,
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
