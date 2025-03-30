'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { poppins, epilogue } from '@/lib/fonts';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';

interface WishlistItem {
  name: string;
  link: string;
  price: number;
}

interface User {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

interface AdminData {
  user: User;
  wishlist: WishlistItem[];
}

export default function WishlistPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingItems, setRemovingItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchUserData();
  }, []);

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

  const removeFromWishlist = async (item: WishlistItem) => {
    setRemovingItems(prev => ({ ...prev, [item.link]: true }));
    
    try {
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: {
            name: item.name,
            link: item.link,
            price: item.price
          }
        }),
      });

      if (response.ok) {
        // Update local state to remove the item
        if (data) {
          setData({
            ...data,
            wishlist: data.wishlist.filter(wishlistItem => wishlistItem.link !== item.link)
          });
        }
      } else {
        console.error('Failed to remove item from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    } finally {
      setRemovingItems(prev => ({ ...prev, [item.link]: false }));
    }
  };

  if (loading) {
    return (
      <div className={`${poppins.variable} min-h-screen bg-[#EFF2F4] p-8 flex justify-center items-center font-poppins`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2196F3]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${poppins.variable} min-h-screen bg-[#EFF2F4] p-8 font-poppins`}>
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`${poppins.variable} min-h-screen bg-[#EFF2F4] p-8 font-poppins`}>
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <p className="text-[#5D7285] mb-2">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${poppins.variable} min-h-screen bg-[#EFF2F4] p-8 font-poppins`}>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h1 className={`${epilogue.className} text-3xl font-bold mb-2 text-[#053358]`}>
            {data.user.firstName} {data.user.lastName}'s Profile
          </h1>
          <p className="text-[#485967] mb-4">{data.user.email}</p>
          <div className="flex items-center text-sm text-[#ACB9C5]">
            <span className="mr-2">Account created:</span>
            <span>{new Date(data.user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`${epilogue.className} text-2xl font-bold text-[#053358]`}>
              My Wishlist
            </h2>
            <span className="text-[#5D7285]">{data.wishlist.length} items</span>
          </div>

          {data.wishlist.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-lg shadow">
              <p className="text-[#5D7285] mb-2">Your wishlist is empty</p>
              <p className="text-sm text-[#91A3B2]">Items you save to your wishlist will appear here</p>
              <Link 
                href="/search"
                className="mt-4 inline-block bg-[#2196F3] hover:bg-[#0966AF] text-white px-6 py-2 rounded-full transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.wishlist.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white border text-[#5D7285] border-[#E2E7EB] rounded-lg p-4 shadow hover:shadow-lg transition flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={`${epilogue.className} text-xl font-semibold line-clamp-2 h-14 overflow-hidden`}>
                      {item.name}
                    </h3>
                    <IconButton
                      onClick={() => removeFromWishlist(item)}
                      className="text-red-500 flex-shrink-0 ml-2"
                      size="small"
                      disabled={removingItems[item.link]}
                    >
                      <FavoriteIcon />
                    </IconButton>
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-between">
                    <div className="mb-3">
                      <p className="font-bold text-lg text-[#1E252B]">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex gap-2 mt-3 pt-3 border-t border-[#E2E7EB]">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#2196F3] hover:bg-[#0966AF] text-white px-4 py-2 rounded-full text-sm flex items-center gap-1 transition-colors flex-1 justify-center"
                      >
                        <VisibilityIcon fontSize="small" className="mr-1" /> View Details
                      </a>
                      <button
                        onClick={() => removeFromWishlist(item)}
                        disabled={removingItems[item.link]}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm flex items-center gap-1 transition-colors flex-1 justify-center"
                      >
                        <DeleteOutlineIcon fontSize="small" className="mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
