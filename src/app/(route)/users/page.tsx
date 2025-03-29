'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface WishlistItem {
  name: string;
  link: string;
  price: number;
}

interface User {
  username: string;
  email: string;
  createdAt: string;
}

interface AdminData {
  user: User;
  wishlist: WishlistItem[];
}

export default function UsersPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setData(userData);
      } catch (err) {
        setError('Failed to load user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!data) return <div className="p-8">No data available</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">{data.user.username}</h1>
        <p className="text-gray-600 mb-4">{data.user.email}</p>
        <p className="text-sm text-gray-500">
          Account created: {new Date(data.user.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Wishlist</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.wishlist.map((item, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                <p className="text-green-600 font-bold mb-4">${item.price.toFixed(2)}</p>
                <Link 
                  href={item.link}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                >
                  View Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
