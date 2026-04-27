import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Visibility } from "@mui/icons-material";
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
} from "../components/ui/Location";

import { BackButton } from "../components/ui/Product";

export default function Sales() {
  const navigate = useNavigate();
  const { data } = useSales();
  const { getFileUrl } = useAmazonS3();

  const handleViewPDF = async (key) => {
    const url = await getFileUrl(key);
    window.open(url, "_blank");
  };

  const rows = (data || []).map((sale) => ({
    ...sale,
    employeeName: `${sale.employee?.name} ${sale.employee?.lastName}`,
    locationName: sale.location?.name,
  }));

  const columns = [
    { field: "code", headerName: "Código", width: 130 },

    {
      field: "employeeName",
      headerName: "Empleado",
      flex: 1,
      minWidth: 180,
    },

    {
      field: "locationName",
      headerName: "Sucursal",
      flex: 1,
      minWidth: 160,
    },

    {
      field: "total",
      headerName: "Total",
      width: 140,
      renderCell: (params) => (
        <span style={{ fontWeight: 600 }}>
          Bs {Number(params.value).toFixed(2)}
        </span>
      ),
    },

    {
      field: "date",
      headerName: "Fecha",
      width: 180,
      valueFormatter: (value) => {
        if (!value) return "";

        const date = new Date(value);
        if (isNaN(date.getTime())) return "Fecha inválida";

        return date.toLocaleString();
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
        <BsFillFileEarmarkPdfFill
          size={20}
          style={{ cursor: "pointer", marginTop: "10px", color: "#f20707" }}
          onClick={() => handleViewPDF(params.row.pdfUrl)}
          color={"#2563eb"}
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
        <Actions>
          {/* aquí NO hay botón crear porque la venta viene de otro flujo */}
        </Actions>

        <div style={{ height: 500, background: "white", borderRadius: 12 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            pageSizeOptions={[5, 10]}
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
    </Wrapper>
  );
}
