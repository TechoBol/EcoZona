import { useState } from "react";

import UserMenu from "../components/menus/UserMenu";

import KardexFiltersModal from "../components/modals/KardexFiltersModal";

import {
  Wrapper,
  Header,
  Title,
  Content,
  AddButton,
} from "../components/ui/Kardex";

import { DataGrid } from "@mui/x-data-grid";

export default function Kardex() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [openFilters, setOpenFilters] =
    useState(true);

  const [rows, setRows] = useState([]);

  const columns = [
    {
      field: "seller",
      headerName: "Vendedor",
      flex: 1,
    },

    {
      field: "total",
      headerName: "Total",
      width: 160,
    },
  ];

  return (
    <Wrapper>
      <Header>
        <UserMenu
          isOpen={menuOpen}
          setIsOpen={setMenuOpen}
        />

        <Title>Matriz de Ventas</Title>

        <AddButton
          onClick={() => setOpenFilters(true)}
        >
          Filtros
        </AddButton>
      </Header>

      <Content>
        <div
          style={{
            height: 700,
            background: "white",
            borderRadius: 14,
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
          />
        </div>
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