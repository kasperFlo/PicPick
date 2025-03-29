import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { User, initAdminUser } from '@/lib/schema';

// This API route handles GET requests to fetch user data
export async function GET() {
  console.log('Fetching admin data...');
  
  try {
    await dbConnect();
    // Initialize admin user if it doesn't exist
    await initAdminUser();
    
    // Find the admin user and return their data
    const adminUser = await User.findOne({ username: 'AdminTest' })
      .select('-password')
      .lean();
      
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin user not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      user: {
        username: adminUser.username,
        email: adminUser.email,
        createdAt: adminUser.createdAt
      },
      wishlist: adminUser.wishlist
    });
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin data' },
      { status: 500 }
    );
  }
}
