// app/api/user/profile/route.ts
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/DB/db';
import { User } from '@/lib/DB/schema';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  console.log('Fetching user profile data...');
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      console.log('Unauthorized: No session or user');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    console.log('Connected to database');
    console.log('Fetching user with ID:', session.user.id);
    
    // Find the current user by ID from session
    const currentUser = await User.findById(session.user.id)
      .select('-password')  // exclude password
      .lean();
      
    if (!currentUser) {
      console.log('User not found');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    console.log('User found:', currentUser.email);
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
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}
