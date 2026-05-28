import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { theme } from "../ui/Theme";

export const exportImportationPDF = (importation) => {
  const total =
    importation.items?.reduce(
      (sum, item) => sum + item.quantity * item.unitCost,
      0
    ) ?? 0;

  const doc = new jsPDF();

  // =========================================================
  // COLORS
  // =========================================================
  const primary = theme.colors.primary;
  const secondary = theme.colors.secondary;
  const background = theme.colors.background;
  const surface = theme.colors.surface;
  const text = theme.colors.text;
  const textSecondary = theme.colors.textSecondary;
  const border = theme.colors.border;

  // =========================================================
  // HELPERS
  // =========================================================
  const hexToRgb = (hex) => {
    const sanitized = hex.replace("#", "");

    const bigint = parseInt(sanitized, 16);

    return [
      (bigint >> 16) & 255,
      (bigint >> 8) & 255,
      bigint & 255,
    ];
  };

  // =========================================================
  // BACKGROUND
  // =========================================================
  doc.setFillColor(...hexToRgb(background));
  doc.rect(0, 0, 210, 297, "F");

  // =========================================================
  // HEADER
  // =========================================================
  doc.setFillColor(...hexToRgb(primary));
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(255, 255, 255);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("DETALLE DE IMPORTACIÓN", 14, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Código: ${importation.code}`, 14, 30);

  // =========================================================
  // INFO CARD
  // =========================================================
  const cardY = 52;

  doc.setFillColor(...hexToRgb(surface));
  doc.roundedRect(14, cardY, 182, 44, 4, 4, "F");

  // Section title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...hexToRgb(text));

  doc.text("Información General", 20, cardY + 10);

  // Labels
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...hexToRgb(text));

  doc.text("Empleado:", 20, cardY + 22);
  doc.text("Ubicación:", 20, cardY + 34);

  doc.text("Fecha:", 110, cardY + 34);

  // Values
  doc.setFont("helvetica", "normal");

  const employee = importation.employee
    ? `${importation.employee.name} ${importation.employee.lastName}`
    : "-";

  doc.text(employee, 48, cardY + 22);

  doc.text(
    importation.location?.name ?? "-",
    48,
    cardY + 34
  );

  doc.text(
    new Date(importation.createdAt).toLocaleDateString("es-BO"),
    132,
    cardY + 34
  );

  // =========================================================
  // TABLE
  // =========================================================
  autoTable(doc, {
    startY: 108,

    head: [
      [
        "Código",
        "Producto",
        "Cantidad",
        "Costo Unit.",
        "Subtotal",
      ],
    ],

    body: importation.items.map((item) => [
      item.product.barcode,
      item.product.name,
      `${item.quantity} unid.`,
      `Bs. ${Number(item.unitCost).toFixed(2)}`,
      `Bs. ${(item.quantity * item.unitCost).toFixed(2)}`,
    ]),

    theme: "grid",

    margin: {
      left: 14,
      right: 14,
    },

    headStyles: {
      fillColor: hexToRgb(surface),
      textColor: hexToRgb(text),
      lineWidth: 0.2,
      lineColor: hexToRgb(border),
      fontStyle: "bold",
      fontSize: 11,
      halign: "center",
      valign: "middle",
    },

    bodyStyles: {
      textColor: hexToRgb(text),
      fontSize: 10,
      cellPadding: 4,
      valign: "middle",
    },

    alternateRowStyles: {
      fillColor: hexToRgb(surface),
    },

    styles: {
      lineColor: hexToRgb(border),
      lineWidth: 0.3,
    },

    columnStyles: {
      0: {
        cellWidth: 28,
      },

      1: {
        cellWidth: 72,
      },

      2: {
        cellWidth: 28,
        halign: "center",
      },

      3: {
        cellWidth: 30,
        halign: "right",
      },

      4: {
        cellWidth: 32,
        halign: "right",
      },
    },
  });

  // =========================================================
  // TOTAL SECTION
  // =========================================================
  const finalY = doc.lastAutoTable.finalY + 18;

  // Background box
  doc.setFillColor(...hexToRgb(primary));
  doc.roundedRect(140, finalY, 56, 16, 3, 3, "F");

  // Label
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);

  doc.text("TOTAL", 146, finalY + 6);
  doc.text(`Bs. ${total.toFixed(2)}`, 146, finalY + 12);

  // =========================================================
  // FOOTER
  // =========================================================
  doc.setDrawColor(...hexToRgb(border));
  doc.line(14, 278, 196, 278);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  doc.setTextColor(...hexToRgb(textSecondary));

  doc.text(
    "EcoZona",
    14,
    285
  );


  // =========================================================
  // SAVE
  // =========================================================
  doc.save(`importacion-${importation.code}.pdf`);
};