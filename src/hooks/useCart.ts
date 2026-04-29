import { useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { createSaleService } from "../services/cartService";
import { useAmazonS3 } from "./useAmazonS3";
import { generarPDF } from "../components/pdf/generarPDF";

export const useCart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, location } = useLoginStore();
  const { uploadPDF } = useAmazonS3();
  const {fullName} = useLoginStore()
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
        locationId: location.id,
      };

      // 1. Crear venta en backend
      const venta = await createSaleService(payload, token);

      // 2. Generar PDF
      console.log(venta.code)
      const pdfBlob = generarPDF(
        venta.sale,
        fullName,
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

      console.log("PDF subido:", pdfKey);
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