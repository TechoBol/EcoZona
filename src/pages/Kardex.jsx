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
  DetailButton,
  DetailPopoverCard,
  DetailPopoverTitle,
  DetailPopoverTable,
  DetailPopoverHead,
  DetailPopoverRow,
  DetailMuted,
} from "../components/ui/Kardex";

import { DataGrid } from "@mui/x-data-grid";
import { ChevronDown } from "lucide-react";
import Popover from "@mui/material/Popover";
import { usePermissions } from "../hooks/usePermissions";

export default function Kardex() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFilters, setOpenFilters] = useState(true);
  const [rawRows, setRawRows] = useState([]);
  const [groupBy, setGroupBy] = useState("");

  const [detailAnchor, setDetailAnchor] = useState(null);
  const [selectedDetailRow, setSelectedDetailRow] = useState(null);
  const { canManageKardexUtil } = usePermissions();
  const round = (value) => Number(value.toFixed(2));

  // helpers
  const formatBs = (value) =>
    `Bs ${Number(value || 0).toLocaleString("es-BO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  const getLastFinalPrice = (item) => {
    const details = item.details || [];
    if (details.length > 0) {
      const lastDetail = details[details.length - 1];
      return Number(lastDetail.finalPrice || item.finalPrice || 0);
    }
    return Number(item.finalPrice || 0);
  };
  const handleOpenDetail = (event, row) => {
    setDetailAnchor(event.currentTarget);
    setSelectedDetailRow(row);
  };
  const handleCloseDetail = () => {
    setDetailAnchor(null);
    setSelectedDetailRow(null);
  };

  const rows = useMemo(() => {
    ////////////////////////////////////////////////////////////
    // 🔥 GENERAL
    ////////////////////////////////////////////////////////////

    if (!groupBy) {
      return rawRows.map((item) => {
        const quantity = Number(item.quantity || 0);
        const price = Number(item.price || 0);
        const finalPrice = getLastFinalPrice(item);

        const totalCost = quantity * price;

        const utilityTotal = Number(item.subtotal || 0) - totalCost;

        const utilityUnit = quantity > 0 ? utilityTotal / quantity : 0;

        return {
          id: item.id,
          name: item.product,
          quantity,
          barcode: item.barcode,
          quantityDetail: item.quantityDetail || "",
          price,
          totalCost,
          finalPrice,
          utility: utilityUnit,
          utilityTotal,
          subtotal: Number(item.subtotal || 0),
          subtotalDetail: item.subtotalDetail || "",
          discount: Number(item.discount || 0),
          total: Number(item.total || 0),
          details: item.details || [],
        };
      });
    }

    ////////////////////////////////////////////////////////////
    // 🔥 GROUPED
    ////////////////////////////////////////////////////////////

    const grouped = {};

    ////////////////////////////////////////////////////////////
    // 🔥 VENDEDORES
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
    // 🔥 FECHAS
    ////////////////////////////////////////////////////////////

    if (groupBy === "date") {
      rawRows.forEach((item) => {
        (item.dates || []).forEach((dateItem) => {
          const date = dateItem.date || "Sin fecha";

          if (!grouped[date]) {
            grouped[date] = {
              id: `date-${date}`,

              name: date,

              quantity: 0,

              subtotal: 0,

              discount: 0,

              total: 0,
            };
          }

          grouped[date].quantity += Number(dateItem.quantity || 0);

          grouped[date].subtotal = round(
            grouped[date].subtotal + Number(dateItem.subtotal || 0),
          );

          grouped[date].discount = round(
            grouped[date].discount + Number(dateItem.discount || 0),
          );

          grouped[date].total = round(
            grouped[date].total + Number(dateItem.total || 0),
          );
        });
      });

      return Object.values(grouped).sort((a, b) => {
        const [dayA, monthA, yearA] = a.name.split("/");

        const [dayB, monthB, yearB] = b.name.split("/");

        const dateA = new Date(`${yearA}-${monthA}-${dayA}`);

        const dateB = new Date(`${yearB}-${monthB}-${dayB}`);

        return dateB - dateA;
      });
    }

    ////////////////////////////////////////////////////////////
    // 🔥 MESES
    ////////////////////////////////////////////////////////////

    if (groupBy === "month") {
      rawRows.forEach((item) => {
        (item.dates || []).forEach((dateItem) => {
          const month = dateItem.month || "Sin mes";

          if (!grouped[month]) {
            grouped[month] = {
              id: `month-${month}`,
              name: month,
              quantity: 0,
              subtotal: 0,
              discount: 0,
              total: 0,
            };
          }

          grouped[month].quantity += Number(dateItem.quantity || 0);

          grouped[month].subtotal = round(
            grouped[month].subtotal + Number(dateItem.subtotal || 0),
          );

          grouped[month].discount = round(
            grouped[month].discount + Number(dateItem.discount || 0),
          );

          grouped[month].total = round(
            grouped[month].total + Number(dateItem.total || 0),
          );
        });
      });

      const monthMap = {
        ENERO: 0,
        FEBRERO: 1,
        MARZO: 2,
        ABRIL: 3,
        MAYO: 4,
        JUNIO: 5,
        JULIO: 6,
        AGOSTO: 7,
        SEPTIEMBRE: 8,
        OCTUBRE: 9,
        NOVIEMBRE: 10,
        DICIEMBRE: 11,
      };

      return Object.values(grouped).sort((a, b) => {
        const [monthA, , yearA] = a.name.split(" ");
        const [monthB, , yearB] = b.name.split(" ");

        const dateA = new Date(Number(yearA), monthMap[monthA.toUpperCase()]);

        const dateB = new Date(Number(yearB), monthMap[monthB.toUpperCase()]);

        return dateB - dateA;
      });
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

  const totalUtility = useMemo(() => {
    return Number(
      rows
        .reduce((acc, item) => acc + Number(item.utilityTotal || 0), 0)
        .toFixed(2),
    );
  }, [rows]);

  const totalCostGeneral = useMemo(() => {
    return Number(
      rows
        .reduce((acc, item) => acc + Number(item.totalCost || 0), 0)
        .toFixed(2),
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
      : groupBy === "date"
      ? "Fecha"
      : groupBy === "month"
      ? "Mes"
      : "Producto";

  const columns = useMemo(() => {
    const columns = [];

    ////////////////////////////////////////////////////////
    // CODIGO DE BARRAS SOLO EN GENERAL
    ////////////////////////////////////////////////////////

    if (groupBy === "") {
      columns.push({
        field: "barcode",
        headerName: "Código",
        width: 180,
        sortable: true,
        renderCell: (params) => (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              fontWeight: 600,
            }}
          >
            {params.value || "-"}
          </div>
        ),
      });
    }

    ////////////////////////////////////////////////////////
    // NOMBRE
    ////////////////////////////////////////////////////////

    columns.push(
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
              {String(params.value || "").toUpperCase()}
            </div>
          </div>
        ),
      },

      {
        field: "quantity",
        headerName: "Cantidad",
        width: 140,
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
          </div>
        ),
      },
    );

    ////////////////////////////////////////////////////////
    // COLUMNAS DE GENERAL
    ////////////////////////////////////////////////////////

    if (groupBy === "") {
      if (canManageKardexUtil) {
        columns.push(
          {
            field: "price",
            headerName: "Costo unit.",
            width: 140,
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
            field: "totalCost",
            headerName: "Costo Total",
            width: 160,
            sortable: true,
            renderCell: (params) => (
              <div
                style={{
                  fontSize: 14,
                  color: "#64748b",
                  width: "100%",
                  fontWeight: 600,
                }}
              >
                {formatBs(params.value)}
              </div>
            ),
          },
          {
            field: "finalPrice",
            headerName: "Precio Venta",
            width: 160,
            sortable: true,
            renderCell: (params) => (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {formatBs(params.value)}
              </div>
            ),
          },

          {
            field: "utility",
            headerName: "Utilidad",
            width: 160,
            sortable: true,
            renderCell: (params) => (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#64748b",
                }}
              >
                {formatBs(params.value)}
              </div>
            ),
          },

          {
            field: "utilityPercent",
            headerName: "% Utilidad",
            width: 150,
            sortable: true,
            valueGetter: (_, row) => {
              const cost = Number(row.price || 0);
              const sale = Number(row.finalPrice || 0);

              if (!cost) return 0;

              return ((sale - cost) / cost) * 100;
            },
            renderCell: (params) => {
              const value = Number(params.value || 0);

              let color = "#dc2626";

              if (value >= 80) color = "#16a34a";
              else if (value >= 30) color = "#ca8a04";

              return (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    color,
                  }}
                >
                  {value.toFixed(2)}%
                </div>
              );
            },
          },

          {
            field: "utilityTotal",
            headerName: "Utilidad Total",
            width: 180,
            sortable: true,
            renderCell: (params) => (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {formatBs(params.value)}
              </div>
            ),
          },
        );
      } else {
        columns.push({
          field: "finalPrice",
          headerName: "Precio Venta",
          width: 160,
          sortable: true,
          renderCell: (params) => (
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                fontSize: 14,
                fontWeight: 700,
                color: "#111827",
              }}
            >
              {formatBs(params.value)}
            </div>
          ),
        });
      }

      columns.push({
        field: "details",
        headerName: "Detalle",
        width: 160,
        sortable: false,
        renderCell: (params) => {
          const details = params.row.details || [];

          if (details.length <= 1) {
            return <DetailMuted>Sin desglose</DetailMuted>;
          }

          return (
            <DetailButton
              type="button"
              onClick={(event) => handleOpenDetail(event, params.row)}
            >
              {details.length} precios
              <ChevronDown size={15} />
            </DetailButton>
          );
        },
      });
    }

    ////////////////////////////////////////////////////////
    // TOTALES
    ////////////////////////////////////////////////////////

    columns.push(
      {
        field: "subtotal",
        headerName: "Subtotal",
        width: 150,
      },
      {
        field: "discount",
        headerName: "Descuento",
        width: 150,
      },
      {
        field: "total",
        headerName: "Total",
        width: 150,
      },
    );

    return columns;
  }, [groupBy, firstColumnTitle, canManageKardexUtil]);

  console.log({
    cost: totalCostGeneral,
    utility: totalUtility,
    subtotal: totalGeneral,
    discount: totalDiscount,
    total: totalNeto,
  });

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
            Marcas
          </GroupButton>
          <GroupButton
            $active={groupBy === "brand"}
            onClick={() => setGroupBy("brand")}
          >
            Líneas
          </GroupButton>
          <GroupButton
            $active={groupBy === "branch"}
            onClick={() => setGroupBy("branch")}
          >
            Sucursales
          </GroupButton>
          <GroupButton
            $active={groupBy === "date"}
            onClick={() => setGroupBy("date")}
          >
            Fechas
          </GroupButton>

          <GroupButton
            $active={groupBy === "month"}
            onClick={() => setGroupBy("month")}
          >
            Meses
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
          <Popover
            open={Boolean(detailAnchor)}
            anchorEl={detailAnchor}
            onClose={handleCloseDetail}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  borderRadius: "16px",
                  boxShadow: "none",
                  background: "transparent",
                },
              },
            }}
          >
            {selectedDetailRow && (
              <DetailPopoverCard>
                <DetailPopoverTitle>Detalle de venta</DetailPopoverTitle>

                <DetailPopoverTable>
                  <DetailPopoverHead>
                    <span>Precio venta</span>
                    <span style={{ textAlign: "center" }}>Cantidad</span>
                    <span style={{ textAlign: "right" }}>Subtotal</span>
                  </DetailPopoverHead>

                  {[...(selectedDetailRow.details || [])]
                    .reverse()
                    .map((detail, index) => (
                      <DetailPopoverRow key={index}>
                        <span>{formatBs(detail.finalPrice)}</span>

                        <span style={{ textAlign: "center" }}>
                          {detail.quantity}
                        </span>

                        <span style={{ textAlign: "right" }}>
                          {formatBs(detail.subtotal)}
                        </span>
                      </DetailPopoverRow>
                    ))}
                </DetailPopoverTable>
              </DetailPopoverCard>
            )}
          </Popover>
        </TableWrapper>

        <TotalBar>
          {groupBy === "" && canManageKardexUtil && (
            <>
              <TotalText $bold>Costo Total: </TotalText>
              <TotalText>{formatBs(totalCostGeneral)}</TotalText>

              <TotalText $bold style={{ color: "#16a34a" }}>
                Total Utilidad:
              </TotalText>

              <TotalText style={{ color: "#16a34a" }}>
                {`Bs ${totalUtility.toLocaleString("es-BO", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
              </TotalText>
            </>
          )}
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
            Total
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
