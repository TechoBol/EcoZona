import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const numeroALetras = (num) => {
  const unidades = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve",
    "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"];
  const decenas = ["", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
  const centenas = ["", "cien", "doscientos", "trescientos", "cuatrocientos", "quinientos",
    "seiscientos", "setecientos", "ochocientos", "novecientos"];

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

  const convertir = (n ) => {
    if (n < 1000) return convertirGrupo(n);

    if (n < 1_000_000) {
      const miles = Math.floor(n / 1000);
      const resto = n % 1000;

      const prefijo = miles === 1
        ? "mil"
        : `${convertirGrupo(miles)} mil`;

      return resto === 0
        ? prefijo
        : `${prefijo} ${convertirGrupo(resto)}`;
    }

    const millones = Math.floor(n / 1_000_000);
    const resto = n % 1_000_000;

    const prefijo = millones === 1
      ? "un millón"
      : `${convertirGrupo(millones)} millones`;

    return resto === 0
      ? prefijo
      : `${prefijo} ${convertir(resto)}`;
  };

  const sufijo = decimales > 0
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
  total
) => {

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
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

  campo("Nro. Recibo", `${venta.code}`, col1, y, 28);
  campo("Fecha", new Date().toLocaleString("es-BO"), col1, y + 6, 28);
  campo("Cliente", venta.clientName || "Consumidor final", col1, y + 12, 28);

  campo("Cajero", cajero || "—", col2, y, 22);
  campo("Forma de pago", venta.typeSale === "qr" ? "QR" : "Efectivo", col2, y + 6, 38);
  campo("Cód. transacción", venta.transactionNumber || "—", col2, y + 12, 42);

  doc.line(margin, y + 17, pageWidth - margin, y + 17);

  // ── TABLA ──
  const tableData = (cartItems || []).map((item) => [
    item.name,
    item.quantity,
    `Bs ${Number(item.price).toFixed(2)}`,
    `Bs ${(item.price * item.quantity).toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: y + 21,
    head: [["Producto", "Cant.", "Precio unit.", "Subtotal"]],
    body: tableData,
    styles: { fontSize: 9 },
  });

  const finalY = (doc).lastAutoTable.finalY || 80;

  // ── TOTALES ──
  doc.text(`Subtotal: Bs ${subtotal.toFixed(2)}`, margin, finalY + 10);
  doc.text(`Descuento: Bs ${discount.toFixed(2)}`, margin, finalY + 16);

  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL: Bs ${total.toFixed(2)}`, margin, finalY + 24);

  // ── LETRAS ──
  doc.setFont("helvetica", "italic");
  doc.text(`Son: ${numeroALetras(total)}`, margin, finalY + 32);

  return doc.output("blob");
};