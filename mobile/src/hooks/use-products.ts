import { useEffect } from 'react';

import {
  fetchProducts,
  selectProducts,
  selectProductsError,
  selectProductsLoading,
} from '../slices/products-slice';
import { useAppDispatch, useAppSelector } from '../stores/store';

interface UseProductsResult {
  products: ReturnType<typeof selectProducts>;
  loading: boolean;
  error: string | null;
}

const useProducts = (): UseProductsResult => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return { products, loading, error };
};

export default useProducts;
