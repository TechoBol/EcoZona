import { useLoginStore } from "../components/store/loginStore";
import { useAmazonS3 } from "./useAmazonS3";
import { generarPDF } from "../components/pdf/generarPDF.jsx";

export function useRegeneratePdf() {
  const { fullName } = useLoginStore();
  const { uploadPDF } = useAmazonS3();

  const regeneratePdf = async (sale: any) => {

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

    // Datos de anulación
    const cancellationData = sale.status === "CANCELLED"
      ? {
        cancelReason: sale.cancelReason,
        cancelledAt: sale.cancelledAt,
        cancelledBy: sale.cancelledBy?.name    
          ?? fullName,                        
      }
      : null;

    const pdfBlob = generarPDF(
      sale,
      fullName,
      cartItems,
      subtotal,
      discount,
      sale.total,
      cancellationData,
    );

    const file = new File(
      [pdfBlob],
      `venta_${sale.code}.pdf`,
      { type: "application/pdf" }
    );

    await uploadPDF(file, sale.code);
  };

  return { regeneratePdf };
}