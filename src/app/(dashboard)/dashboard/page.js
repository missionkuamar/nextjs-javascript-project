'use client';

import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '@/redux/slices/productSlice';

export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const { products, total } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 5 }));
  }, [dispatch]);

  const stats = [
    { name: 'Total Products', value: total || 0, icon: '📦' },
    { name: 'Categories', value: 5, icon: '🏷️' },
    { name: 'Users', value: 1, icon: '👤' },
    { name: 'Revenue', value: '$12,345', icon: '💰' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your store</p>
        </div>
        <Link
          href="/dashboard/products/create"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Add Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Products</h2>
        </div>
        <div className="p-6">
          {products.length > 0 ? (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product._id} className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{product.title}</h3>
                    <p className="text-sm text-gray-500">${product.price}</p>
                  </div>
                  <Link
                    href={`/dashboard/products/${product._id}`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    View →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No products yet. Create your first product!</p>
          )}
        </div>
      </div>
    </div>
  );
}