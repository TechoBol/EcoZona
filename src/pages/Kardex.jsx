import { useState } from "react";

import UserMenu from "../components/menus/UserMenu";

import KardexFiltersModal from "../components/modals/KardexFiltersModal";

import {
  Wrapper,
  Header,
  Title,
  Content,
  AddButton,
  TableWrapper,
} from "../components/ui/Kardex";

import { DataGrid } from "@mui/x-data-grid";

export default function Kardex() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [openFilters, setOpenFilters] = useState(true);

  const [rows, setRows] = useState([]);

  const columns = [
    {
      field: "product",
      headerName: "Producto",
      flex: 1.7,
      minWidth: 250,
    },

    {
      field: "line",
      headerName: "Línea",
      flex: 1,
      minWidth: 140,
    },

    {
      field: "brand",
      headerName: "Marca",
      flex: 1,
      minWidth: 180,
    },

    {
      field: "quantity",
      headerName: "Cantidad",
      width: 130,
      type: "number",
    },

    {
      field: "total",
      headerName: "Total Vendido",
      width: 180,
      type: "number",

      renderCell: (params) => `Bs ${params.row.total.toFixed(2)}`,
    },
  ];

  return (
    <Wrapper>
      <Header>
        <UserMenu isOpen={menuOpen} setIsOpen={setMenuOpen} />

        <Title>Matriz de Ventas</Title>

        <AddButton onClick={() => setOpenFilters(true)}>Filtros</AddButton>
      </Header>

      <Content>
       <TableWrapper>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 20, 50]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            sx={{
              border: "none",

              fontSize: 14,

              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f7f8fc",
                borderBottom: "1px solid #ececec",
              },

              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 700,
              },

              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f5f5f5",
              },

              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#fafafa",
              },

              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid #ececec",
              },
            }}
          />{" "}
        </TableWrapper>
      </Content>

      <KardexFiltersModal
        open={openFilters}
        onClose={() => setOpenFilters(false)}
        onGenerate={(data) => {
          setRows(data);
          setOpenFilters(false);
        }}
      />
    </Wrapper>
  );
}
