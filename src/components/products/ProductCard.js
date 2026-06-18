'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No image</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{product.title}</h3>
        <p className="text-gray-600 text-sm truncate">{product.description}</p>
        <p className="text-indigo-600 font-bold mt-2">${product.price}</p>
        <p className="text-sm text-gray-500 mb-2">Category: {product.category}</p>
        
        <Link
          href={`/products/${product._id}`}
          className="block w-full bg-indigo-600 text-white text-center py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}