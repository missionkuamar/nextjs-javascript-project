'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setPage } from '@/redux/slices/productSlice';
import ProductList from '@/components/products/ProductList';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { products, isLoading, total, page, limit } = useSelector((state) => state.products);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    dispatch(fetchProducts({ page, limit, search: debouncedSearch, category }));
  }, [dispatch, page, limit, debouncedSearch, category]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <ProductList
        products={products}
        isLoading={isLoading}
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        page={page}
        totalPages={totalPages}
        setPage={(newPage) => dispatch(setPage(newPage))}
      />
    </div>
  );
}