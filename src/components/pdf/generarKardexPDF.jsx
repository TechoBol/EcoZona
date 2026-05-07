// utils/generarKardexPDF.ts

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";

export const generarKardexPDF = ({
  data = [],
  producto,
  desde,
  hasta,
  sucursal,
}) => {
  const doc = new jsPDF("landscape");

  // =====================================================
  // 🔥 CONFIG
  // =====================================================

  const pageWidth = doc.internal.pageSize.getWidth();

  // =====================================================
  // 🔥 TITULO
  // =====================================================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);

  doc.text("KARDEX FISICO VALORADO", pageWidth / 2, 15, {
    align: "center",
  });

  // =====================================================
  // 🔥 RANGO FECHAS
  // =====================================================

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text(
    `${dayjs(desde).format("DD/MM/YYYY")}  -  ${dayjs(hasta).format(
      "DD/MM/YYYY",
    )}`,
    pageWidth / 2,
    22,
    {
      align: "center",
    },
  );

  // =====================================================
  // 🔥 SUCURSAL
  // =====================================================

  doc.setFontSize(10);

  doc.text(`Sucursal: ${sucursal || "TODAS"}`, 14, 32);

  let currentY = 40;

  // =====================================================
  // 🔥 RECORRER PRODUCTOS
  // =====================================================

  data.forEach((grupo, index) => {
    // =====================================================
    // 🔥 NOMBRE PRODUCTO
    // =====================================================

    doc.setFont("helvetica", "bold");

    doc.setFontSize(11);

    doc.setFontSize(11);

    doc.text(`Producto: ${grupo.producto}`, 14, currentY);

    currentY += 5;

    doc.setFontSize(9);

    doc.text(`Código: ${grupo.barcode || "-"}`, 14, currentY);

    doc.text(`Línea: ${grupo.linea || "-"}`, 70, currentY);

    doc.text(`Marca: ${grupo.marca || "-"}`, 140, currentY);

    currentY += 6;

    // =====================================================
    // 🔥 TABLA
    // =====================================================

    autoTable(doc, {
      startY: currentY,

      theme: "grid",

      headStyles: {
        fillColor: [52, 73, 94],
        fontSize: 8,
        halign: "center",
        valign: "middle",
      },

      styles: {
        fontSize: 7,
        cellPadding: 2,
        valign: "middle",
      },

      columnStyles: {
        0: { cellWidth: 18 }, // codigo
        1: { cellWidth: 20 }, // fecha
        2: { cellWidth: 35 }, // cliente
        3: { cellWidth: 55 }, // detalle

        4: { halign: "right" }, // entrada
        5: { halign: "right" }, // salida
        6: { halign: "right" }, // saldo

        7: { halign: "right" }, // c/u
        8: { halign: "right" }, // entrada bs
        9: { halign: "right" }, // salida bs
        10: { halign: "right" }, // saldo bs
      },

      head: [
        [
          {
            content: "Código",
            rowSpan: 2,
          },

          {
            content: "Fecha",
            rowSpan: 2,
          },

          {
            content: "Cliente",
            rowSpan: 2,
          },

          {
            content: "Detalle",
            rowSpan: 2,
          },

          {
            content: "Inventario Físico",
            colSpan: 3,
          },

          {
            content: "Inventario Valorado",
            colSpan: 4,
          },
        ],

        [
          "Entrada",
          "Salida",
          "Saldo",

          "C/U",
          "Entrada Bs",
          "Salida Bs",
          "Saldo Bs",
        ],
      ],

      body: grupo.kardex.map((row) => {
        let codigo = "";

        if (row.detalle?.includes("VENTA")) {
          codigo = row.detalle.replace("VENTA ", "");
        }

        if (row.detalle?.includes("TRANSFERENCIA")) {
          codigo = row.detalle.split(" ").pop();
        }

        return [
          // 🔥 CODIGO
          codigo,

          // 🔥 FECHA
          dayjs(row.fecha).format("DD/MM/YYYY"),

          // 🔥 CLIENTE
          row.detalle?.includes("VENTA")
            ? "CONSUMIDOR FINAL"
            : row.detalle?.includes("TRANSFERENCIA")
            ? "TRANSFERENCIA"
            : "",

          // 🔥 DETALLE
          row.detalle,

          // 🔥 INVENTARIO FISICO
          row.entrada || "",
          row.salida || "",
          row.saldoCantidad || "",

          // 🔥 INVENTARIO VALORADO
          Number(row.costoUnitario || 0).toFixed(2),
          Number(row.entradaTotal || 0).toFixed(2),
          Number(row.salidaTotal || 0).toFixed(2),
          Number(row.saldoTotal || 0).toFixed(2),
        ];
      }),

      // =====================================================
      // 🔥 FOOTER TOTALES
      // =====================================================

      foot: [
        [
          "SUB TOTAL",
          "",
          "",
          "",

          // 🔥 INVENTARIO FISICO
          grupo.kardex
            .reduce((acc, row) => acc + Number(row.entrada || 0), 0)
            .toFixed(2),

          grupo.kardex
            .reduce((acc, row) => acc + Number(row.salida || 0), 0)
            .toFixed(2),

          grupo.kardex.length > 0
            ? Number(
                grupo.kardex[grupo.kardex.length - 1]?.saldoCantidad || 0,
              ).toFixed(2)
            : "0.00",

          // 🔥 C/U FINAL
          grupo.kardex.length > 0
            ? Number(
                grupo.kardex[grupo.kardex.length - 1]?.costoUnitario || 0,
              ).toFixed(2)
            : "0.00",

          // 🔥 INVENTARIO VALORADO
          grupo.kardex
            .reduce((acc, row) => acc + Number(row.entradaTotal || 0), 0)
            .toFixed(2),

          grupo.kardex
            .reduce((acc, row) => acc + Number(row.salidaTotal || 0), 0)
            .toFixed(2),

          grupo.kardex.length > 0
            ? Number(
                grupo.kardex[grupo.kardex.length - 1]?.saldoTotal || 0,
              ).toFixed(2)
            : "0.00",
        ],
      ],

      footStyles: {
        fillColor: [230, 230, 230],
        textColor: 0,
        fontStyle: "bold",
        halign: "right",
      },

      didDrawPage: () => {
        doc.setFontSize(8);

        doc.text(`Página ${doc.getNumberOfPages()}`, pageWidth - 20, 10);
      },
    });

    // =====================================================
    // 🔥 NUEVA POSICION
    // =====================================================

    currentY = doc.lastAutoTable.finalY + 12;

    // =====================================================
    // 🔥 SALTO PAGINA
    // =====================================================

    if (currentY > 170 && index < data.length - 1) {
      doc.addPage();

      currentY = 20;
    }
  });

  // =====================================================
  // 🔥 GUARDAR PDF
  // =====================================================

  doc.save(`kardex_${producto?.name || "general"}.pdf`);
};
