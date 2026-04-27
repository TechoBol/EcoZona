import { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { useSales } from "../hooks/useSale";
import { useAmazonS3 } from "../hooks/useAmazonS3";
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
import { BackButton } from "../components/ui/Product";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { FaTrash } from "react-icons/fa";

export default function Sales() {
  const navigate = useNavigate();
  const { data } = useSales();
  const { getFileUrl } = useAmazonS3();

  const [filteredTotal, setFilteredTotal] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleViewPDF = async (key) => {
    const url = await getFileUrl(key);
    window.open(url, "_blank");
  };

  const rows = (data || []).map((sale) => ({
    ...sale,
    date: sale.date ? new Date(sale.date) : null,
    employeeName: `${sale.employee?.name || ""} ${sale.employee?.lastName || ""}`.trim(),
    locationName: sale.location?.name || "",
  }));

  const filteredRows = rows.filter((row) => {
    // Filtro por fechas
    if (row.date) {
      const date = dayjs(row.date);
      if (startDate && date.isBefore(startDate, "day")) return false;
      if (endDate && date.isAfter(endDate, "day")) return false;
    }

    // Filtro global (empleado + sucursal + tipo)
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
      (sum, row) => sum + Number(row.total || 0), 0
    );
    setFilteredTotal(total);
  }, [filteredRows]);

  const columns = [
    { field: "code", headerName: "Código", width: 130 },
    { field: "employeeName", headerName: "Empleado", flex: 1, minWidth: 180 },
    { field: "locationName", headerName: "Sucursal", flex: 1, minWidth: 160 },
    { field: "typeSale", headerName: "Tipo venta", flex: 1, minWidth: 160 },
    {
      field: "total",
      headerName: "Total",
      width: 140,
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
      type: "dateTime",
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
        <BackButton onClick={() => navigate("/inventory")}>
          <ArrowLeft size={22} />
        </BackButton>
        <Title>Ventas</Title>
      </Header>

      <Content>
        <Actions />

        {/* FILTRO DE FECHAS */}
        <DatePickerWrapper>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DatePicker
              label="Desde"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{
                textField: {
                  size: "small",
                  sx: {
                    width: "150px",
                    "& .MuiOutlinedInput-root": {
                      height: "44px",
                      borderRadius: "14px",
                    },
                    "& .MuiInputBase-input": {
                      padding: "0 14px",
                    },
                    "& .MuiInputLabel-root": {
                      transform: "translate(14px, 12px) scale(1)",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(14px, -9px) scale(0.75)",
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
                    width: "150px",
                    "& .MuiOutlinedInput-root": {
                      height: "44px",
                      borderRadius: "14px",
                    },
                    "& .MuiInputBase-input": {
                      padding: "0 14px",
                    },
                    "& .MuiInputLabel-root": {
                      transform: "translate(14px, 12px) scale(1)",
                      "&.MuiInputLabel-shrink": {
                        transform: "translate(14px, -9px) scale(0.75)",
                      },
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
          <ClearButton onClick={() => { setStartDate(null); setEndDate(null); }}>
            <FaTrash size={18} />
          </ClearButton>
        </DatePickerWrapper>

        {/* BUSCADOR GLOBAL */}
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
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25 },
              },
            }}
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
      </Content>
    </Wrapper>
  );
}