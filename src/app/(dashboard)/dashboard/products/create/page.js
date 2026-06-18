'use client';

import ProductForm from '@/components/products/ProductForm';

export default function CreateProductPage() {
  return (
    <div>
      <ProductForm isEdit={false} />
    </div>
  );
}