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

  const round = (value) => Number(value.toFixed(2));

  const rows = useMemo(() => {
    if (!groupBy) {
      return rawRows.map((item) => ({
        id: item.id,

        name: item.product,

        quantity: Number(item.quantity || 0),

        quantityDetail: item.quantityDetail || "",

        price: Number(item.price || 0),

        finalPrice: item.finalPrice || "",

        subtotal: Number(item.subtotal || 0),

        subtotalDetail: item.subtotalDetail || "",

        discount: Number(item.discount || 0),

        total: Number(item.total || 0),

        details: item.details || [],
      }));
    }

    const grouped = {};

    ////////////////////////////////////////////////////////////
    // 🔥 AGRUPAR VENDEDORES
    ////////////////////////////////////////////////////////////

    if (groupBy === "seller") {
      rawRows.forEach((item) => {
        (item.sellers || []).forEach((seller) => {
          const sellerName = seller.name || "Sin vendedor";

          if (!grouped[sellerName]) {
            grouped[sellerName] = {
              id: `seller-${sellerName}`,

              name: sellerName,

              quantity: 0,

              subtotal: 0,

              discount: 0,

              total: 0,
            };
          }

          grouped[sellerName].quantity += Number(seller.quantity || 0);

          grouped[sellerName].subtotal = round(
            grouped[sellerName].subtotal + Number(seller.subtotal || 0),
          );

          grouped[sellerName].discount = round(
            grouped[sellerName].discount + Number(seller.discount || 0),
          );

          grouped[sellerName].total = round(
            grouped[sellerName].total + Number(seller.total || 0),
          );
        });
      });

      return Object.values(grouped);
    }

    ////////////////////////////////////////////////////////////
    // 🔥 AGRUPACIONES NORMALES
    ////////////////////////////////////////////////////////////

    rawRows.forEach((item) => {
      const groupValue = item[groupBy] || "Sin grupo";

      if (!grouped[groupValue]) {
        grouped[groupValue] = {
          id: `${groupBy}-${groupValue}`,

          name: groupValue,

          quantity: 0,

          subtotal: 0,

          discount: 0,

          total: 0,
        };
      }

      grouped[groupValue].quantity += Number(item.quantity || 0);

      grouped[groupValue].subtotal = round(
        grouped[groupValue].subtotal + Number(item.subtotal || 0),
      );

      grouped[groupValue].discount = round(
        grouped[groupValue].discount + Number(item.discount || 0),
      );

      grouped[groupValue].total = round(
        grouped[groupValue].total + Number(item.total || 0),
      );
    });

    return Object.values(grouped);
  }, [rawRows, groupBy]);
  const totalGeneral = useMemo(() => {
    return Number(
      rows
        .reduce((acc, item) => acc + Number(item.subtotal || 0), 0)
        .toFixed(2),
    );
  }, [rows]);

  const totalDiscount = useMemo(() => {
    return Number(
      rows
        .reduce((acc, item) => acc + Number(item.discount || 0), 0)
        .toFixed(2),
    );
  }, [rows]);

  const totalNeto = useMemo(() => {
    return Number((totalGeneral - totalDiscount).toFixed(2));
  }, [totalGeneral, totalDiscount]);

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
    const columns = [
      {
        field: "name",
        headerName: firstColumnTitle,
        flex: 1.8,
        minWidth: 320,
        sortable: true,
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
          </div>
        ),
      },

      {
        field: "quantity",
        headerName: "Cantidad",
        width: 160,
        sortable: true,
        renderCell: (params) => (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              lineHeight: 1.3,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {params.row.quantity}
            </div>

            {!groupBy && params.row.quantityDetail && (
              <div
                style={{
                  fontSize: 12,
                  color: "#64748b",
                }}
              >
                {params.row.quantityDetail}
              </div>
            )}
          </div>
        ),
      },
    ];

    if (groupBy === "") {
      columns.push(
        {
          field: "price",
          headerName: "Precio",
          width: 170,
          type: "number",
          sortable: true,
          renderCell: (params) => (
            <div
              style={{
                fontSize: 14,
                color: "#64748b",
                width: "100%",
              }}
            >
              {`Bs ${Number(params.value || 0).toLocaleString("es-BO", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
            </div>
          ),
        },

        {
          field: "finalPrice",
          headerName: "Precio Venta",
          width: 220,
          sortable: true,
          renderCell: (params) => (
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                fontSize: 14,
                fontWeight: 600,
                color: "#111827",
                lineHeight: 1.4,
                whiteSpace: "normal",
              }}
            >
              {params.value}
            </div>
          ),
        },
      );
    }

    columns.push(
      {
        field: "subtotal",
        headerName: "Subtotal",
        width: 220,
        sortable: true,
        renderCell: (params) => (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              lineHeight: 1.3,
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: "#64748b",
                fontWeight: 700,
              }}
            >
              {`Bs ${Number(params.value || 0).toLocaleString("es-BO", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
            </div>

            {!groupBy && params.row.subtotalDetail && (
              <div
                style={{
                  fontSize: 12,
                  color: "#94a3b8",
                }}
              >
                {params.row.subtotalDetail}
              </div>
            )}
          </div>
        ),
      },

      {
        field: "discount",
        headerName: "Descuento",
        width: 180,
        type: "number",
        sortable: true,
        renderCell: (params) => (
          <div
            style={{
              fontSize: 14,
              color: Number(params.value) > 0 ? "#dc2626" : "#9ca3af",
              width: "100%",
            }}
          >
            {Number(params.value) > 0
              ? `- Bs ${Number(params.value).toLocaleString("es-BO", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : "—"}
          </div>
        ),
      },

      {
        field: "total",
        headerName: "Total Neto",
        width: 210,
        type: "number",
        sortable: true,
        renderCell: (params) => (
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#0f766e",
              width: "100%",
            }}
          >
            {`Bs ${Number(params.value || 0).toLocaleString("es-BO", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
          </div>
        ),
      },
    );

    return columns;
  }, [groupBy, firstColumnTitle]);

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
            getRowHeight={() => 74}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            sx={{
              border: "none",
              fontSize: 14,
              fontFamily: "inherit",
              backgroundColor: "white",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f8fafc",
                borderBottom: "1px solid #ececec",
                minHeight: "58px !important",
                maxHeight: "58px !important",
              },
              "& .MuiDataGrid-columnHeader": { padding: "0 18px" },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 700,
                fontSize: 14,
                color: "#111827",
              },
              "& .MuiDataGrid-row": {
                backgroundColor: "white",
                transition: "all 0.2s ease",
              },
              "& .MuiDataGrid-row:hover": { backgroundColor: "#fafafa" },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f3f4f6",
                display: "flex",
                alignItems: "center",
                padding: "0 18px",
                fontSize: 14,
                color: "#111827",
                outline: "none !important",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid #ececec",
                minHeight: 56,
              },
              "& .MuiTablePagination-root": { fontSize: 14 },
            }}
          />
        </TableWrapper>

        <TotalBar>
          <TotalText $bold>Subtotal</TotalText>
          <TotalText>
            {`Bs ${totalGeneral.toLocaleString("es-BO", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
          </TotalText>

          {totalDiscount > 0 && (
            <>
              <TotalText $bold style={{ color: "#dc2626" }}>
                Descuentos
              </TotalText>
              <TotalText style={{ color: "#dc2626" }}>
                {`- Bs ${totalDiscount.toLocaleString("es-BO", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
              </TotalText>
            </>
          )}

          <TotalText $bold style={{ color: "#0f766e" }}>
            Total Neto
          </TotalText>
          <TotalText style={{ color: "#0f766e", fontWeight: 700 }}>
            {`Bs ${totalNeto.toLocaleString("es-BO", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
          </TotalText>
        </TotalBar>
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
