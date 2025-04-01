import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/DB/DBmanager';
import { User} from '@/lib/DB/DBModels/User';

export async function GET() {
  console.log('Fetching admin data...');
      return NextResponse.json(
      { error: 'Not Implmented Yet but working' },
      { status: 200 }
    );
  
//   try {
    // await dbConnect(); // Connect to the database
      
    // const user = await User.findOne({ username: 'AdminTest' })
    //   .select('-password')
    //   .lean();
      
    // if (!user) {
    //   return NextResponse.json(
    //     { error: 'Admin user not found' },
    //     { status: 404 }
    //   );
    // }
    
    // return NextResponse.json({
    //   user: {
    //     username: user.username,
    //     firstName: user.firstName,
    //     lastName: user.lastName,
    //     email: user.email,
    //     createdAt: user.createdAt
    //   },
    //   wishlist: user.wishlist
    // });
//   } catch (error) {
//     console.error('Error fetching admin data:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch admin data' },
//       { status: 500 }
//     );
//   }
}
// 