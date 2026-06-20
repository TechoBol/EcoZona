import { useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { getProductDetailService } from "../services/productDetailService";

interface ProductDetail {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  finalPrice: number;
  brandName: string | null;
  line: { name: string } | null;
  stock: number;
}

export const useProductDetail = () => {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token } = useLoginStore();

  const fetchProductDetail = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getProductDetailService(id, token);
      setProduct(data);
      return data;
    } catch (err) {
      setError("No se pudo cargar el producto");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    product,
    loading,
    error,
    fetchProductDetail,
  };
};