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
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import Swal from "sweetalert2";

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
import { useUpdateSale } from "../hooks/useUpdateSale";
import { useUpdateDateSale } from "../hooks/useUpdateDateSale";
import { successToast, errorToast } from "../services/toasts";
import { useRegeneratePdf } from "../hooks/useRegeneratePDF";
import { usePermissions } from "../hooks/usePermissions";
import socket from "../services/SocketIOConnection";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export default function Sales() {
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
  const [currentCode, setCurrentCode] = useState("");
  const [confirmModal, setConfirmModal] = useState({ open: false, row: null });
  const { updateSale } = useUpdateSale();
  const { updateDateSale } = useUpdateDateSale();
  const { data, refresh, cancelSale } = useSales();
  const [dateModal, setDateModal] = useState({ open: false, row: null });
  const [newDate, setNewDate] = useState(dayjs());
  const { regeneratePdf } = useRegeneratePdf();
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [loadingDate, setLoadingDate] = useState(false);
  const permissions = usePermissions();

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

  const handleViewPDF = async (key, code) => {
    const url = await getFileUrl(key);
    setPdfUrl(url);
    setCurrentCode(code);
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
      { align: "right" },
    );
    doc.setTextColor(0);

    autoTable(doc, {
      startY: startDate || endDate ? 28 : 22,
      head: [
        ["Código", "Trabajador", "Sucursal", "Tipo venta", "Total", "Fecha"],
      ],
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
      headStyles: {
        fillColor: [30, 30, 60],
        textColor: 255,
        fontStyle: "bold",
      },
      footStyles: {
        fillColor: [240, 240, 240],
        textColor: [30, 30, 30],
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [248, 249, 255] },
      columnStyles: { 4: { halign: "right" } },
    });

    doc.save(`ventas_${dayjs().format("YYYYMMDD_HHmm")}.pdf`);
  };

  const rows = (data || []).map((sale) => ({
    ...sale,
    date: sale.date ? new Date(sale.date) : null,
    employeeName: `${sale.employee?.name || ""} ${sale.employee?.lastName || ""
      }`.trim(),
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
      const matchVenta = row.code?.toLowerCase().includes(q);
      if (!matchEmpleado && !matchSucursal && !matchTipo && !matchVenta)
        return false;
    }
    return true;
  });

  useEffect(() => {
    const total = filteredRows
      .filter((row) => row.status !== "CANCELLED")
      .reduce((sum, row) => sum + Number(row.total || 0), 0);

    setFilteredTotal(total);
  }, [filteredRows]);

  // Estilo reutilizable para cualquier botón bloqueado
  const disabledStyle = {
    background: "#f0f0f0",
    color: "#999",
    border: "1px solid #ddd",
    cursor: "not-allowed",
    opacity: 0.55,
  };

  const columns = [
    {
      field: "code",
      disableColumnMenu: true,
      headerName: "Código",
      width: 130,
    },
    {
      field: "employeeName",
      disableColumnMenu: true,
      headerName: "Trabajador",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "locationName",
      disableColumnMenu: true,
      headerName: "Sucursal",
      flex: 1,
      minWidth: 160,
    },
    {
      field: "typeSale",
      disableColumnMenu: true,
      headerName: "Tipo venta",
      flex: 1,
      minWidth: 160,
    },
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
    {
      field: "date",
      headerName: "Fecha",
      width: 180,
      disableColumnMenu: true,
      type: "dateTime",
    },
    {
      field: "status",
      headerName: "Estado",
      width: 130,
      renderCell: (params) => {
        const cancelled = params.value === "CANCELLED";

        return (
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: 600,
              background: cancelled ? "#FDECEC" : "#E8F5E9",
              color: cancelled ? "#C62828" : "#2E7D32",
            }}
          >
            {cancelled ? "Anulada" : "Activa"}
          </span>
        );
      },
    },
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <BsFillFileEarmarkPdfFill
            size={20}
            style={{ cursor: "pointer", color: "#f20707" }}
            onClick={() => handleViewPDF(params.row.pdfUrl, params.row.code)}
          />
        </div>
      ),
    },
    {
      field: "changePayment",
      headerName: "Acciones",
      width: 220,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const isQr = params.row.typeSale === "Qr";
        const opposite = isQr ? "Efectivo" : "Qr";
        const alreadyChanged = params.row.paymentMethodChanged;
        const alreadyDateChanged = params.row.dateChanged;
        const isCancelled = params.row.status === "CANCELLED";

        // Un botón se bloquea si ya fue usado O si la venta está anulada
        const paymentDisabled = alreadyChanged || isCancelled;
        const dateDisabled = alreadyDateChanged || isCancelled;

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              gap: "6px",
              flexWrap: "wrap",
            }}
          >
            {!permissions.isReadOnly && (
              <>
                {/* Cambiar método de pago */}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "3px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    lineHeight: "1",
                    transition: "opacity 0.15s",
                    ...(paymentDisabled
                      ? disabledStyle
                      : {
                        cursor: "pointer",
                        background: isQr ? "#E1F5EE" : "#E6F1FB",
                        color: isQr ? "#0F6E56" : "#0C447C",
                        border: `1px solid ${isQr ? "#1D9E75" : "#185FA5"}`,
                      }),
                  }}
                  onMouseEnter={(e) => {
                    if (!paymentDisabled) e.currentTarget.style.opacity = "0.7";
                  }}
                  onMouseLeave={(e) => {
                    if (!paymentDisabled) e.currentTarget.style.opacity = "1";
                  }}
                  onClick={() => {
                    if (paymentDisabled) {
                      errorToast(
                        isCancelled
                          ? "No se puede modificar una venta anulada"
                          : "Este método de pago ya fue cambiado anteriormente",
                      );
                      return;
                    }

                    setConfirmModal({ open: true, row: params.row });
                  }}
                >
                  {paymentDisabled ? "🔒" : "→"} {opposite}
                </span>

                {/* Cambiar fecha */}
                {permissions.canManageDateSale && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "3px 10px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      lineHeight: "1",
                      transition: "opacity 0.15s",
                      ...(dateDisabled
                        ? disabledStyle
                        : {
                          cursor: "pointer",
                          background: "#FFF4E5",
                          color: "#9A5B00",
                          border: "1px solid #F0B15A",
                        }),
                    }}
                    onMouseEnter={(e) => {
                      if (!dateDisabled) e.currentTarget.style.opacity = "0.7";
                    }}
                    onMouseLeave={(e) => {
                      if (!dateDisabled) e.currentTarget.style.opacity = "1";
                    }}
                    onClick={() => {
                      if (dateDisabled) {
                        errorToast(
                          isCancelled
                            ? "No se puede modificar una venta anulada"
                            : "La fecha ya fue modificada anteriormente",
                        );
                        return;
                      }

                      setDateModal({ open: true, row: params.row });
                    }}
                  >
                    {dateDisabled ? "🔒" : "📅"} Fecha
                  </span>
                )}

                {/* Anular venta */}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "3px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    lineHeight: "1",
                    ...(isCancelled
                      ? disabledStyle
                      : {
                        cursor: "pointer",
                        background: "#FDECEC",
                        color: "#C62828",
                        border: "1px solid #E57373",
                      }),
                  }}
                >
                  {isCancelled ? "🔒" : "❌"} Anular
                </span>
              </>
            )}
          </div >

        );
      },
    },
  ];

  return (
    <Wrapper>
      <Header>
        <UserMenu isOpen={menuOpen} setIsOpen={setMenuOpen} />
        <Title>Ventas</Title>
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
                    "& .MuiOutlinedInput-root": {
                      height: "36px",
                      borderRadius: "10px",
                    },
                    "& .MuiInputBase-input": {
                      padding: "0 8px",
                      fontSize: "13px",
                    },
                    "& .MuiInputLabel-root": {
                      transform: "translate(10px, 9px) scale(1)",
                      fontSize: "13px",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(10px, -9px) scale(0.75)",
                      },
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
                    "& .MuiOutlinedInput-root": {
                      height: "36px",
                      borderRadius: "10px",
                    },
                    "& .MuiInputBase-input": {
                      padding: "0 8px",
                      fontSize: "13px",
                    },
                    "& .MuiInputLabel-root": {
                      transform: "translate(10px, 9px) scale(1)",
                      fontSize: "13px",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(10px, -9px) scale(0.75)",
                      },
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
          <ClearButton
            onClick={() => {
              setStartDate(null);
              setEndDate(null);
            }}
            style={{
              background: "none",
              border: "none",
              boxShadow: "none",
              padding: "6px",
            }}
          >
            <FaTrash size={18} color="#9e9e9e" />
          </ClearButton>
        </DatePickerWrapper>

        <FiltersRow>
          <FilterInput
            placeholder="Buscar por venta, empleado, sucursal o tipo de venta..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </FiltersRow>

        <div style={{ height: "65vh", background: "white", borderRadius: 12 }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            getRowId={(row) => row.id}
            initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
            pageSizeOptions={[25, 50, 100]}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 300 },
              },
            }}
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f8f9ff",
                fontWeight: 600,
              },
              "& .MuiDataGrid-toolbarContainer": { padding: "10px" },
              "& .MuiInputBase-root": {
                borderRadius: "12px",
                backgroundColor: "#f5f5f5",
                paddingLeft: "8px",
              },
              "& .MuiDataGrid-columnHeaderTitle": { fontWeight: "bold" },
            }}
          />
        </div>

        <TotalBar>
          <TotalText $bold>TOTAL:</TotalText>
          <TotalText>Bs {filteredTotal.toFixed(2)}</TotalText>
        </TotalBar>

        {/* Modal PDF */}
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

            <div
              style={{
                position: "absolute",
                top: 10,
                right: 56,
                display: "flex",
                gap: "8px",
                zIndex: 1000,
              }}
            >
              <IconButton
                onClick={async () => {
                  const response = await fetch(pdfUrl);
                  const blob = await response.blob();
                  const blobUrl = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = blobUrl;
                  a.download = `Recibo ${currentCode}.pdf`;
                  a.click();
                  URL.revokeObjectURL(blobUrl);
                }}
                sx={{
                  backgroundColor: "white",
                  boxShadow: 2,
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                <DownloadIcon />
              </IconButton>

              <IconButton
                onClick={async () => {
                  const response = await fetch(pdfUrl);
                  const blob = await response.blob();
                  const blobUrl = URL.createObjectURL(blob);
                  const iframe = document.createElement("iframe");
                  iframe.style.display = "none";
                  iframe.src = blobUrl;
                  document.body.appendChild(iframe);
                  iframe.onload = () => {
                    iframe.contentWindow.print();
                    setTimeout(() => {
                      document.body.removeChild(iframe);
                      URL.revokeObjectURL(blobUrl);
                    }, 1000);
                  };
                }}
                sx={{
                  backgroundColor: "white",
                  boxShadow: 2,
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                <PrintIcon />
              </IconButton>
            </div>

            {pdfUrl && (
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div
                    style={{
                      padding: "40px",
                      color: "#666",
                      textAlign: "center",
                    }}
                  >
                    Cargando PDF...
                  </div>
                }
                error={
                  <div
                    style={{
                      padding: "40px",
                      color: "#d32f2f",
                      textAlign: "center",
                    }}
                  >
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

        {/* Modal confirmación cambio de método de pago */}
        <Dialog
          open={confirmModal.open}
          onClose={() => setConfirmModal({ open: false, row: null })}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: { borderRadius: "16px", padding: "8px" },
          }}
        >
          <DialogContent sx={{ textAlign: "center", padding: "24px" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔄</div>
            <p
              style={{ fontWeight: 600, fontSize: "16px", marginBottom: "8px" }}
            >
              ¿Cambiar método de pago?
            </p>
            <p
              style={{ color: "#666", fontSize: "14px", marginBottom: "24px" }}
            >
              La venta <strong>{confirmModal.row?.code}</strong> pasará de{" "}
              <strong>{confirmModal.row?.typeSale}</strong> a{" "}
              <strong>
                {confirmModal.row?.typeSale === "Qr" ? "Efectivo" : "Qr"}
              </strong>
              .
            </p>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <button
                onClick={() => setConfirmModal({ open: false, row: null })}
                style={{
                  padding: "8px 24px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  background: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (loadingConfirm) return;
                  try {
                    setLoadingConfirm(true);
                    const newType =
                      confirmModal.row.typeSale === "Qr" ? "Efectivo" : "Qr";
                    const updatedSale = await updateSale(
                      confirmModal.row.id,
                      newType,
                    );
                    await regeneratePdf(updatedSale);
                    await refresh();
                    setConfirmModal({ open: false, row: null });
                    successToast("Método de pago actualizado correctamente");
                  } catch (error) {
                    setConfirmModal({ open: false, row: null });
                    errorToast(error.message);
                  } finally {
                    setLoadingConfirm(false);
                  }
                }}
                disabled={loadingConfirm}
                style={{
                  padding: "8px 24px",
                  borderRadius: "8px",
                  border: "none",
                  background: loadingConfirm ? "#a5d6c5" : "#1D9E75",
                  color: "white",
                  cursor: loadingConfirm ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {loadingConfirm ? "Guardando..." : "Confirmar"}
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de cambio de fecha */}
        <Dialog
          open={dateModal.open}
          onClose={() => setDateModal({ open: false, row: null })}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: { borderRadius: "16px", padding: "8px" },
          }}
        >
          <DialogContent sx={{ textAlign: "center", padding: "24px" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>📅</div>
            <p
              style={{ fontWeight: 600, fontSize: "16px", marginBottom: "8px" }}
            >
              ¿Cambiar fecha de venta?
            </p>
            <p
              style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}
            >
              Venta <strong>{dateModal.row?.code}</strong>
            </p>

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                label="Nueva fecha"
                value={newDate}
                onChange={(value) => setNewDate(value)}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: {
                      "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                    },
                  },
                }}
              />
            </LocalizationProvider>

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                marginTop: "24px",
              }}
            >
              <button
                onClick={() => setDateModal({ open: false, row: null })}
                style={{
                  padding: "8px 24px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  background: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (loadingDate) return;
                  try {
                    setLoadingDate(true);
                    const updatedSale = await updateDateSale(
                      dateModal.row.id,
                      newDate.toISOString(),
                    );
                    await regeneratePdf(updatedSale);
                    await refresh();
                    setDateModal({ open: false, row: null });
                    successToast("Fecha actualizada");
                  } catch (error) {
                    errorToast(error.message);
                  } finally {
                    setLoadingDate(false);
                  }
                }}
                disabled={loadingDate}
                style={{
                  padding: "8px 24px",
                  borderRadius: "8px",
                  border: "none",
                  background: loadingDate ? "#a5d6c5" : "#1D9E75",
                  color: "white",
                  cursor: loadingDate ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {loadingDate ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </Content>
    </Wrapper>
  );
}