import { useState, useRef, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import { Document, Page, pdfjs } from "react-pdf";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import dayjs from "dayjs";

import UserMenu from "../components/menus/UserMenu";
import CreateInventoryCrossModal from "../components/modals/CreateInventoryCrossModal";
import { useAmazonS3 } from "../hooks/useAmazonS3";

import {
  Wrapper,
  Header,
  Content,
  Title,
  Actions,
  AddButton,
  FiltersRow,
  FilterInput,
} from "../components/ui/Location";

import { useInventoryCross } from "../hooks/useInventoryCross";
import socket from "../services/SocketIOConnection";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export default function InventoryCross() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // ── PDF viewer ──────────────────────────────────────────────
  const [openPdf, setOpenPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [pageWidth, setPageWidth] = useState(600);
  const [currentCode, setCurrentCode] = useState("");
  const containerRef = useRef(null);

  const { getFileUrl } = useAmazonS3();
  const { crosses = [], createCross, loading } = useInventoryCross();

  // Ajustar ancho del PDF al tamaño del Dialog
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

  // ── Abrir PDF desde S3 ──────────────────────────────────────
  const handleViewPDF = async (code) => {
    const key = `ECOZONA/AJUSTE/${code}.pdf`;
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

  // ── Filtro ───────────────────────────────────────────────────
  const filteredCrosses = crosses.filter((cross) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      cross.code?.toLowerCase().includes(q) ||
      cross.location?.name?.toLowerCase().includes(q) ||
      cross.employee?.name?.toLowerCase().includes(q) ||
      cross.employee?.lastName?.toLowerCase().includes(q) ||
      cross.originProduct?.name?.toLowerCase().includes(q) ||
      cross.destinationProduct?.name?.toLowerCase().includes(q) ||
      cross.originProduct?.barcode?.toLowerCase().includes(q) ||
      cross.destinationProduct?.barcode?.toLowerCase().includes(q)
    );
  });

  // ── Columnas ─────────────────────────────────────────────────
  const columns = [
    {
      field: "code",
      headerName: "Código",
      disableColumnMenu: true,

      width: 120,
      valueGetter: (value, row) => row.code ?? "Sin código",
    },
    {
      field: "createdAt",
      headerName: "Fecha",
      disableColumnMenu: true,

      width: 180,
      valueGetter: (value, row) =>
        dayjs(row.createdAt).format("DD/MM/YYYY HH:mm"),
    },
    {
      field: "employee",
      headerName: "Usuario",
      disableColumnMenu: true,

      flex: 1,
      valueGetter: (value, row) =>
        `${row.employee?.name ?? ""} ${row.employee?.lastName ?? ""}`.trim(),
    },
    {
      field: "location",
      headerName: "Sucursal",
      disableColumnMenu: true,

      flex: 1,
      valueGetter: (value, row) => row.location?.name ?? "",
    },
    {
      field: "originProduct",
      headerName: "Producto Origen",
      disableColumnMenu: true,
      flex: 1,
      valueGetter: (value, row) => {
        const barcode = row.originProduct?.barcode
          ? `${row.originProduct.barcode} - `
          : "";
        const name = row.originProduct?.name ?? "";
        return `${barcode} ${name}`.trim();
      },
    },
    {
      field: "destinationProduct",
      headerName: "Producto Destino",
      disableColumnMenu: true,
      flex: 1,
      valueGetter: (value, row) => {
        const barcode = row.destinationProduct?.barcode
          ? `${row.destinationProduct.barcode} -`
          : "";
        const name = row.destinationProduct?.name ?? "";
        return `${barcode} ${name}`.trim();
      },
    },
    {
      field: "quantity",
      headerName: "Cantidad",
      disableColumnMenu: true,

      width: 120,
    },
    {
      field: "observation",
      headerName: "Observación",
      disableColumnMenu: true,

      width: 150,
      valueGetter: (value, row) => row.observation ?? "—",
    },
    {
      field: "pdf",
      headerName: "Comprobante",
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
            onClick={() => handleViewPDF(params.row.code)}
          />
        </div>
      ),
    },
  ];

  return (
    <Wrapper>
      <Header>
        <UserMenu isOpen={menuOpen} setIsOpen={setMenuOpen} />
        <Title>Ajuste de Inventario</Title>
      </Header>

      <Content>
        <Actions>
          <AddButton onClick={() => setOpen(true)}>+ Nuevo Ajuste</AddButton>
        </Actions>

        <FiltersRow>
          <FilterInput
            placeholder="Buscar por código, sucursal, usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </FiltersRow>

        <div style={{ height: "70vh", background: "white", borderRadius: 12 }}>
          <DataGrid
            rows={filteredCrosses}
            columns={columns}
            getRowId={(row) => row.id}
            sx={{
              border: "1px solid #eee",

              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f8f9ff",
                fontWeight: 600,
              },

              "& .MuiDataGrid-toolbarContainer": {
                padding: "10px",
              },

              "& .MuiInputBase-root": {
                borderRadius: "12px",
                backgroundColor: "#f5f5f5",
                paddingLeft: "8px",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold",
              },
            }}
          />
        </div>
      </Content>

      {/* ── Modal visor PDF ─────────────────────────────────── */}
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
          {/* Botón cerrar */}
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

          {/* Botones descargar / imprimir */}
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
                a.download = `Ajuste ${currentCode}.pdf`;
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

          {/* Renderizado del PDF */}
          {pdfUrl && (
            <Document
              file={pdfUrl}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
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

      {/* ── Modal crear ajuste ──────────────────────────────── */}
      <CreateInventoryCrossModal
        open={open}
        loading={loading}
        onClose={() => setOpen(false)}
        onSubmit={async (payload) => {
          const result = await createCross(payload);
          socket.emit("createProduct", result);
        }}
      />
    </Wrapper>
  );
}
