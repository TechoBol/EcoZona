import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generarPDFCruce = (cross) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth  = doc.internal.pageSize.getWidth();   // 210 mm
  const pageHeight = doc.internal.pageSize.getHeight();  // 297 mm
  const margin = 10;

  // ─── ENCABEZADO ───────────────────────────────────────────────
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text("AJUSTE DE INVENTARIO", pageWidth / 2, 14, { align: "center" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text("Comprobante de ajuste de inventario.", pageWidth / 2, 19, {
    align: "center",
  });
  doc.setTextColor(0);

  doc.setLineWidth(0.4);
  doc.line(margin, 22, pageWidth - margin, 22);

  // ─── DATOS GENERALES ──────────────────────────────────────────
  doc.setFontSize(8.5);
  const col1 = margin;
  const col2 = pageWidth / 2 + 4;
  let y = 29;

  const campo = (label, value, x, cy, labelWidth) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, x, cy);
    doc.setFont("helvetica", "normal");
    doc.text(String(value ?? "—"), x + labelWidth, cy);
  };

  const empleado = cross.employee
    ? `${cross.employee.name ?? ""} ${cross.employee.lastName ?? ""}`.trim()
    : "—";

  const fechaFormateada = cross.createdAt
    ? new Date(cross.createdAt).toLocaleString("es-BO")
    : "—";

  campo("Nro. Ajuste", cross.code ?? "—",          col1, y,      26);
  campo("Fecha",       fechaFormateada,             col1, y + 5,  26);
  campo("Sucursal",    cross.location?.name ?? "—", col1, y + 10, 26);

  campo("Reportado", empleado,                   col2, y,      28);
  campo("Cantidad",    String(cross.quantity ?? 0), col2, y + 5,  28);

  doc.line(margin, y + 14, pageWidth - margin, y + 14);

  // ─── CÁLCULOS ────────────────────────────────────────────────
  const originStockAfter =
    cross.originStockBefore != null
      ? cross.originStockBefore - cross.quantity
      : "—";

  const destinationStockAfter =
    cross.destinationStockBefore != null
      ? cross.destinationStockBefore + cross.quantity
      : "—";

  const fmtCost  = (val) => val != null ? `Bs ${Number(val).toFixed(2)}` : "—";
  const fmtStock = (val) => val != null ? String(val) : "—";

  // ─── TABLA ───────────────────────────────────────────────────
  // 6 columnas sin Rol
  // Anchos (mm): 30 | 70 | 25 | 22 | 22 | 21 = 190
  //              Código | Producto | Costo Unit. | Stock Antes | Movimiento | Stock Después

  const tableData = [
    [
      cross.originProduct?.barcode      ?? "—",
      cross.originProduct?.name         ?? "—",
      fmtCost(cross.originAverageCost),
      fmtStock(cross.originStockBefore),
      `- ${cross.quantity}`,
      fmtStock(originStockAfter),
    ],
    [
      cross.destinationProduct?.barcode ?? "—",
      cross.destinationProduct?.name    ?? "—",
      fmtCost(cross.destinationAverageCost),
      fmtStock(cross.destinationStockBefore),
      `+ ${cross.quantity}`,
      fmtStock(destinationStockAfter),
    ],
  ];

  autoTable(doc, {
    startY: y + 18,
    head: [["Código", "Producto", "Costo Unit.", "Stock Antes", "Movimiento", "Stock Final"]],
    body: tableData,
    tableWidth: "wrap",
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      overflow: "linebreak",
      valign: "middle",
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 25, halign: "center" }, // Código
      1: { cellWidth: 70 },                   // Producto
      2: { cellWidth: 25, halign: "center"  }, // Costo Unit.
      3: { cellWidth: 22, halign: "center" }, // Stock Antes
      4: { cellWidth: 22, halign: "center" }, // Movimiento
      5: { cellWidth: 26, halign: "center" }, // Stock Después
    },
    didParseCell: (data) => {
      if (data.section === "body") {
        data.cell.styles.fillColor =
          data.row.index === 0 ? [255, 235, 235] : [235, 255, 240];
      }
    },
  });

  const finalY = doc.lastAutoTable.finalY ?? 100;

  // ─── OBSERVACIÓN ──────────────────────────────────────────────
  let obsEndY = finalY;

  if (cross.observation) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("Observación:", margin, finalY + 8);

    doc.setFont("helvetica", "normal");
    const obsLines = doc.splitTextToSize(
      cross.observation,
      pageWidth - margin * 2,
    );
    doc.text(obsLines, margin, finalY + 13);
    obsEndY = finalY + 13 + obsLines.length * 4;
  }

  // ─── FIRMA CENTRADA ───────────────────────────────────────────
  const footerY = obsEndY + 14;
  const lineHalf = 30; // mitad del largo de la línea (60mm total)

  doc.setLineWidth(0.3);
  doc.line(pageWidth / 2 - lineHalf, footerY, pageWidth / 2 + lineHalf, footerY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("Firma responsable", pageWidth / 2, footerY + 4, { align: "center" });

  // ─── PIE DE PÁGINA ────────────────────────────────────────────
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(150);
  doc.text(
    `Generado el ${new Date().toLocaleString("es-BO")}`,
    pageWidth / 2,
    pageHeight - 6,
    { align: "center" },
  );
  doc.setTextColor(0);

  return doc.output("blob");
};