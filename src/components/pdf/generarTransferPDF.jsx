import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const theme = {
  primary: [242, 12, 31],
  secondary: [242, 114, 125],
  dark: [13, 13, 13],
  gray: [107, 114, 128],
  light: [243, 244, 246],
  success: [105, 213, 132],
  warning: [245, 158, 11],
  error: [220, 101, 95],
};

const getStatusColor = (status) => {
  switch (status) {
    case "APPROVED":
      return theme.success;
    case "REJECTED":
      return theme.error;
    default:
      return theme.warning;
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "PENDING":
      return "Pendiente";
    case "APPROVED":
      return "Aprobado";
    case "REJECTED":
      return "Rechazado";
    default:
      return status;
  }
};

export const generarTransferPDF = (transfer) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  let y = 18;

  // HEADER
  doc.setFillColor(...theme.primary);
  doc.rect(0, 0, pageWidth, 22, "F");

  doc.setFont("helvetica", "bold");
  doc.setTextColor(255);
  doc.setFontSize(14);
  doc.text("ECOZONA - TRANSFERENCIAS", pageWidth / 2, 14, {
    align: "center",
  });

  y = 34;
  doc.setTextColor(...theme.dark);

  // TITLE
  doc.setFontSize(16);
  doc.text("COMPROBANTE DE TRANSFERENCIA", pageWidth / 2, y, {
    align: "center",
  });

  y += 10;

  // STATUS
  const statusColor = getStatusColor(transfer.status);

  doc.setFillColor(...statusColor);
  doc.roundedRect(pageWidth - 60, y - 6, 45, 10, 2, 2, "F");

  doc.setTextColor(255);
  doc.setFontSize(9);
  doc.text(getStatusLabel(transfer.status), pageWidth - 37, y, {
    align: "center",
  });

  doc.setTextColor(...theme.dark);

  // INFO PRINCIPAL
  const info = [
    ["Código", transfer.transferCode || `TR-${transfer.id}`],
    ["Origen", transfer.fromLocation?.name || "—"],
    ["Destino", transfer.toLocation?.name || "—"],
    [
      "Fecha solicitud",
      transfer.createdAt
        ? new Date(transfer.createdAt).toLocaleString("es-BO")
        : "—",
    ],
    [
      "Ultima Actualizacion",
      transfer.editedAt
        ? new Date(transfer.editedAt).toLocaleString("es-BO")
        : "—",
    ],
    [
      "Solicitado por",
      `${transfer.requestedBy?.name || ""} ${
        transfer.requestedBy?.lastName || ""
      }`,
    ],
  ];

  // 🔥 FECHA DINÁMICA
  if (transfer.status === "APPROVED" && transfer.approvedAt) {
    info.push([
      "Fecha aprobación",
      new Date(transfer.approvedAt).toLocaleString("es-BO"),
    ]);
  }

  if (transfer.status === "REJECTED" && transfer.approvedAt) {
    info.push([
      "Fecha rechazo",
      new Date(transfer.approvedAt).toLocaleString("es-BO"),
    ]);
  }

  // 🔥 USUARIO DINÁMICO
  if (transfer.status === "APPROVED" && transfer.approvedBy) {
    info.push([
      "Aprobado por",
      `${transfer.approvedBy.name} ${transfer.approvedBy.lastName}`,
    ]);
  }

  if (transfer.status === "REJECTED" && transfer.approvedBy) {
    info.push([
      "Rechazado por",
      `${transfer.approvedBy.name} ${transfer.approvedBy.lastName}`,
    ]);
  }

  let infoY = y + 10;

  info.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`${label}:`, margin, infoY);

    doc.setFont("helvetica", "normal");
    doc.text(String(value || "—"), margin + 50, infoY);

    infoY += 6;
  });

  // TABLE
  autoTable(doc, {
    startY: infoY + 8,
    head: [["Código", "Producto", "Cantidad"]],
    body: (transfer.items || []).map((i) => [
      i.product?.barcode || "—",
      i.product?.name || "—",
      i.quantity,
    ]),
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: theme.primary,
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: theme.light,
    },
  });

  const finalY = doc.lastAutoTable.finalY || infoY + 10;

  // 🔥 GLOSA (DEBAJO DE TABLA)
  let glosaY = finalY + 10;

  if (transfer.glosa) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Glosa:", margin, glosaY);

    doc.setFont("helvetica", "normal");

    const splitGlosa = doc.splitTextToSize(
      transfer.glosa,
      pageWidth - margin * 2,
    );

    doc.text(splitGlosa, margin, glosaY + 5);

    glosaY += splitGlosa.length * 5 + 10;
  }
  // 🔥 MOTIVO DE RECHAZO (SOLO SI ES REJECTED)
  if (transfer.status === "REJECTED" && transfer.rejectionReason) {
    let motivoY = glosaY;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...theme.error);
    doc.text("Motivo de rechazo:", margin, motivoY);

    doc.setFont("helvetica", "normal");

    const splitMotivo = doc.splitTextToSize(
      transfer.rejectionReason,
      pageWidth - margin * 2,
    );

    doc.text(splitMotivo, margin, motivoY + 5);

    // ajustar cursor
    glosaY += splitMotivo.length * 5 + 10;
  }
  // FIRMA SECTION
  const firmaY = glosaY + 15;
  const colWidth = (pageWidth - margin * 2) / 3;

  const firma = (text, x) => {
    doc.setDrawColor(...theme.gray);
    doc.line(x, firmaY, x + 55, firmaY);

    doc.setFontSize(9);
    doc.text(text, x + 27, firmaY + 6, { align: "center" });
  };

  firma("Supervisor", margin);

  firma(
    "Encargado Almacen Origen",
    margin + colWidth,
  );

  firma("Encargado Almacén Destino", margin + colWidth * 2);

  return doc.output("blob");
};
