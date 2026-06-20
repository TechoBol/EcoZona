import XLSX from "xlsx-js-style";

export const generarInventarioValoradoExcel = ({
  data = [],
  sucursal = "TODAS",
  linea = "TODAS",
  marca = "TODAS",
  producto = "TODOS",
  hasta,
}) => {
  ////////////////////////////////////////////////////
  // DATOS
  ////////////////////////////////////////////////////

  let totalValor = 0;

  const excelData = [
    ["INVENTARIO VALORADO"],
    [],
    ["SUCURSAL:", sucursal],
    ["MARCA:", marca],
    ["LINEA:", linea],
    ["PRODUCTO:", producto],
    [
      "HASTA:",
      hasta
        ? new Date(hasta).toLocaleDateString("es-BO")
        : "",
    ],
    [],
    [
      "CODIGO",
      "MARCA",
      "LINEA",
      "UNIDAD",
      "DESCRIPCION",
      "CANTIDAD",
      "COSTO UNIT.",
      "VALOR",
    ],
  ];

  data.forEach((item) => {
    totalValor += Number(item.valor || 0);

    excelData.push([
      item.codigo || "",
      item.marca || "",
      item.linea || "",
      "Piezas",
      item.descripcion || "",
      Number(item.cantidad || 0),
      Number(item.costoUnitario || 0),
      Number(item.valor || 0),
    ]);
  });

  ////////////////////////////////////////////////////
  // TOTAL GENERAL
  ////////////////////////////////////////////////////

  excelData.push([
    "TOTAL GENERAL",
    "",
    "",
    "",
    "",
    "",
    "",
    Number(totalValor.toFixed(2)),
  ]);

  ////////////////////////////////////////////////////
  // HOJA
  ////////////////////////////////////////////////////

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(excelData);

  ////////////////////////////////////////////////////
  // ANCHOS
  ////////////////////////////////////////////////////

  ws["!cols"] = [
    { wch: 18 }, // codigo
    { wch: 20 }, // marca
    { wch: 20 }, // linea
    { wch: 12 }, // unidad
    { wch: 60 }, // descripcion
    { wch: 15 }, // cantidad
    { wch: 18 }, // costo
    { wch: 18 }, // valor
  ];

  ////////////////////////////////////////////////////
  // MERGES
  ////////////////////////////////////////////////////

  ws["!merges"] = [
    {
      s: { r: 0, c: 0 },
      e: { r: 0, c: 7 },
    },
    {
      s: { r: excelData.length - 1, c: 0 },
      e: { r: excelData.length - 1, c: 6 },
    },
  ];

  ////////////////////////////////////////////////////
  // TITULO
  ////////////////////////////////////////////////////

  ws["A1"].s = {
    font: {
      bold: true,
      sz: 16,
      color: { rgb: "FFFFFF" },
    },
    fill: {
      fgColor: { rgb: "DC2626" },
    },
    alignment: {
      horizontal: "center",
      vertical: "center",
    },
  };

  ////////////////////////////////////////////////////
  // FILTROS
  ////////////////////////////////////////////////////

  for (let row = 3; row <= 7; row++) {
    const label = ws[`A${row}`];

    if (label) {
      label.s = {
        font: {
          bold: true,
        },
      };
    }
  }

  ////////////////////////////////////////////////////
  // HEADER TABLA
  ////////////////////////////////////////////////////

  for (let col = 0; col <= 7; col++) {
    const cell = XLSX.utils.encode_cell({
      r: 8,
      c: col,
    });

    if (!ws[cell]) continue;

    ws[cell].s = {
      font: {
        bold: true,
        color: { rgb: "FFFFFF" },
      },
      fill: {
        fgColor: {
          rgb: "DC2626",
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
  // CUERPO
  ////////////////////////////////////////////////////

  const range = XLSX.utils.decode_range(ws["!ref"]);

  for (let R = 9; R < range.e.r; R++) {
    for (let C = 0; C <= 7; C++) {
      const address = XLSX.utils.encode_cell({
        r: R,
        c: C,
      });

      if (!ws[address]) continue;

      ws[address].s = {
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        },
        alignment: {
          vertical: "center",
        },
      };
    }
  }

  ////////////////////////////////////////////////////
  // FORMATO NUMERICO
  ////////////////////////////////////////////////////

  for (let R = 9; R < range.e.r; R++) {
    const costoCell = XLSX.utils.encode_cell({
      r: R,
      c: 6,
    });

    const valorCell = XLSX.utils.encode_cell({
      r: R,
      c: 7,
    });

    if (ws[costoCell]) {
      ws[costoCell].z = "#,##0.00";
    }

    if (ws[valorCell]) {
      ws[valorCell].z = "#,##0.00";
    }
  }

  ////////////////////////////////////////////////////
  // TOTAL GENERAL
  ////////////////////////////////////////////////////

  const totalRow = excelData.length - 1;

  for (let C = 0; C <= 7; C++) {
    const address = XLSX.utils.encode_cell({
      r: totalRow,
      c: C,
    });

    if (!ws[address]) continue;

    ws[address].s = {
      font: {
        bold: true,
        color: {
          rgb: "FFFFFF",
        },
      },
      fill: {
        fgColor: {
          rgb: "DC2626",
        },
      },
      alignment: {
        horizontal: C === 0 ? "center" : "right",
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
  // AUTOFILTRO
  ////////////////////////////////////////////////////

  ws["!autofilter"] = {
    ref: `A9:H${excelData.length}`,
  };

  ////////////////////////////////////////////////////
  // CONGELAR CABECERA
  ////////////////////////////////////////////////////

  ws["!freeze"] = {
    xSplit: 0,
    ySplit: 9,
  };

  ////////////////////////////////////////////////////
  // AGREGAR HOJA
  ////////////////////////////////////////////////////

  XLSX.utils.book_append_sheet(
    wb,
    ws,
    "Inventario Valorado"
  );

  ////////////////////////////////////////////////////
  // EXPORTAR
  ////////////////////////////////////////////////////

  XLSX.writeFile(
    wb,
    `inventario_valorado_${new Date()
      .toLocaleDateString("es-BO")
      .replace(/\//g, "-")}.xlsx`
  );
};