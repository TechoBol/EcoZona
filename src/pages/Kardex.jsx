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
  const [menuOpen, setMenuOpen] =
    useState(false);

  const [openFilters, setOpenFilters] =
    useState(true);

  const [rawRows, setRawRows] =
    useState([]);

  const [groupBy, setGroupBy] =
    useState("");

  const rows = useMemo(() => {
    if (!groupBy) {
      return rawRows.map((item) => ({
        id: item.id,
        name: item.product,
        quantity: Number(
          item.quantity || 0,
        ),
        total: Number(item.total || 0),
      }));
    }

    const grouped = {};

    rawRows.forEach((item) => {
      const groupValue =
        item[groupBy] || "Sin grupo";

      if (!grouped[groupValue]) {
        grouped[groupValue] = {
          id: `${groupBy}-${groupValue}`,
          name: groupValue,
          quantity: 0,
          total: 0,
        };
      }

      grouped[groupValue].quantity +=
        Number(item.quantity || 0);

      grouped[groupValue].total +=
        Number(item.total || 0);
    });

    return Object.values(grouped);
  }, [rawRows, groupBy]);

  const totalGeneral = useMemo(() => {
    return rows.reduce(
      (acc, item) =>
        acc + Number(item.total || 0),
      0,
    );
  }, [rows]);

  const firstColumnTitle =
    groupBy === "seller"
      ? "Vendedor"
      : groupBy === "line"
        ? "Línea"
        : groupBy === "brand"
          ? "Marca"
          : groupBy === "branch"
            ? "Sucursal"
            : "Producto";

  const columns = useMemo(() => {
    return [
      {
        field: "name",

        headerName: firstColumnTitle,

        flex: 1.8,

        minWidth: 320,

        sortable: false,

        renderCell: (params) => (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: "#111827",
                lineHeight: 1.4,
              }}
            >
              {String(params.value).toUpperCase()}
            </div>

            {groupBy && (
              <div
                style={{
                  fontSize: 13,
                  color: "#0f766e",
                }}
              >
               
              </div>
            )}
          </div>
        ),
      },

      {
        field: "quantity",

        headerName: "Cantidad",

        width: 160,

        type: "number",

        sortable: false,

        renderCell: (params) => (
          <div
            style={{
              fontSize: 14,
              color: "#111827",
              width: "100%",
            }}
          >
            {params.value}
          </div>
        ),
      },

      {
        field: "total",

        headerName: "Total Vendido",

        width: 210,

        type: "number",

        sortable: false,

        renderCell: (params) => (
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#0f766e",
              width: "100%",
            }}
          >
            {`Bs ${Number(
              params.value || 0,
            ).toLocaleString(
              "es-BO",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )}`}
          </div>
        ),
      },
    ];
  }, [groupBy, firstColumnTitle]);

  return (
    <Wrapper>
      <Header>
        <UserMenu
          isOpen={menuOpen}
          setIsOpen={setMenuOpen}
        />

        <Title>
          Matriz de Ventas
        </Title>

        <AddButton
          onClick={() =>
            setOpenFilters(true)
          }
        >
          Filtros
        </AddButton>
      </Header>

      <Content>
        <GroupBar>
          <GroupButton
            $active={groupBy === ""}
            onClick={() =>
              setGroupBy("")
            }
          >
            General
          </GroupButton>

          <GroupButton
            $active={
              groupBy === "seller"
            }
            onClick={() =>
              setGroupBy("seller")
            }
          >
            Vendedores
          </GroupButton>

          <GroupButton
            $active={
              groupBy === "line"
            }
            onClick={() =>
              setGroupBy("line")
            }
          >
            Líneas
          </GroupButton>

          <GroupButton
            $active={
              groupBy === "brand"
            }
            onClick={() =>
              setGroupBy("brand")
            }
          >
            Marcas
          </GroupButton>

          <GroupButton
            $active={
              groupBy === "branch"
            }
            onClick={() =>
              setGroupBy("branch")
            }
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
            pageSizeOptions={[
              10,
              20,
              50,
            ]}
            getRowHeight={() => 74}
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

              fontFamily:
                "inherit",

              backgroundColor:
                "white",

              "& .MuiDataGrid-columnHeaders":
                {
                  backgroundColor:
                    "#f8fafc",

                  borderBottom:
                    "1px solid #ececec",

                  minHeight:
                    "58px !important",

                  maxHeight:
                    "58px !important",
                },

              "& .MuiDataGrid-columnHeader":
                {
                  padding:
                    "0 18px",
                },

              "& .MuiDataGrid-columnHeaderTitle":
                {
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#111827",
                },

              "& .MuiDataGrid-row":
                {
                  backgroundColor:
                    "white",

                  transition:
                    "all 0.2s ease",
                },

              "& .MuiDataGrid-row:hover":
                {
                  backgroundColor:
                    "#fafafa",
                },

              "& .MuiDataGrid-cell":
                {
                  borderBottom:
                    "1px solid #f3f4f6",

                  display: "flex",

                  alignItems:
                    "center",

                  padding:
                    "0 18px",

                  fontSize: 14,

                  color: "#111827",

                  outline: "none !important",
                },

              "& .MuiDataGrid-footerContainer":
                {
                  borderTop:
                    "1px solid #ececec",

                  minHeight: 56,
                },

              "& .MuiTablePagination-root":
                {
                  fontSize: 14,
                },
            }}
          />
        </TableWrapper>

        <TotalBar>
          <TotalText $bold>
            Total General
          </TotalText>

          <TotalText >
            {`Bs ${Number(
              totalGeneral || 0,
            ).toLocaleString(
              "es-BO",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )}`}
          </TotalText>
        </TotalBar>
      </Content>

      <KardexFiltersModal
        groupBy={groupBy}
        open={openFilters}
        onClose={() =>
          setOpenFilters(false)
        }
        onGenerate={(data) => {
          setRawRows(data);

          setOpenFilters(false);
        }}
      />
    </Wrapper>
  );
}