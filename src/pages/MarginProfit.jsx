import React, { useMemo, useState } from "react";
import {
  Wrapper,
  Header,
  Title,
  Content,
  Actions,
  AddButton,
  FiltersRow,
  FilterInput,
  FilterButtonGroup,
  FilterButton,
} from "../components/ui/Location";
import UserMenu from "../components/menus/UserMenu";
import useInventory from "../hooks/useInventory";
import { useLines } from "../hooks/useLine";
import { useProduct } from "../hooks/useProduct";
import { DataGrid } from "@mui/x-data-grid";
import { GridToolbar } from "@mui/x-data-grid/internals";
import socket from "../services/SocketIOConnection";

export default function MarginProfit() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [editingDiscounts, setEditingDiscounts] = useState({});
  const [selectedBrandId, setSelectedBrandId] = useState("all");

  const [editingBossDiscounts, setEditingBossDiscounts] = useState({});

  const { products, isLoading } = useInventory();

  const { lines } = useLines();

  const { updateMargen } = useProduct();

  ////////////////////////////////////////////////////
  // COSTO + IVA
  ////////////////////////////////////////////////////

  const calculateCostWithIva = (unitCost) => {
    return Number(unitCost || 0) * 1.1494;
  };

  ////////////////////////////////////////////////////
  // FILTROS
  ////////////////////////////////////////////////////

  const brandFilters = useMemo(() => {
    return [
      { id: "all", name: "TODOS" },

      ...lines.map((line) => ({
        id: line.id,
        name: line.name,
      })),
    ];
  }, [lines]);

  ////////////////////////////////////////////////////
  // ROWS
  ////////////////////////////////////////////////////

  const rows = useMemo(() => {
    return products.map((product) => {
      const unitCost = Number(product.price || 0);

      const costIva = calculateCostWithIva(unitCost);

      const profitMargin = Number(product.porcentajeGanancia || 0);

      const quantityDiscount = Number(product.quantityDiscount || 0);

      const bossDiscount = Number(product.bossDiscount || 0);

      const executivePrice = Number(product.finalPrice || 0);

      const quantityPrice = executivePrice - quantityDiscount;

      const quantityPercent =
        costIva > 0 ? ((quantityPrice - costIva) / costIva) * 100 : 0;

      const bossPrice = executivePrice - bossDiscount;

      const bossPercent =
        costIva > 0 ? ((bossPrice - costIva) / costIva) * 100 : 0;

      return {
        id: product.id,

        brandId: product.lineId,

        brand: product.line?.name ?? "Sin marca",

        line: product.brandName ?? "Sin línea",

        product: product.name,

        stock: Number(product.stockTotal || 0),

        unitCost,

        costIva,

        profitMargin,

        executivePrice,

        quantityDiscount,

        quantityPrice,

        quantityPercent,

        bossDiscount,

        bossPrice,

        bossPercent,
      };
    });
  }, [products]);
  ////////////////////////////////////////////////////
  // FILTRADO
  ////////////////////////////////////////////////////

  const filteredRows = useMemo(() => {
    const value = search.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesBrand =
        selectedBrandId === "all" || row.brandId === Number(selectedBrandId);

      const matchesSearch =
        !value ||
        [row.brand, row.line, row.product]
          .join(" ")
          .toLowerCase()
          .includes(value);

      return matchesBrand && matchesSearch;
    });
  }, [rows, search, selectedBrandId]);

  ////////////////////////////////////////////////////
  // UPDATE
  ////////////////////////////////////////////////////

  const handleProcessRowUpdate = async (newRow, oldRow) => {
    try {
      ////////////////////////////////////////////////////
      // VALORES
      ////////////////////////////////////////////////////

      const profitMargin = Number(newRow.profitMargin || 0);

      const quantityDiscount =
        editingDiscounts[newRow.id] !== undefined
          ? Number(editingDiscounts[newRow.id])
          : Number(newRow.quantityDiscount || 0);

      const bossDiscount =
        editingBossDiscounts[newRow.id] !== undefined
          ? Number(editingBossDiscounts[newRow.id])
          : Number(newRow.bossDiscount || 0);

      ////////////////////////////////////////////////////
      // VALIDACIONES
      ////////////////////////////////////////////////////

      if (
        Number.isNaN(profitMargin) ||
        Number.isNaN(quantityDiscount) ||
        Number.isNaN(bossDiscount)
      ) {
        return oldRow;
      }

      ////////////////////////////////////////////////////
      // PRECIO EJECUTIVO
      ////////////////////////////////////////////////////

      const executivePrice = Math.round(
        Number(newRow.costIva || 0) * (1 + profitMargin / 100),
      );

      ////////////////////////////////////////////////////
      // +5 UNIDADES
      ////////////////////////////////////////////////////

      const quantityPrice = executivePrice - quantityDiscount;

      const quantityPercent =
        Number(newRow.costIva || 0) > 0
          ? ((quantityPrice - Number(newRow.costIva || 0)) /
              Number(newRow.costIva || 0)) *
            100
          : 0;

      ////////////////////////////////////////////////////
      // JEFE
      ////////////////////////////////////////////////////

      const bossPrice = executivePrice - bossDiscount;

      const bossPercent =
        Number(newRow.costIva || 0) > 0
          ? ((bossPrice - Number(newRow.costIva || 0)) /
              Number(newRow.costIva || 0)) *
            100
          : 0;

      ////////////////////////////////////////////////////
      // BACKEND
      ////////////////////////////////////////////////////

      const response = await updateMargen(newRow.id, {
        porcentajeGanancia: profitMargin,
        quantityDiscount,
        bossDiscount,
      });

      socket.emit("updateProductMargin", response.product);

      ////////////////////////////////////////////////////
      // LIMPIAR ESTADOS TEMPORALES
      ////////////////////////////////////////////////////

      setEditingDiscounts((prev) => {
        const copy = { ...prev };

        delete copy[newRow.id];

        return copy;
      });

      setEditingBossDiscounts((prev) => {
        const copy = { ...prev };

        delete copy[newRow.id];

        return copy;
      });

      ////////////////////////////////////////////////////
      // RETURN
      ////////////////////////////////////////////////////

      return {
        ...newRow,

        profitMargin,

        executivePrice,

        quantityDiscount,
        quantityPrice,
        quantityPercent,

        bossDiscount,
        bossPrice,
        bossPercent,
      };
    } catch (error) {
      console.error(error);

      return oldRow;
    }
  };

  // verificacion de porcentajes para el cambio de color por celdas
  const getPercentCellClassName = (params) => {
    const percent = Number(params.value || 0);
    if (percent < 30) return "percent-cell-danger";
    if (percent < 80) return "percent-cell-warning";
    return "percent-cell-success";
  };

  ////////////////////////////////////////////////////
  // COLUMNAS
  ////////////////////////////////////////////////////

  const columns = useMemo(
    () => [
      {
        field: "brand",
        headerName: "Marca",
        flex: 1,
        minWidth: 150,
      },

      {
        field: "line",
        headerName: "Categoría",
        flex: 1,
        minWidth: 180,
      },

      {
        field: "product",
        headerName: "Producto",
        flex: 2,
        minWidth: 300,
      },

      {
        field: "stock",
        headerName: "Stock",
        type: "number",
        flex: 0.7,
        minWidth: 100,
      },

      {
        field: "unitCost",
        headerName: "Costo",
        flex: 1,
        minWidth: 120,
        valueFormatter: (params) => formatMoney(params),
      },

      {
        field: "costIva",
        headerName: "Costo + IVA",
        flex: 1,
        minWidth: 130,
        valueFormatter: (params) => formatMoney(params),
      },

      {
        field: "profitMargin",
        headerName: "% Utilidad",
        editable: true,
        flex: 0.8,
        minWidth: 120,
        cellClassName: getPercentCellClassName,
        valueFormatter: (params) => formatPercent(params),
      },

      {
        field: "executivePrice",
        headerName: "Precio Ejecutivo",
        flex: 1,
        minWidth: 150,
        valueFormatter: (params) => formatMoney(params),
      },

      {
        field: "quantityPercent",
        headerName: "%",
        flex: 0.8,
        minWidth: 100,
        cellClassName: getPercentCellClassName,
        valueFormatter: (params) => formatPercent(params),
      },

      {
        field: "quantityPrice",
        headerName: "Precio +5 Unidades",
        flex: 1,
        minWidth: 170,
        editable: true,
        valueFormatter: (params) => formatMoney(params),
        renderEditCell: (params) => {
          return (
            <input
              type="number"
              defaultValue={params.row.quantityDiscount}
              autoFocus
              onChange={(e) => {
                setEditingDiscounts((prev) => ({
                  ...prev,

                  [params.id]: Number(e.target.value),
                }));
              }}
              onBlur={() => {
                params.api.stopCellEditMode({
                  id: params.id,

                  field: "quantityPrice",
                });
              }}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                outline: "none",
                padding: "0 8px",
              }}
            />
          );
        },
      },

      {
        field: "bossPercent",
        headerName: "%",
        flex: 0.8,
        minWidth: 100,
        cellClassName: getPercentCellClassName,
        valueFormatter: (params) => formatPercent(params),
      },

      {
        field: "bossPrice",
        headerName: "Precio Jefe",
        flex: 1,
        minWidth: 150,
        editable: true,
        valueFormatter: (params) => formatMoney(params),
        renderEditCell: (params) => {
          return (
            <input
              type="number"
              defaultValue={params.row.bossDiscount}
              autoFocus
              onChange={(e) => {
                setEditingBossDiscounts((prev) => ({
                  ...prev,

                  [params.id]: Number(e.target.value),
                }));
              }}
              onBlur={() => {
                params.api.stopCellEditMode({
                  id: params.id,

                  field: "bossPrice",
                });
              }}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                outline: "none",
                padding: "0 8px",
              }}
            />
          );
        },
      },
    ],
    [],
  );
  const formatMoney = (value) => Number(value || 0).toFixed(2);

  const formatPercent = (value) => `${Number(value || 0).toFixed(2)}%`;
  return (
    <Wrapper>
      <Header>
        <UserMenu isOpen={menuOpen} setIsOpen={setMenuOpen} />
        <Title>Margenes y Utilidades</Title>
      </Header>
      <FiltersRow>
        <FilterInput
          placeholder="Buscar producto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </FiltersRow>
      <FilterButtonGroup>
        {brandFilters.map((brand) => (
          <FilterButton
            key={brand.id}
            type="button"
            $active={selectedBrandId === brand.id}
            onClick={() => setSelectedBrandId(brand.id)}
          >
            {brand.name}
          </FilterButton>
        ))}
      </FilterButtonGroup>
      <div style={{ height: "70vh", background: "white", borderRadius: 12 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row.id}
          slots={{ toolbar: GridToolbar }}
          processRowUpdate={handleProcessRowUpdate}
          onProcessRowUpdateError={(error) => console.error(error)}
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
            "& .percent-cell-danger": {
              backgroundColor: "#ffe5e5",
              color: "#d32f2f",
            },

            "& .percent-cell-warning": {
              backgroundColor: "#fff4db",
              color: "#f57c00",
            },

            "& .percent-cell-success": {
              backgroundColor: "#e8f5e9",
              color: "#2e7d32",
            },
          }}
        />
      </div>
    </Wrapper>
  );
}
