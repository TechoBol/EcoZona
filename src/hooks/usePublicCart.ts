import { useState } from "react";
import { usePublicInventoryStore } from "../components/store/publicInventoryStore";
import { createSaleService } from "../services/cartService";
import { useAmazonS3 } from "./useAmazonS3";
import { generarPDF } from "../components/pdf/generarPDF.jsx";

export const usePublicCart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { publicToken } = usePublicInventoryStore();
  const { uploadPDF } = useAmazonS3();

  const createSale = async (
    data: any,
    cartItems: any[],
    subtotal: number,
    discount: number,
    total: number
  ) => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        ...data,
      };

      // 1. Crear venta en backend
      const venta = await createSaleService(payload,  publicToken as string,);

      // 2. Generar PDF
      const pdfBlob = generarPDF(
        venta.sale,
        venta.sale.employee.name +  venta.sale.employee.lastName,
        cartItems,
        subtotal,
        discount,
        total,
      );

      // 3. Convertir a File
      const file = new File(
        [pdfBlob],
        `venta_${venta.sale.code}.pdf`,
        { type: "application/pdf" }
      );

      // 4. Subir a S3
      const pdfKey = await uploadPDF(file, venta.sale.code);
      return venta.sale;
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
    error,
  };
};