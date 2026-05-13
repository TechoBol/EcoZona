import { useMemo, useState } from "react";

import UserMenu from "../components/menus/UserMenu";
import KardexFiltersModal from "../components/modals/KardexFiltersModal";

import {
  Wrapper,
  Header,
  Title,
  Content,
  AddButton,
  TableWrapper,
  GroupBar,
  GroupButton,
  TotalBar,
  TotalText,
} from "../components/ui/Kardex";

import { DataGrid } from "@mui/x-data-grid";

export default function Kardex() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [openFilters, setOpenFilters] = useState(true);

  const [rawRows, setRawRows] = useState([]);

  const [groupBy, setGroupBy] = useState("");

  const rows = useMemo(() => {
    if (!groupBy) {
      const grouped = {};

      rawRows.forEach((item) => {
        const key = "GENERAL";

        if (!grouped[key]) {
          grouped[key] = {
            id: key,
            group: "GENERAL",
            items: [],
            totalAmount: 0,
          };
        }

        grouped[key].items.push({
          product: item.product,
          quantity: item.quantity,
          total: item.total,
        });

        grouped[key].totalAmount += Number(item.total || 0);
      });

      return Object.values(grouped);
    }

    const grouped = {};

    rawRows.forEach((item) => {
      const groupValue = item[groupBy] || "Sin grupo";

      if (!grouped[groupValue]) {
        grouped[groupValue] = {
          id: groupValue,
          group: groupValue,
          items: [],
          totalAmount: 0,
        };
      }

      grouped[groupValue].items.push({
        product: item.product,
        quantity: item.quantity,
        total: item.total,
      });

      grouped[groupValue].totalAmount += Number(item.total || 0);
    });

    return Object.values(grouped);
  }, [rawRows, groupBy]);

  const totalGeneral = useMemo(() => {
    return rawRows.reduce((acc, item) => acc + Number(item.total || 0), 0);
  }, [rawRows]);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        field: "products",

        headerName: "Productos",

        flex: 2.2,

        minWidth: 450,

        sortable: false,

        renderCell: (params) => (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              padding: "10px 0",
            }}
          >
            {params.row.items.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: "8px 0",

                  borderBottom: "1px solid #f1f1f1",
                }}
              >
                {item.product}
              </div>
            ))}
          </div>
        ),
      },

      {
        field: "quantities",

        headerName: "Cantidades",

        width: 150,

        sortable: false,

        renderCell: (params) => (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              padding: "10px 0",

              fontWeight: 700,
            }}
          >
            {params.row.items.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: "8px 0",

                  borderBottom: "1px solid #f1f1f1",
                }}
              >
                {item.quantity}
              </div>
            ))}
          </div>
        ),
      },

      {
        field: "totals",

        headerName: "Totales",

        width: 190,

        sortable: false,

        renderCell: (params) => (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              padding: "10px 0",

              fontWeight: 700,
              color: "#0f766e",
            }}
          >
            {params.row.items.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: "8px 0",

                  borderBottom: "1px solid #f1f1f1",
                }}
              >
                {`Bs ${Number(item.total || 0).toLocaleString("es-BO", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
              </div>
            ))}
          </div>
        ),
      },
    ];

    if (!groupBy) {
      return baseColumns;
    }

    return [
      {
        field: "group",

        headerName:
          groupBy === "seller"
            ? "Vendedor"
            : groupBy === "line"
            ? "Línea"
            : groupBy === "brand"
            ? "Marca"
            : "Sucursal",

        flex: 1,

        minWidth: 260,

        sortable: false,

        renderCell: (params) => (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-start",

              paddingTop: 14,

              fontWeight: 700,
              color: "#111827",
            }}
          >
            {params.value}
          </div>
        ),
      },

      ...baseColumns,

      {
        field: "generalTotal",

        headerName: "Total General",

        width: 220,

        sortable: false,

        renderCell: (params) => (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",

              paddingTop: 14,

              fontWeight: 800,
              fontSize: 16,

              color: "#065f46",
            }}
          >
            {`Bs ${Number(params.row.totalAmount || 0).toLocaleString("es-BO", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
          </div>
        ),
      },
    ];
  }, [groupBy]);

  return (
    <Wrapper>
      <Header>
        <UserMenu isOpen={menuOpen} setIsOpen={setMenuOpen} />

        <Title>Matriz de Ventas</Title>

        <AddButton onClick={() => setOpenFilters(true)}>Filtros</AddButton>
      </Header>

      <Content>
        <GroupBar>
          <GroupButton $active={groupBy === ""} onClick={() => setGroupBy("")}>
            General
          </GroupButton>

          <GroupButton
            $active={groupBy === "seller"}
            onClick={() => setGroupBy("seller")}
          >
            Vendedores
          </GroupButton>

          <GroupButton
            $active={groupBy === "line"}
            onClick={() => setGroupBy("line")}
          >
            Líneas
          </GroupButton>

          <GroupButton
            $active={groupBy === "brand"}
            onClick={() => setGroupBy("brand")}
          >
            Marcas
          </GroupButton>

          <GroupButton
            $active={groupBy === "branch"}
            onClick={() => setGroupBy("branch")}
          >
            Sucursales
          </GroupButton>
        </GroupBar>

        <TableWrapper>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 20, 50]}
            getRowHeight={() => "auto"}
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

                display: "flex",

                alignItems: "stretch",

                py: 0,
              },

              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#fafafa",
              },

              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid #ececec",
              },
            }}
          />
        </TableWrapper>

        <div
          style={{
            marginTop: 18,

            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              background: "white",

              border: "1px solid #e5e7eb",

              borderRadius: 18,

              padding: "18px 24px",

              minWidth: 280,

              boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
            }}
          >
              <TotalText $bold>TOTAL:</TotalText>
              <TotalText>
                {" "}
                {`Bs ${Number(totalGeneral || 0).toLocaleString("es-BO", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
              </TotalText>
          </div>
        </div>
      </Content>

      <KardexFiltersModal
        groupBy={groupBy}
        open={openFilters}
        onClose={() => setOpenFilters(false)}
        onGenerate={(data) => {
          setRawRows(data);

          setOpenFilters(false);
        }}
      />
    </Wrapper>
  );
}
