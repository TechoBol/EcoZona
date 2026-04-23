import { useState } from "react";
import { createProductService } from "../services/productService";
import { useLoginStore } from "../components/store/loginStore";
import { useAmazonS3 } from "./useAmazonS3";
import imageCompression from "browser-image-compression";

export const useProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token, location } = useLoginStore();
  const s3 = useAmazonS3();
  const optimizeImage = async (file: File) => {
    const options = {
      maxSizeMB: 0.3, // 🔥 máximo 300KB
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  };
  
  const subirArchivo = async (file: File, barcode: string) => {
    const fileName = `${barcode}`;

    // 🔥 optimizar antes de subir
    const optimizedFile = await optimizeImage(file);

    const key = await s3.uploadProductImage(optimizedFile, fileName);
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
