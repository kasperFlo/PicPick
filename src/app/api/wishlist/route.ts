// app/api/wishlist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/DB/db';
import { User } from '@/lib/DB/schema';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Get the current wishlist
export async function GET() {
  console.log('GET request to /api/wishlist received');
  
  try {
      
      const session = await getServerSession(authOptions);
      if (!session || !session.user) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        await dbConnect();
    // For testing, get the admin user's wishlist
    const user = await User.findById(session.user.id)
      .select('wishlist')
      .lean();
    
    if (!user) {
      console.log('Admin user not found');
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }
    
    console.log('Returning wishlist with', user.wishlist.length, 'items');
    return NextResponse.json({ wishlist: user.wishlist });
    
    /* Use this code for production with authenticated users
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = await User.findOne({ email: session.user.email })
      .select('wishlist')
      .lean();
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ wishlist: user.wishlist });
    */
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

// Add to wishlist
export async function POST(request: NextRequest) {
  console.log('POST request to /api/wishlist received');
  
  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    const { product } = body;
    
    if (!product || !product.name || !product.link || product.price === undefined) {
      console.log('Invalid product data:', product);
      return NextResponse.json({ error: 'Invalid product data' }, { status: 400 });
    }
    
    await dbConnect();
    console.log('Connected to database');
    
    const existingProduct = await User.findOne({
      username: 'AdminTest',
      'wishlist.link': product.link
    });
    
    if (existingProduct) {
      console.log('Product already in wishlist');
      return NextResponse.json({ 
        message: 'Product already in wishlist',
        success: true 
      });
    }
    
    // Add to wishlist - ensure price is a number to match your schema
    const priceValue = typeof product.price === 'object' ? product.price.value : product.price;
    
    // Add to wishlist
    const updatedUser = await User.findOneAndUpdate(
      { username: 'AdminTest' },
      { 
        $push: { 
          wishlist: {
            name: product.name,
            link: product.link,
            price: priceValue
          } 
        } 
      },
      { new: true }
    );
    
    /* Use this code for production with authenticated users
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      console.log('Unauthorized: No session or user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const existingProduct = await User.findOne({
      email: session.user.email,
      'wishlist.link': product.link
    });
    
    if (existingProduct) {
      console.log('Product already in wishlist');
      return NextResponse.json({ 
        message: 'Product already in wishlist',
        success: true 
      });
    }
    
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        $push: { 
          wishlist: {
            name: product.name,
            link: product.link,
            price: priceValue
          } 
        } 
      },
      { new: true }
    );
    */
    
    if (!updatedUser) {
      console.log('User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    console.log('Product added to wishlist successfully');
    return NextResponse.json({ 
      message: 'Product added to wishlist',
      success: true 
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json({ 
      error: 'Failed to add to wishlist',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Remove from wishlist
export async function DELETE(request: NextRequest) {
  console.log('DELETE request to /api/wishlist received');
  
  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    const { product } = body;
    
    if (!product || !product.link) {
      console.log('Invalid product data:', product);
      return NextResponse.json({ error: 'Invalid product data' }, { status: 400 });
    }
    
    await dbConnect();
    console.log('Connected to database');
    
    // For testing, use the admin user
    const result = await User.updateOne(
      { username: 'AdminTest' },
      { $pull: { wishlist: { link: product.link } } }
    );
    
    /* Use this code for production with authenticated users
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      console.log('Unauthorized: No session or user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const result = await User.updateOne(
      { email: session.user.email },
      { $pull: { wishlist: { link: product.link } } }
    );
    */
    
    console.log('Update result:', result);
    
    if (result.matchedCount === 0) {
      console.log('User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    if (result.modifiedCount === 0) {
      console.log('Product not found in wishlist');
      return NextResponse.json({ 
        message: 'Product not found in wishlist',
        success: true 
      });
    }
    
    console.log('Product removed from wishlist successfully');
    return NextResponse.json({ 
      message: 'Product removed from wishlist',
      success: true 
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json({ 
      error: 'Failed to remove from wishlist',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
