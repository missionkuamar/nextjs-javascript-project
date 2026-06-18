'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearCurrentProduct } from '@/redux/slices/productSlice';
import { useParams } from 'next/navigation';
import ProductForm from '@/components/products/ProductForm';
import Loading from '@/components/common/Loading';

export default function EditProductPage() {
  const { id } = useParams();
  console.log("id", id)
  const dispatch = useDispatch();
  const { currentProduct: product, isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);

  if (isLoading) {
    return <Loading />;
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">Product not found</h2>
      </div>
    );
  }

  return <ProductForm product={product} isEdit={true} />;
}