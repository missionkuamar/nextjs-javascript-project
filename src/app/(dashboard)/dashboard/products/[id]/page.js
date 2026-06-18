'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearCurrentProduct } from '@/redux/slices/productSlice';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Loading from '@/components/common/Loading';

export default function ProductDetailPage() {
  const { id } = useParams();
  console.log('id:',id)
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentProduct: product, isLoading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      // Delete logic here
      router.push('/dashboard/products');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">Product not found</h2>
        <Link href="/dashboard/products" className="text-indigo-600 hover:underline mt-4 inline-block">
          ← Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/products"
        className="text-indigo-600 hover:text-indigo-800 inline-flex items-center"
      >
        ← Back to Products
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-6">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No image available
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((img, idx) => (
                  <div key={idx} className="relative h-20 bg-gray-100 rounded-lg overflow-hidden">
                    <Image src={img} alt={`${product.title} ${idx + 2}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
              <p className="text-3xl font-bold text-indigo-600 mt-2">${product.price}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                {product.category}
              </span>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-700">Description</h2>
              <p className="mt-2 text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Posted by: {product.user?.name || 'Unknown'}</span>
                <span>•</span>
                <span>{new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {user && user.id === product.user?._id && (
              <div className="flex space-x-4 pt-4 border-t border-gray-200">
                <Link
                  href={`/dashboard/products/edit/${product._id}`}
                  className="flex-1 bg-green-600 text-white text-center px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Edit Product
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Product
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}