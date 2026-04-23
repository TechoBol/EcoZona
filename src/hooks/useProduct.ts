import { useState } from "react";
import { createProductService } from "../services/productService";
import { useLoginStore } from "../components/store/loginStore";
import { useAmazonS3 } from "./useAmazonS3";

export const useProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token, location } = useLoginStore();
  const s3 = useAmazonS3();

  const subirArchivo = async (file: File, barcode: string) => {
    const fileName = `${barcode}`;
    const key = await s3.uploadProductImage(file, fileName);
    return key;
  };

  const createProduct = async (data: any) => {
  try {
    setError(null);

    const payload = {
      ...data,
      locationId: location.id,
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
    subirArchivo,
    loading,
    setLoading,
    error,
  };
};
