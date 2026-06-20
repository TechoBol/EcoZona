import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const generarInventoryExcel = async (item, location, getStock) => {
  const safeProducts = Array.isArray(item) ? item : [];
  const wb = new ExcelJS.Workbook();
  wb.creator = "ECOZONA";
  wb.created = new Date();

  const ws = wb.addWorksheet("Inventario");

  // ── TÍTULO ──
  ws.mergeCells("A1:H1");
  const titleCell = ws.getCell("A1");
  titleCell.value = "REPORTE DE INVENTARIO";
  titleCell.font = { name: "Arial", bold: true, size: 14, color: { argb: "FFFFFFFF" } };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDC2626" } };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  ws.getRow(1).height = 28;

  // ── DATOS DE CABECERA ──
  ws.mergeCells("A2:D2");
  ws.mergeCells("E2:H2");
  const metaStyle = {
    font: { name: "Arial", size: 9 },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFF5F5F5" } },
    alignment: { vertical: "middle" },
  };

  const leftCell = ws.getCell("A2");
  leftCell.value = `Sucursal: ${location?.name || "General"}     |     Total productos: ${safeProducts.length} ítems`;
  Object.assign(leftCell, metaStyle);

  const rightCell = ws.getCell("E2");
  const totalStock = safeProducts.reduce((acc, p) => acc + getStock(p), 0);
  rightCell.value = `Fecha: ${new Date().toLocaleString("es-BO")}     |     Stock total: ${totalStock} unidades`;
  Object.assign(rightCell, metaStyle);
  rightCell.alignment = { horizontal: "right", vertical: "middle" };
  ws.getRow(2).height = 20;

  // ── ENCABEZADOS DE TABLA ──
  const headers = ["Código", "Nombre", "Línea", "Marca", "Stock", "Físico", "Diferencia", "Observaciones"];
  const headerRow = ws.addRow(headers);
  headerRow.eachCell((cell) => {
    cell.font = { name: "Arial", bold: true, size: 10, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDC2626" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top:    { style: "thin", color: { argb: "FFBDBDBD" } },
      bottom: { style: "thin", color: { argb: "FFBDBDBD" } },
      left:   { style: "thin", color: { argb: "FFBDBDBD" } },
      right:  { style: "thin", color: { argb: "FFBDBDBD" } },
    };
  });
  headerRow.height = 22;

  // ── FILAS DE DATOS ──
  safeProducts.forEach((p, i) => {
    const row = ws.addRow([
      p.barcode || "",
      p.name || "",
      p.line?.name || "",
      p.brandName || "",
      getStock(p),
      "",
      "",
      "",
    ]);

    const isEven = i % 2 === 0;
    row.eachCell((cell) => {
      cell.font = { name: "Arial", size: 9 };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: isEven ? "FFFFFFFF" : "FFFFF5F5" },
      };
      cell.border = {
        top:    { style: "hair", color: { argb: "FFBDBDBD" } },
        bottom: { style: "hair", color: { argb: "FFBDBDBD" } },
        left:   { style: "thin", color: { argb: "FFBDBDBD" } },
        right:  { style: "thin", color: { argb: "FFBDBDBD" } },
      };
      cell.alignment = { vertical: "middle" };
    });

    // Stock centrado
    row.getCell(5).alignment = { horizontal: "center", vertical: "middle" };
    row.height = 18;
  });

  // ── PIE ──
  ws.addRow([]);
  const footerRow = ws.addRow([`Generado el ${new Date().toLocaleString("es-BO")}`]);
  ws.mergeCells(`A${footerRow.number}:H${footerRow.number}`);
  footerRow.getCell(1).font = { name: "Arial", italic: true, size: 8, color: { argb: "FF9E9E9E" } };
  footerRow.getCell(1).alignment = { horizontal: "center" };

  // ── ANCHOS DE COLUMNA ──
  ws.columns = [
    { width: 16 },  // Código
    { width: 42 },  // Nombre
    { width: 18 },  // Línea
    { width: 18 },  // Marca
    { width: 10 },  // Stock
    { width: 10 },  // Físico
    { width: 14 },  // Diferencia
    { width: 30 },  // Observaciones
  ];

  // ── GUARDAR ──
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(
    blob,
    `inventario_${location?.name || "general"}_${new Date()
      .toLocaleDateString("es-BO")
      .replace(/\//g, "-")}.xlsx`
  );
};