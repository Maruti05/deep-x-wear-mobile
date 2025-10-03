import { getProducts } from "@/api/products";
import { ProductType } from "@/app/types/ProductType";
import { useCallback, useEffect, useState } from "react";

interface UseProductsOptions {
  categoryId?: string;
  featured?: boolean;
  search?: string;
  limit?: number;
}

export function useProducts(options?: UseProductsOptions) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setError] = useState<boolean>(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getProducts(options);
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    isError,
    refresh: fetchProducts,
  };
}
