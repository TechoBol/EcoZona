import { useState } from "react";
import { createProductService } from "../services/productService";
import { useLoginStore } from "../components/store/loginStore";

export const useProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token, location } = useLoginStore();

  const createProduct = async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        ...data,
        locationId: location.id
      };

      const result = await createProductService(payload, token);
      return result;

    } catch (err) {
      setError("Error creando producto");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createProduct,
    loading,
    error
  };
};