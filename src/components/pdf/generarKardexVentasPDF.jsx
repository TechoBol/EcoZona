import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generarVentasPDF = (rows = []) => {
  const doc = new jsPDF({
    orientation: "landscape",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  ////////////////////////////////////////////////////
  // RESUMEN GENERAL
  ////////////////////////////////////////////////////

  const totalCantidad = rows.reduce(
    (acc, item) => acc + Number(item.quantity || 0),
    0,
  );

  const totalSubtotal = rows.reduce(
    (acc, item) => acc + Number(item.subtotal || 0),
    0,
  );

  const totalDescuento = rows.reduce(
    (acc, item) => acc + Number(item.discount || 0),
    0,
  );

  const totalNeto = rows.reduce(
    (acc, item) => acc + Number(item.total || 0),
    0,
  );

  ////////////////////////////////////////////////////
  // SUCURSALES DINAMICAS
  ////////////////////////////////////////////////////

  const branches = [
    ...new Set(
      rows.flatMap((item) =>
        (item.branches || []).map((branch) => branch.name.toUpperCase()),
      ),
    ),
  ].sort();

  ////////////////////////////////////////////////////
  // AGRUPAR
  ////////////////////////////////////////////////////

  const grouped = {};

  rows.forEach((item) => {
    const line = item.line || "SIN LINEA";
    const brand = item.brand || "SIN MARCA";
    const barcode = item.barcode || "SIN CODIGO";
    const product = item.product || item.name || "SIN PRODUCTO";

    if (!grouped[line]) {
      grouped[line] = {};
    }

    if (!grouped[line][brand]) {
      grouped[line][brand] = {};
    }

    if (!grouped[line][brand][product]) {
      grouped[line][brand][product] = {
        barcode,
        quantity: 0,
        total: 0,
        branches: {},
      };
    }

    grouped[line][brand][product].quantity += Number(item.quantity || 0);

    grouped[line][brand][product].total += Number(item.total || 0);

    (item.branches || []).forEach((branch) => {
      grouped[line][brand][product].branches[branch.name] =
        (grouped[line][brand][product].branches[branch.name] || 0) +
        Number(branch.quantity || 0);
    });
  });

  ////////////////////////////////////////////////////
  // ENCABEZADO
  ////////////////////////////////////////////////////

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");

  doc.text("REPORTE MATRIZ DE VENTAS - ECOZONA", pageWidth / 2, 16, {
    align: "center",
  });

  doc.setFontSize(9);

  doc.text(`Generado: ${new Date().toLocaleString("es-BO")}`, margin, 25);

  ////////////////////////////////////////////////////
  // RESUMEN
  ////////////////////////////////////////////////////

  autoTable(doc, {
    startY: 32,
    head: [["RESUMEN GENERAL", "IMPORTANTE"]],
    body: [
      ["CANTIDAD VENDIDA", totalCantidad],
      ["SUBTOTAL", `Bs ${totalSubtotal.toFixed(2)}`],
      ["DESCUENTOS", `Bs ${totalDescuento.toFixed(2)}`],
      ["TOTAL", `Bs ${totalNeto.toFixed(2)}`],
    ],
    headStyles: {
      fillColor: [220, 38, 38],
    },
    styles: {
      fontSize: 7,
      cellPadding: 2,
    },
  });

  ////////////////////////////////////////////////////
  // TABLA PRINCIPAL
  ////////////////////////////////////////////////////

  const body = [];

  let grandBranches = {};
  let grandQuantity = 0;
  let grandTotal = 0;

  Object.entries(grouped).forEach(([line, brands]) => {
    let lineBranches = {};
    let lineQuantity = 0;
    let lineTotal = 0;

    let firstLineRow = true;

    Object.entries(brands).forEach(([brand, products]) => {
      let brandBranches = {};
      let brandQuantity = 0;
      let brandTotal = 0;

      let firstBrandRow = true;

      Object.entries(products).forEach(([product, data]) => {
        body.push([
          firstLineRow ? line : "",
          firstBrandRow ? brand : "",
          data.barcode,
          product,

          ...branches.map((branch) => data.branches[branch] || 0),

          data.quantity,
          `Bs ${data.total.toFixed(2)}`,
        ]);

        branches.forEach((branch) => {
          const qty = data.branches[branch] || 0;

          brandBranches[branch] = (brandBranches[branch] || 0) + qty;

          lineBranches[branch] = (lineBranches[branch] || 0) + qty;

          grandBranches[branch] = (grandBranches[branch] || 0) + qty;
        });

        brandQuantity += data.quantity;
        brandTotal += data.total;

        lineQuantity += data.quantity;
        lineTotal += data.total;

        grandQuantity += data.quantity;
        grandTotal += data.total;

        firstLineRow = false;
        firstBrandRow = false;
      });

      ////////////////////////////////////////////////////
      // SUBTOTAL MARCA
      ////////////////////////////////////////////////////

      body.push([
        "",

        {
          content: `SUBTOTAL ${brand}`,
          colSpan: 3,
          styles: {
            halign: "left",
            fontStyle: "bold",
          },
        },

        ...branches.map((branch) => brandBranches[branch] || 0),

        brandQuantity,
        `Bs ${brandTotal.toFixed(2)}`,
      ]);
    });

    ////////////////////////////////////////////////////
    // TOTAL LINEA
    ////////////////////////////////////////////////////

    body.push([
      {
        content: `TOTAL ${line}`,
        colSpan: 4,
        styles: {
          halign: "left",
          fontStyle: "bold",
        },
      },

      ...branches.map((branch) => lineBranches[branch] || 0),

      lineQuantity,

      `Bs ${lineTotal.toFixed(2)}`,
    ]);
  });

  ////////////////////////////////////////////////////
  // TOTAL GENERAL
  ////////////////////////////////////////////////////

  body.push([
    {
      content: "TOTAL GENERAL",
      colSpan: 4,
      styles: {
        halign: "left",
        fontStyle: "bold",
      },
    },

    ...branches.map((branch) => grandBranches[branch] || 0),

    grandQuantity,

    `Bs ${grandTotal.toFixed(2)}`,
  ]);

  ////////////////////////////////////////////////////
  // CABECERA DINAMICA
  ////////////////////////////////////////////////////
  const columnStyles = {
    0: { cellWidth: 35 }, // Marca
    1: { cellWidth: 35 }, // Línea
    2: { cellWidth: 20 }, // Barcode
    3: { cellWidth: 55 }, // Producto
  };

  const branchWidth = branches.length <= 3 ? 30 : branches.length <= 6 ? 12 : 8;

  branches.forEach((_, index) => {
    columnStyles[index + 4] = {
      cellWidth: branchWidth,
    };
  });

  columnStyles[branches.length + 4] = {
    cellWidth: 20, // Total Cant.
  };

  columnStyles[branches.length + 5] = {
    cellWidth: 20, // Total Bs
  };
  const head = [
    "MARCA",
    "LÍNEA",
    "CODIGO",
    "PRODUCTO",
    ...branches,
    "TOTAL CANT.",
    "TOTAL BS.",
  ];

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,

    head: [head],

    body,

    styles: {
      fontSize: 7,
      cellPadding: 2,
    },

    headStyles: {
      fillColor: [220, 38, 38],
      textColor: 255,
      fontStyle: "bold",
    },

    didParseCell(data) {
      const rowText = JSON.stringify(data.row.raw);

      if (rowText.includes("SUBTOTAL")) {
        data.cell.styles.fillColor = [254, 240, 138];
        data.cell.styles.fontStyle = "bold";
      } else if (rowText.includes('"content":"TOTAL ')) {
        data.cell.styles.fillColor = [34, 197, 94];
        data.cell.styles.textColor = [255, 255, 255];
        data.cell.styles.fontStyle = "bold";
      } else if (rowText.includes("TOTAL GENERAL")) {
        data.cell.styles.fillColor = [220, 38, 38];
        data.cell.styles.textColor = [255, 255, 255];
        data.cell.styles.fontStyle = "bold";
      }
    },

    columnStyles,
    horizontalPageBreak: true,
  });

  ////////////////////////////////////////////////////
  // TOP PRODUCTOS
  ////////////////////////////////////////////////////

  const topProducts = [...rows]
    .sort((a, b) => Number(b.total || 0) - Number(a.total || 0))
    .slice(0, 20)
    .map((item) => [
      item.product,
      item.quantity,
      `Bs ${Number(item.total || 0).toFixed(2)}`,
    ]);

  doc.addPage();

  doc.setFontSize(10);
  doc.text("TOP PRODUCTOS", margin, 20);

  autoTable(doc, {
    startY: 30,
    head: [["PRODUCTO", "CANTIDAD", "TOTAL"]],
    body: topProducts,
    headStyles: {
      fillColor: [220, 38, 38],
      textColor: 255,
    },
    styles: {
      fontSize: 7,
      cellPadding: 2,
    },
  });

  doc.save(
    `matriz_ventas_${new Date()
      .toLocaleDateString("es-BO")
      .replace(/\//g, "-")}.pdf`,
  );
};
