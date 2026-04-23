import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generarPDF = (venta, cartItems, subtotal, discount, total) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("RECIBO DE VENTA", 14, 20);

  doc.setFontSize(10);
  doc.text(`Venta ID: ${venta.code}`, 14, 30);
  doc.text(`Fecha: ${new Date().toLocaleString()}`, 14, 36);

  const tableData = (cartItems || []).map((item) => [
    item.name,
    item.quantity,
    item.price,
    item.price * item.quantity,
  ]);

  autoTable(doc, {
    startY: 45,
    head: [["Producto", "Cant", "Precio", "Subtotal"]],
    body: tableData,
  });

  const finalY = doc.lastAutoTable.finalY || 60;

  doc.text(`Subtotal: Bs ${subtotal}`, 14, finalY + 10);
  doc.text(`Descuento: Bs ${discount}`, 14, finalY + 16);
  doc.text(`Total: Bs ${total}`, 14, finalY + 22);

  // 🔥 RETORNAR BLOB
  return doc.output("blob");
};