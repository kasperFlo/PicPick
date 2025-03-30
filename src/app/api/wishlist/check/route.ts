// app/api/wishlist/check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/DB/db';
import { User } from '@/lib/DB/schema';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  console.log('GET request to /api/wishlist/check received');
  
  try {
    // For testing purposes, use the admin user
    // In production, you should use the authenticated user
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const productLink = searchParams.get('link');
    
    if (!productLink) {
      console.log('Missing product link');
      return NextResponse.json({ error: 'Product link is required' }, { status: 400 });
    }
    
    console.log('Checking wishlist for product link:', productLink);
    
    // Find admin user (for testing)
    const user = await User.findOne({ 
      username: 'AdminTest',
      'wishlist.link': productLink
    });
    
    const inWishlist = !!user;
    console.log('Product in wishlist:', inWishlist);
    
    return NextResponse.json({ inWishlist });
    
    /* Use this code for production with authenticated users
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ inWishlist: false }, { status: 401 });
    }
    
    const user = await User.findOne({ 
      email: session.user.email,
      'wishlist.link': productLink
    });
    
    return NextResponse.json({ inWishlist: !!user });
    */
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return NextResponse.json({ 
      error: 'Failed to check wishlist',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
