import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Product } from '@/models/product';
import { RootState } from '@/reducers/root-reducer';
import { productSyncService } from '@/services/product-sync-service';

interface ProductsState {
  data: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'products/fetchProducts',
  async (_, thunkApi) => {
    const cachedProducts = await productSyncService
      .getProducts()
      .catch(() => [] as Product[]);

    if (cachedProducts.length > 0) {
      thunkApi.dispatch(productsSlice.actions.setProducts(cachedProducts));
    }

    try {
      return await productSyncService.syncProducts();
    } catch (error) {
      if (cachedProducts.length > 0) {
        return cachedProducts;
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch products.';
      return thunkApi.rejectWithValue(errorMessage);
    }
  },
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.data = action.payload;
      state.error = null;
    },
    clearProducts: state => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Failed to fetch products.';
      });
  },
});

export const selectProducts = (state: RootState) => state.products.data;
export const selectProductsLoading = (state: RootState) => state.products.loading;
export const selectProductsError = (state: RootState) => state.products.error;
export const { clearProducts } = productsSlice.actions;

export default productsSlice.reducer;
