import { useLoginStore } from "../components/store/loginStore.js";
import { useAmazonS3 } from "./useAmazonS3.js";
import { generarPDF } from "../components/pdf/generarPDF.jsx";

export function useRegeneratePdf() {
  const { fullName } = useLoginStore();
  const { uploadPDF } = useAmazonS3();

  const regeneratePdf = async (sale: any) => {
    // 1. Mapear details al formato que espera generarPDF
    const cartItems = sale.details.map((detail: any) => ({
      barcode: detail.product.barcode,
      name: detail.product.name,
      quantity: detail.quantity,
      finalPrice: detail.price,
    }));

    const subtotal = sale.details.reduce(
      (sum: number, d: any) => sum + d.price * d.quantity,
      0
    );
    const discount = subtotal - sale.total;

    // 2. Generar PDF
    const pdfBlob = generarPDF(
      sale,
      fullName,
      cartItems,
      subtotal,
      discount,
      sale.total,
    );

    // 3. Convertir a File
    const file = new File(
      [pdfBlob],
      `venta_${sale.code}.pdf`,
      { type: "application/pdf" }
    );

    // 4. Subir a S3 (sobrescribe el anterior con el mismo key)
    await uploadPDF(file, sale.code);
  };

  return { regeneratePdf };
}