'use client';

import Link from 'next/link';
import Image from 'next/image';
import Loading from '@/components/common/Loading';

export default function ProductList({
  products,
  isLoading,
  search,
  setSearch,
  category,
  setCategory,
  page,
  totalPages,
  setPage,
}) {
  const categories = ['all', 'Electronics', 'Clothing', 'Books', 'Food', 'Other'];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link
          href="/dashboard/products/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No products found</p>
          <Link
            href="/dashboard/products/create"
            className="text-indigo-600 hover:underline mt-2 inline-block"
          >
            Create your first product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// Product Card Component
function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No image
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{product.title}</h3>
        <p className="text-sm text-gray-500 truncate">{product.description}</p>
        <p className="text-lg font-bold text-indigo-600 mt-2">${product.price}</p>
        <p className="text-sm text-gray-500 mb-3">Category: {product.category}</p>
        
        <Link
          href={`/dashboard/products/${product._id}`}
          className="block w-full bg-indigo-600 text-white text-center px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}