import { useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { createSaleService } from "../services/cartService";

export const useCart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token, location } = useLoginStore();


  const createSale = async (data: any) => {
  try {
    setError(null);

    const payload = {
      ...data,
      locationId: location.id,
    };

    const result = await createSaleService(payload, token);
    return result;
  } catch (err) {
    setError("Error creando venta");
    throw err;
  } finally {
    setLoading(false);
  }
};

  return {
    createSale,
    loading,
    setLoading,
    error,
  };
};
