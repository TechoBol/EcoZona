import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const numeroALetras = (num) => {
  const unidades = [
    "",
    "uno",
    "dos",
    "tres",
    "cuatro",
    "cinco",
    "seis",
    "siete",
    "ocho",
    "nueve",
    "diez",
    "once",
    "doce",
    "trece",
    "catorce",
    "quince",
    "dieciséis",
    "diecisiete",
    "dieciocho",
    "diecinueve",
  ];
  const decenas = [
    "",
    "",
    "veinte",
    "treinta",
    "cuarenta",
    "cincuenta",
    "sesenta",
    "setenta",
    "ochenta",
    "noventa",
  ];
  const centenas = [
    "",
    "cien",
    "doscientos",
    "trescientos",
    "cuatrocientos",
    "quinientos",
    "seiscientos",
    "setecientos",
    "ochocientos",
    "novecientos",
  ];

  if (num === 0) return "cero bolivianos";

  const entero = Math.floor(num);
  const decimales = Math.round((num - entero) * 100);

  const convertirGrupo = (n) => {
    if (n === 0) return "";
    if (n < 20) return unidades[n];

    if (n < 100) {
      const d = Math.floor(n / 10);
      const u = n % 10;

      if (n < 30) return u === 0 ? "veinte" : `veinti${unidades[u]}`;
      return u === 0 ? decenas[d] : `${decenas[d]} y ${unidades[u]}`;
    }

    if (n === 100) return "cien";

    const c = Math.floor(n / 100);
    const resto = n % 100;

    return resto === 0
      ? centenas[c]
      : `${centenas[c]} ${convertirGrupo(resto)}`;
  };

  const convertir = (n) => {
    if (n < 1000) return convertirGrupo(n);

    if (n < 1_000_000) {
      const miles = Math.floor(n / 1000);
      const resto = n % 1000;

      const prefijo = miles === 1 ? "mil" : `${convertirGrupo(miles)} mil`;

      return resto === 0 ? prefijo : `${prefijo} ${convertirGrupo(resto)}`;
    }

    const millones = Math.floor(n / 1_000_000);
    const resto = n % 1_000_000;

    const prefijo =
      millones === 1 ? "un millón" : `${convertirGrupo(millones)} millones`;

    return resto === 0 ? prefijo : `${prefijo} ${convertir(resto)}`;
  };

  const sufijo =
    decimales > 0
      ? ` con ${String(decimales).padStart(2, "0")}/100 bolivianos`
      : " bolivianos";

  return `${convertir(entero)}${sufijo}`;
};

export const generarPDF = (
  venta,
  cajero,
  cartItems,
  subtotal,
  discount,
  total,
  cancellationData = null,
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // ── ENCABEZADO ──
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("RECIBO DE VENTA", pageWidth / 2, 18, { align: "center" });

  doc.line(margin, 22, pageWidth - margin, 22);

  // ── DATOS ──
  doc.setFontSize(9);
  const col1 = margin;
  const col2 = pageWidth / 2 + 5;
  let y = 30;

  const campo = (label, value, x, cy, labelWidth) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, x, cy);

    doc.setFont("helvetica", "normal");
    doc.text(value, x + labelWidth, cy);
  };

  campo("Nro. Recibo", `${venta.code}`, col1, y, 30);
  campo("Fecha", new Date(venta.date).toLocaleString("es-BO"), col1, y + 6, 30);

  campo("Cliente", venta.customerName || "Consumidor final", col1, y + 12, 30);

  campo("Teléfono", venta.customerPhone || "—", col1, y + 18, 30);

  campo("CI/NIT", venta.customerDocument || "—", col1, y + 24, 30);

  campo("Cajero", cajero || "—", col2, y, 35);

  campo(
    "Forma de pago",
    venta.typeSale === "Qr" ? "QR" : "Efectivo",
    col2,
    y + 6,
    35,
  );

  campo("Transacción", venta.transactionNumber || "—", col2, y + 12, 35);

  campo("Sucursal", venta.location?.name || "—", col2, y + 18, 35);

  campo("Tipo", venta.type || "Privado", col2, y + 24, 35);

  doc.line(margin, y + 30, pageWidth - margin, y + 30);

  // ── TABLA ──
  const tableData = (cartItems || []).map((item) => [
    item.barcode,
    item.name,
    item.quantity,
    `Bs ${Number(item.finalPrice).toFixed(2)}`,
    `Bs ${(item.finalPrice * item.quantity).toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: y + 35,
    head: [["Codigo", "Producto", "Cant.", "Precio unit.", "Subtotal"]],
    body: tableData,
    styles: { fontSize: 9 },
  });

  const finalY = doc.lastAutoTable.finalY || 80;

  // ── TOTALES ──
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.text(`Subtotal: Bs ${subtotal.toFixed(2)}`, margin, finalY + 10);
  doc.text(`Descuento: Bs ${discount.toFixed(2)}`, margin, finalY + 16);

  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL: Bs ${total.toFixed(2)}`, margin, finalY + 24);

  // ── LETRAS ──
  doc.setFont("helvetica", "italic");
  doc.text(`Son: ${numeroALetras(total)}`, margin, finalY + 32);
  let extraY = finalY + 42;

  if (venta.customerAddress) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Dirección:", margin, extraY);

    doc.setFont("helvetica", "normal");
    doc.text(venta.customerAddress, margin + 20, extraY);

    extraY += 8;
  }

  if (venta.customerNote) {
    doc.setFont("helvetica", "bold");
    doc.text("Observación:", margin, extraY);

    doc.setFont("helvetica", "normal");
    doc.text(venta.customerNote, margin + 25, extraY);

    extraY += 8;
  }
  // ── SELLO DE ANULACIÓN ──
  if (cancellationData) {
    // Marca de agua diagonal
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.15 }));
    doc.setTextColor(220, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(72);
    doc.text("ANULADO", pageWidth / 2, pageHeight / 2, {
      align: "center",
      angle: 45,
    });
    doc.restoreGraphicsState();

    // Bloque de datos al pie
    doc.setTextColor(180, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);

    const fechaAnulacion = new Date(
      cancellationData.cancelledAt,
    ).toLocaleString("es-BO");

    const boxY = pageHeight - 30;

    doc.line(margin, boxY - 4, pageWidth - margin, boxY - 4);
    doc.text("VENTA ANULADA", margin, boxY);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Motivo: ${cancellationData.cancelReason || "—"}`,
      margin,
      boxY + 6,
    );
    doc.text(
      `Anulado por: ${cancellationData.cancelledBy || "—"}`,
      margin,
      boxY + 12,
    );
    doc.text(`Fecha anulación: ${fechaAnulacion}`, margin, boxY + 18);
  }
  doc.setDrawColor(220);
  doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");

  doc.text("Gracias por su compra", pageWidth / 2, pageHeight - 12, {
    align: "center",
  });
  return doc.output("blob");
};
