import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generarInventarioValoradoPDF = ({
  data = [],
  sucursal = "TODAS",
  linea = "TODAS",
  marca = "TODAS",
  producto = "TODOS",
  hasta
}) => {
  const doc = new jsPDF({
    orientation: "landscape",
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  const margin = 14;

  ////////////////////////////////////////////////////
  // ENCABEZADO
  ////////////////////////////////////////////////////

  doc.setFontSize(10);

  doc.setFont("helvetica", "bold");

  doc.text("INVENTARIO VALORADO", pageWidth / 2, 15, {
    align: "center",
  });
  doc.setFontSize(8);
  const drawFilter = (label, value, y) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, margin, y);

    const width = doc.getTextWidth(label);

    doc.setFont("helvetica", "normal");
    doc.text(String(value), margin + width + 2, y);
  };

  drawFilter("SUCURSAL:", sucursal, 30);
  drawFilter("MARCA:", linea, 35);
  drawFilter("LINEA:", marca, 40);
  drawFilter("PRODUCTO:", producto, 45);
  drawFilter("HASTA:", new Date(hasta).toLocaleDateString("es-BO"), 50);
  ////////////////////////////////////////////////////
  // BODY
  ////////////////////////////////////////////////////

  let totalValor = 0;

  const body = data.map((item) => {
    totalValor += Number(item.valor || 0);

    return [
      item.codigo || "",
      item.linea || "",
      item.marca || "",
      "Piezas",
      item.descripcion || "",
      item.cantidad || 0,
      Number(item.costoUnitario || 0).toFixed(2),
      Number(item.valor || 0).toFixed(2),
    ];
  });

  ////////////////////////////////////////////////////
  // TOTAL
  ////////////////////////////////////////////////////

  body.push([
    {
      content: "TOTAL GENERAL",
      colSpan: 7,
      styles: {
        halign: "right",
        fontStyle: "bold",
      },
    },

    Number(totalValor).toFixed(2),
  ]);

  ////////////////////////////////////////////////////
  // TABLA
  ////////////////////////////////////////////////////

  autoTable(doc, {
    startY: 55,

    head: [
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
    ],

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

      if (rowText.includes("TOTAL GENERAL")) {
        data.cell.styles.fillColor = [220, 38, 38];

        data.cell.styles.textColor = [255, 255, 255];

        data.cell.styles.fontStyle = "bold";
      }
    },

    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 35 },
      2: { cellWidth: 40 },
      3: { cellWidth: 18 },
      4: { cellWidth: 90 },
      5: { cellWidth: 17 },
      6: { cellWidth: 24 },
      7: { cellWidth: 24 },
    },
  });

  doc.save(
    `inventario_valorado_${new Date()
      .toLocaleDateString("es-BO")
      .replace(/\//g, "-")}.pdf`,
  );
};
