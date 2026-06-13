import XLSX from "xlsx-js-style";

export const generarVentasExcel = (rows = []) => {
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

    if (!grouped[line]) grouped[line] = {};
    if (!grouped[line][brand]) grouped[line][brand] = {};

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
  // DETALLE
  ////////////////////////////////////////////////////

  const detalle = [];

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
        const row = {
          MARCA: firstLineRow ? line : "",
          LÍNEA: firstBrandRow ? brand : "",
          CODIGO: data.barcode,
          PRODUCTO: product,
        };

        branches.forEach((branch) => {
          row[branch] = data.branches[branch] || 0;

          brandBranches[branch] =
            (brandBranches[branch] || 0) + (data.branches[branch] || 0);

          lineBranches[branch] =
            (lineBranches[branch] || 0) + (data.branches[branch] || 0);

          grandBranches[branch] =
            (grandBranches[branch] || 0) + (data.branches[branch] || 0);
        });

        row["Total Cantidad"] = data.quantity;
        row["Total Bs"] = Number(data.total.toFixed(2));

        detalle.push(row);

        brandQuantity += data.quantity;
        brandTotal += data.total;

        lineQuantity += data.quantity;
        lineTotal += data.total;

        grandQuantity += data.quantity;
        grandTotal += data.total;

        firstLineRow = false;
        firstBrandRow = false;
      });

      const subtotalRow = {
        MARCA: "",
        LÍNEA: `SUBTOTAL ${brand}`,
        CODIGO: "",
        PRODUCTO: "",
      };

      branches.forEach((branch) => {
        subtotalRow[branch] = brandBranches[branch] || 0;
      });

      subtotalRow["Total Cantidad"] = brandQuantity;
      subtotalRow["Total Bs"] = Number(brandTotal.toFixed(2));

      detalle.push(subtotalRow);
    });

    const totalLineRow = {
      MARCA: `TOTAL ${line}`,
      LÍNEA: "",
      CODIGO: "",
      PRODUCTO: "",
    };

    branches.forEach((branch) => {
      totalLineRow[branch] = lineBranches[branch] || 0;
    });

    totalLineRow["Total Cantidad"] = lineQuantity;
    totalLineRow["Total Bs"] = Number(lineTotal.toFixed(2));

    detalle.push(totalLineRow);
  });

  const totalGeneralRow = {
    MARCA: "TOTAL GENERAL",
    LÍNEA: "",
    CODIGO: "",
    PRODUCTO: "",
  };

  branches.forEach((branch) => {
    totalGeneralRow[branch] = grandBranches[branch] || 0;
  });

  totalGeneralRow["Total Cantidad"] = grandQuantity;
  totalGeneralRow["Total Bs"] = Number(grandTotal.toFixed(2));

  detalle.push(totalGeneralRow);

  ////////////////////////////////////////////////////
  // EXCEL
  ////////////////////////////////////////////////////

  const wb = XLSX.utils.book_new();

  const ws = XLSX.utils.json_to_sheet(detalle);

  ////////////////////////////////////////////////////
  // ANCHO COLUMNAS
  ////////////////////////////////////////////////////

  ws["!cols"] = [
    { wch: 25 }, // Marca
    { wch: 30 }, // Línea
    { wch: 20 }, // Barcode
    { wch: 50 }, // Producto
    ...branches.map(() => ({ wch: 15 })),
    { wch: 18 },
    { wch: 18 },
  ];

  ////////////////////////////////////////////////////
  // ESTILOS HEADER
  ////////////////////////////////////////////////////

  const range = XLSX.utils.decode_range(ws["!ref"]);

  for (let C = range.s.c; C <= range.e.c; C++) {
    const cellAddress = XLSX.utils.encode_cell({
      r: 0,
      c: C,
    });

    if (!ws[cellAddress]) continue;

    ws[cellAddress].s = {
      font: {
        bold: true,
        color: { rgb: "FFFFFF" },
      },
      fill: {
        fgColor: {
          rgb: "F20C1F",
        },
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
    };
  }

  ////////////////////////////////////////////////////
  // MERGES
  ////////////////////////////////////////////////////

  ws["!merges"] = [];

  ////////////////////////////////////////////////////
  // RECORRER FILAS
  ////////////////////////////////////////////////////

  for (let R = 1; R <= range.e.r; R++) {
    const lineaCell = ws[`A${R + 1}`];
    const marcaCell = ws[`B${R + 1}`];

    const lineaValue = lineaCell?.v || "";
    const marcaValue = marcaCell?.v || "";

    ////////////////////////////////////////////////////
    // SUBTOTAL MARCA
    ////////////////////////////////////////////////////

    if (typeof marcaValue === "string" && marcaValue.startsWith("SUBTOTAL")) {
      ws["!merges"].push({
        s: { r: R, c: 1 },
        e: { r: R, c: 3 },
      });

      for (let C = 0; C <= range.e.c; C++) {
        const address = XLSX.utils.encode_cell({
          r: R,
          c: C,
        });

        if (!ws[address]) continue;

        ws[address].s = {
          fill: {
            fgColor: {
              rgb: "FEF08A",
            },
          },
          font: {
            bold: true,
          },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
          },
        };
      }
    }

    ////////////////////////////////////////////////////
    // TOTAL LINEA
    ////////////////////////////////////////////////////

    if (
      typeof lineaValue === "string" &&
      lineaValue.startsWith("TOTAL ") &&
      lineaValue !== "TOTAL GENERAL"
    ) {
      ws["!merges"].push({
        s: { r: R, c: 0 },
        e: { r: R, c: 3 },
      });

      for (let C = 0; C <= range.e.c; C++) {
        const address = XLSX.utils.encode_cell({
          r: R,
          c: C,
        });

        if (!ws[address]) continue;

        ws[address].s = {
          fill: {
            fgColor: {
              rgb: "16A34A",
            },
          },
          font: {
            bold: true,
          },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
          },
        };
      }
    }

    ////////////////////////////////////////////////////
    // TOTAL GENERAL
    ////////////////////////////////////////////////////

    if (lineaValue === "TOTAL GENERAL") {
      ws["!merges"].push({
        s: { r: R, c: 0 },
        e: { r: R, c: 3 },
      });

      for (let C = 0; C <= range.e.c; C++) {
        const address = XLSX.utils.encode_cell({
          r: R,
          c: C,
        });

        if (!ws[address]) continue;

        ws[address].s = {
          fill: {
            fgColor: {
              rgb: "DC2626",
            },
          },
          font: {
            bold: true,
            color: {
              rgb: "FFFFFF",
            },
          },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
          },
        };
      }
    }
  }

  ////////////////////////////////////////////////////
  // FORMATO MONEDA TOTAL BS
  ////////////////////////////////////////////////////

  const totalBsColumn = 4 + branches.length + 1;

  for (let R = 1; R <= range.e.r; R++) {
    const address = XLSX.utils.encode_cell({
      r: R,
      c: totalBsColumn,
    });

    if (!ws[address]) continue;

    ws[address].z = "#,##0.00";
  }

  ////////////////////////////////////////////////////
  // FILTRO
  ////////////////////////////////////////////////////

  ws["!autofilter"] = {
    ref: ws["!ref"],
  };

  ////////////////////////////////////////////////////
  // CONGELAR HEADER
  ////////////////////////////////////////////////////

  ws["!freeze"] = {
    xSplit: 0,
    ySplit: 1,
  };

  ////////////////////////////////////////////////////
  // AGREGAR HOJA
  ////////////////////////////////////////////////////

  XLSX.utils.book_append_sheet(wb, ws, "Detalle");

  ////////////////////////////////////////////////////
  // DESCARGAR
  ////////////////////////////////////////////////////

  XLSX.writeFile(
    wb,
    `matriz_ventas_${new Date()
      .toLocaleDateString("es-BO")
      .replace(/\//g, "-")}.xlsx`,
  );
};
