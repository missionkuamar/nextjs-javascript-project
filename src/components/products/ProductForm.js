'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createProduct, updateProduct } from '@/redux/slices/productSlice';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Loading from '@/components/common/Loading';

export default function ProductForm({ product, isEdit = false }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const router = useRouter();

  const categories = ['Electronics', 'Clothing', 'Books', 'Food', 'Other'];

  useEffect(() => {
    if (product && isEdit) {
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
      });
      setExistingImages(product.images || []);
      setPreviewImages(product.images || []);
    }
  }, [product, isEdit]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (formData.price && isNaN(formData.price)) newErrors.price = 'Price must be a number';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!isEdit && images.length === 0) newErrors.images = 'At least one image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages([...existingImages, ...previews]);
    if (errors.images) {
      setErrors({ ...errors, images: '' });
    }
  };

  const removeImage = (index) => {
    if (index < existingImages.length) {
      const newExisting = existingImages.filter((_, i) => i !== index);
      setExistingImages(newExisting);
      setPreviewImages([...newExisting, ...images.map(img => URL.createObjectURL(img))]);
    } else {
      const imageIndex = index - existingImages.length;
      const newImages = images.filter((_, i) => i !== imageIndex);
      setImages(newImages);
      setPreviewImages([...existingImages, ...newImages.map(img => URL.createObjectURL(img))]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('category', formData.category);
    
    images.forEach(image => {
      formDataToSend.append('images', image);
    });

    if (isEdit) {
      formDataToSend.append('existingImages', JSON.stringify(existingImages));
      await dispatch(updateProduct({ id: product._id, productData: formDataToSend }));
    } else {
      await dispatch(createProduct(formDataToSend));
    }
    
    setLoading(false);
    router.push('/dashboard/products');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEdit ? 'Edit Product' : 'Create New Product'}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              name="title"
              required
              className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              name="description"
              required
              rows="4"
              className={`mt-1 block w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price *
              </label>
              <input
                type="number"
                name="price"
                required
                step="0.01"
                min="0"
                className={`mt-1 block w-full px-3 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                value={formData.price}
                onChange={handleChange}
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                name="category"
                required
                className={`mt-1 block w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Images {!isEdit && '*'}
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
            
            {previewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {previewImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="relative h-24 w-full bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              {isEdit ? 'Update Product' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard/products')}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}