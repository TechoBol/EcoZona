import { useState, useEffect, useRef } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { useSales } from "../hooks/useSale";
import { useAmazonS3 } from "../hooks/useAmazonS3";
import UserMenu from "../components/menus/UserMenu";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  Wrapper,
  Header,
  Title,
  Content,
  Actions,
  TotalBar,
  TotalText,
  FiltersRow,
  FilterInput,
  DatePickerWrapper,
  ClearButton,
} from "../components/ui/Location";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FaTrash } from "react-icons/fa";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function Sales() {
  const { data } = useSales();
  const { getFileUrl } = useAmazonS3();
  const [menuOpen, setMenuOpen] = useState(false);
  const [filteredTotal, setFilteredTotal] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openPdf, setOpenPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [pageWidth, setPageWidth] = useState(600);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!openPdf) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setPageWidth(containerRef.current.offsetWidth - 32);
      }
    };
    const timeout = setTimeout(updateWidth, 100);
    window.addEventListener("resize", updateWidth);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateWidth);
    };
  }, [openPdf]);

  const handleViewPDF = async (key) => {
    const url = await getFileUrl(key);
    setPdfUrl(url);
    setOpenPdf(true);
  };

  const handleClosePdf = () => {
    setOpenPdf(false);
    setPdfUrl("");
    setNumPages(null);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleExportTablePDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Reporte de Ventas", 14, 16);

    if (startDate || endDate) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const desde = startDate ? startDate.format("DD/MM/YYYY") : "—";
      const hasta = endDate ? endDate.format("DD/MM/YYYY") : "—";
      doc.text(`Período: ${desde} al ${hasta}`, 14, 23);
    }

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120);
    doc.text(
      `Generado el ${dayjs().format("DD/MM/YYYY HH:mm")}`,
      doc.internal.pageSize.width - 14,
      16,
      { align: "right" }
    );
    doc.setTextColor(0);

    autoTable(doc, {
      startY: startDate || endDate ? 28 : 22,
      head: [["Código", "Trabajador", "Sucursal", "Tipo venta", "Total", "Fecha"]],
      body: filteredRows.map((row) => [
        row.code || "",
        row.employeeName || "",
        row.locationName || "",
        row.typeSale || "",
        `Bs ${Number(row.total || 0).toFixed(2)}`,
        row.date ? dayjs(row.date).format("DD/MM/YYYY HH:mm") : "",
      ]),
      foot: [["", "", "", "TOTAL", `Bs ${filteredTotal.toFixed(2)}`, ""]],
      styles: { fontSize: 10, cellPadding: 5 },
      headStyles: { fillColor: [30, 30, 60], textColor: 255, fontStyle: "bold" },
      footStyles: { fillColor: [240, 240, 240], textColor: [30, 30, 30], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [248, 249, 255] },
      columnStyles: { 4: { halign: "right" } },
    });

    doc.save(`ventas_${dayjs().format("YYYYMMDD_HHmm")}.pdf`);
  };

  const rows = (data || []).map((sale) => ({
    ...sale,
    date: sale.date ? new Date(sale.date) : null,
    employeeName: `${sale.employee?.name || ""} ${sale.employee?.lastName || ""}`.trim(),
    locationName: sale.location?.name || "",
  }));

  const filteredRows = rows.filter((row) => {
    if (row.date) {
      const date = dayjs(row.date);
      if (startDate && date.isBefore(startDate, "day")) return false;
      if (endDate && date.isAfter(endDate, "day")) return false;
    }
    if (globalFilter) {
      const q = globalFilter.toLowerCase();
      const matchEmpleado = row.employeeName.toLowerCase().includes(q);
      const matchSucursal = row.locationName.toLowerCase().includes(q);
      const matchTipo = row.typeSale?.toLowerCase().includes(q);
      if (!matchEmpleado && !matchSucursal && !matchTipo) return false;
    }
    return true;
  });

  useEffect(() => {
    const total = filteredRows.reduce(
      (sum, row) => sum + Number(row.total || 0),
      0
    );
    setFilteredTotal(total);
  }, [filteredRows]);

  const columns = [
    { field: "code", disableColumnMenu: true, headerName: "Código", width: 130 },
    { field: "employeeName", disableColumnMenu: true, headerName: "Trabajador", flex: 1, minWidth: 180 },
    { field: "locationName", disableColumnMenu: true, headerName: "Sucursal", flex: 1, minWidth: 160 },
    { field: "typeSale", disableColumnMenu: true, headerName: "Tipo venta", flex: 1, minWidth: 160 },
    {
      field: "total",
      headerName: "Total",
      width: 140,
      disableColumnMenu: true,
      renderCell: (params) => (
        <span style={{ fontWeight: 600 }}>
          Bs {Number(params.value || 0).toFixed(2)}
        </span>
      ),
    },
    { field: "date", headerName: "Fecha", width: 180, disableColumnMenu: true, type: "dateTime" },
    {
      field: "actions",
      headerName: "Recibo",
      width: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <BsFillFileEarmarkPdfFill
          size={20}
          style={{ cursor: "pointer", marginTop: "10px", color: "#f20707" }}
          onClick={() => handleViewPDF(params.row.pdfUrl)}
        />
      ),
    },
  ];

  return (
    <Wrapper>
      <Header>
        <UserMenu isOpen={menuOpen} setIsOpen={setMenuOpen} />
        <Title>Ventas</Title>
        {/* PDF aquí */}
        <button
          onClick={handleExportTablePDF}
          style={{
            display: "flex",
            alignItems: "center",
            background: "none",
            border: "none",
            padding: "6px",
            cursor: "pointer",
            marginLeft: "auto",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.65")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <BsFillFileEarmarkPdfFill size={26} color="#0D0D0D" />
        </button>
      </Header>

      <Content>
        <Actions />

        <DatePickerWrapper
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "0",
            flexWrap: "nowrap",
          }}
        >
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <DatePicker
            label="Desde"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            slotProps={{
              textField: {
                size: "small",
                sx: {
                  width: { xs: "calc(50% - 28px)", sm: "160px" },
                  "& .MuiOutlinedInput-root": { height: "36px", borderRadius: "10px" },
                  "& .MuiInputBase-input": { padding: "0 8px", fontSize: "13px" },
                  "& .MuiInputLabel-root": {
                    transform: "translate(10px, 9px) scale(1)",
                    fontSize: "13px",
                    "&.MuiInputLabel-shrink": { transform: "translate(10px, -9px) scale(0.75)" },
                  },
                },
              },
            }}
          />
          <DatePicker
            label="Hasta"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            slotProps={{
              textField: {
                size: "small",
                sx: {
                  width: { xs: "calc(50% - 28px)", sm: "160px" },
                  "& .MuiOutlinedInput-root": { height: "36px", borderRadius: "10px" },
                  "& .MuiInputBase-input": { padding: "0 8px", fontSize: "13px" },
                  "& .MuiInputLabel-root": {
                    transform: "translate(10px, 9px) scale(1)",
                    fontSize: "13px",
                    "&.MuiInputLabel-shrink": { transform: "translate(10px, -9px) scale(0.75)" },
                  },
                },
              },
            }}
          />
        </LocalizationProvider>

        {/* Trash */}
        <ClearButton
          onClick={() => { setStartDate(null); setEndDate(null); }}
          style={{ background: "none", border: "none", boxShadow: "none", padding: "6px" }}
        >
          <FaTrash size={18} color="#9e9e9e" />
        </ClearButton>
      </DatePickerWrapper>

      <FiltersRow>
        <FilterInput
          placeholder="Buscar por empleado, sucursal o tipo de venta..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </FiltersRow>

      <div style={{ height: 500, background: "white", borderRadius: 12 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row.id}
          initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
          pageSizeOptions={[25, 50, 100]}
          slots={{ toolbar: GridToolbar }}
          slotProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 300 } } }}
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": { backgroundColor: "#f8f9ff", fontWeight: 600 },
            "& .MuiDataGrid-toolbarContainer": { padding: "10px" },
            "& .MuiInputBase-root": { borderRadius: "12px", backgroundColor: "#f5f5f5", paddingLeft: "8px" },
            "& .MuiDataGrid-columnHeaderTitle": { fontWeight: "bold" },
          }}
        />
      </div>

      <TotalBar>
        <TotalText $bold>TOTAL:</TotalText>
        <TotalText>Bs {filteredTotal.toFixed(2)}</TotalText>
      </TotalBar>

      <Dialog
        open={openPdf}
        onClose={handleClosePdf}
        fullScreen={window.innerWidth < 768}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: { xs: 0, md: "16px" }, overflow: "hidden" },
        }}
      >
        <DialogContent
          ref={containerRef}
          sx={{
            padding: "16px",
            paddingTop: "52px",
            background: "#f0f0f0",
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflowY: "auto",
            gap: "12px",
          }}
        >
          <IconButton
            onClick={handleClosePdf}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 1000,
              backgroundColor: "white",
              boxShadow: 2,
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
          >
            <CloseIcon />
          </IconButton>

          {pdfUrl && (
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div style={{ padding: "40px", color: "#666", textAlign: "center" }}>
                  Cargando PDF...
                </div>
              }
              error={
                <div style={{ padding: "40px", color: "#d32f2f", textAlign: "center" }}>
                  Error al cargar el PDF.
                </div>
              }
            >
              {Array.from({ length: numPages || 0 }, (_, i) => (
                <Page
                  key={`page_${i + 1}`}
                  pageNumber={i + 1}
                  width={pageWidth}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  style={{ marginBottom: "12px" }}
                />
              ))}
            </Document>
          )}
        </DialogContent>
      </Dialog>
    </Content>
    </Wrapper >
  );
}