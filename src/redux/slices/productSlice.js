import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

// Fetch all products
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async ({ page = 1, limit = 10, search = '', category = '' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/products?page=${page}&limit=${limit}&search=${search}&category=${category}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch products' });
    }
  }
);

// Fetch single product
export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch product' });
    }
  }
);

// Create product
export const createProduct = createAsyncThunk(
  'products/create',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/products', productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create product' });
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/products/${id}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update product' });
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/products/${id}`);
      return { id };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete product' });
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    currentProduct: null,
    isLoading: false,
    error: null,
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch products';
        toast.error(state.error);
      })
      // Fetch single product
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload.product;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch product';
        toast.error(state.error);
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.unshift(action.payload.product);
        toast.success('Product created successfully!');
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to create product';
        toast.error(state.error);
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.products.findIndex(p => p._id === action.payload.product._id);
        if (index !== -1) {
          state.products[index] = action.payload.product;
        }
        state.currentProduct = action.payload.product;
        toast.success('Product updated successfully!');
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to update product';
        toast.error(state.error);
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = state.products.filter(p => p._id !== action.payload.id);
        toast.success('Product deleted successfully!');
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to delete product';
        toast.error(state.error);
      });
  },
});

export const { clearCurrentProduct, setPage, setLimit, clearError } = productSlice.actions;
export default productSlice.reducer;