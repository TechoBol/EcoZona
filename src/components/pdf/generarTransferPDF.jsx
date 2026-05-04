import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generarTransferPDF = (transfer) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  // ─────────────────────────
  // ENCABEZADO
  // ─────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);

  // Título
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Comprobante de Transferencia", pageWidth / 2, 20, {
    align: "center",
  });

  // Fecha y página
  const fechaActual = new Date().toLocaleString("es-BO");

  doc.setFontSize(9);
  doc.text(fechaActual, pageWidth - margin, 15, { align: "right" });

  // ─────────────────────────
  // DATOS PRINCIPALES
  // ─────────────────────────
  let y = 30;

  doc.setFont("helvetica", "bold");
  doc.text("Sucursal - Almacen de Origen:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(transfer.fromLocation?.name || "—", margin + 80, y);

  y += 7;

  doc.setFont("helvetica", "bold");
  doc.text("Sucursal - Almacen de Destino:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(transfer.toLocation?.name || "—", margin + 85, y);

  // Número y fecha
  doc.setFont("helvetica", "bold");
  doc.text("Numero:", pageWidth - 70, 30);
  doc.setFont("helvetica", "normal");
  doc.text(transfer.transferCode || "—", pageWidth - 40, 30);

  doc.setFont("helvetica", "bold");
  doc.text("Fecha:", pageWidth - 70, 37);
  doc.setFont("helvetica", "normal");
  doc.text(
    new Date(transfer.createdAt).toLocaleDateString("es-BO"),
    pageWidth - 40,
    37,
  );

  // marca
  doc.line(margin, 42, pageWidth - margin, 42);

  // ─────────────────────────
  // TABLA DE ITEMS
  // ─────────────────────────
  const tableData = (transfer.items || []).map((item) => [
    item.product.barcode || "—",
    item.product.name,
    item.quantity,
  ]);

  autoTable(doc, {
    startY: 45,
    head: [["Codigo", "Producto", "Cantidad"]],
    body: tableData,
    styles: { fontSize: 9 },
  });

  const finalY = doc.lastAutoTable.finalY || 80;

  // ─────────────────────────
  // GLOSA
  // ─────────────────────────
  doc.setFont("helvetica", "bold");
  doc.text("Glosa:", margin, finalY + 10);

  doc.setFont("helvetica", "normal");
  doc.text(`TRANSFERENCIA ${transfer.transferCode}`, margin + 20, finalY + 10);

  // ─────────────────────────
  // FIRMAS
  // ─────────────────────────
  const firmaY = finalY + 40;

  const colSpacing = (pageWidth - margin * 2) / 3;

  const drawFirma = (text, x) => {
    doc.line(x, firmaY, x + 60, firmaY);
    doc.text(text, x + 30, firmaY + 5, { align: "center" });
  };

  drawFirma("Supervisor", margin);
  drawFirma("Encargado Almacen de Origen", margin + colSpacing);
  drawFirma("Encargado Almacen de Destino", margin + colSpacing * 2);

  return doc.output("blob");
};
