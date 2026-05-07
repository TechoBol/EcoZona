import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generarInventoryPDF = (item, location, getStock) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    const safeProducts = Array.isArray(item) ? item : []

    // ── ENCABEZADO ──
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("REPORTE DE INVENTARIO", pageWidth / 2, 18, { align: "center" });

    doc.line(margin, 22, pageWidth - margin, 22);

    // ── DATOS ──
    doc.setFontSize(9);
    let y = 30;

    const campo = (label, value, x, cy, labelWidth) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, x, cy);
        doc.setFont("helvetica", "normal");
        doc.text(value, x + labelWidth, cy);
    };

    // Columna izquierda
    campo("Sucursal", location?.name || "General", margin, y, 22);
    campo("Total productos", `${safeProducts.length} ítems`, margin, y + 6, 38);

    // Columna derecha
    campo("Fecha", new Date().toLocaleString("es-BO"), pageWidth / 2 + 5, y, 18);
    campo("Stock total", `${safeProducts.reduce((acc, item) => acc + getStock(item), 0)} unidades`, pageWidth / 2 + 5, y + 6, 28);

    doc.line(margin, y + 11, pageWidth - margin, y + 11);

    // ── TABLA ──
    const tableData = safeProducts.map((p) => [
        p.barcode || "—",
        p.name || "—",
        p.line?.name || "—",
        p.brandName || "—",
        getStock(p),
    ]);

    autoTable(doc, {
        startY: y + 15,
        head: [["Código", "Nombre", "Línea", "Marca", "Stock"]],
        body: tableData,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [220, 38, 38] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: {
            0: { cellWidth: 28 },  // Código
            1: { cellWidth: 70 },  // Nombre
            2: { cellWidth: 30 },  // Línea
            3: { cellWidth: 30 },  // Marca
            4: { cellWidth: 20 },  // Stock
        },
    });

    const finalY = doc.lastAutoTable.finalY || 80;

    // ── PIE ──
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
        `Generado el ${new Date().toLocaleString("es-BO")}`,
        pageWidth / 2,
        finalY + 10,
        { align: "center" }
    );

    doc.save(
        `inventario_${location?.name || "general"}_${new Date()
            .toLocaleDateString("es-BO")
            .replace(/\//g, "-")}.pdf`
    );
};