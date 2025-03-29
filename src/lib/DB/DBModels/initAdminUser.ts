import User from './User';
import { dbConnect } from '@/lib/DB/db'; // adjust path if needed

export async function initAdminUser() {
  await dbConnect();

  // Look for the user
  const adminExists = await User.findOne({ username: 'AdminTest' });
  if (adminExists) {
    console.log('Admin user exists:', adminExists);
    return;
  }

  // Otherwise create a new admin
  console.log('Admin user not found, creating one...');
  await User.create({
    username: 'AdminTest',
    email: 'admin@example.com',
    password: 'password123', // ideally hashed in production
    firstName: 'Admin',
    lastName: 'User',
    wishlist: [
      {
        name: 'Sony WH-1000XM4 Wireless Headphones',
        link: 'https://www.amazon.com/Sony-WH-1000XM4-Canceling-Headphones-phone-call/dp/B0863TXGM3',
        price: 348.0,
      },
      // more wishlist items later
    ],
  });

  console.log('Admin user created successfully');
}
