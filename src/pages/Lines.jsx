import { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Delete } from "@mui/icons-material";
import { ArrowLeft, Edit, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useLines } from "../hooks/useLine";
import CreateLineModal from "../components/modals/CreateLineModal";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";

import {
  Wrapper,
  Header,
  Title,
  Content,
  Actions,
  AddButton,
} from "../components/ui/Location";

import { BackButton } from "../components/ui/Product";

export default function Lines() {
  const navigate = useNavigate();

  const { lines, createLine, updateLine, deleteLine, isLoading } = useLines();

  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    brands: [],
  });

  const handleNew = () => {
    setForm({
      name: "",
      brands: [],
    });

    setIsEdit(false);
    setEditId(null);
    setOpen(true);
  };

  const handleEdit = (row) => {
    setForm({
      name: row.name,
      brands: row.brands || [],
    });

    setEditId(row.id);
    setIsEdit(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);

    setForm({
      name: "",
      brands: [],
    });
  };

  const columns = [
    {
      field: "name",
      headerName: "Nombre",
      flex: 1,
      minWidth: 180,
      disableColumnMenu: true,
    },

    {
      field: "brands",
      headerName: "Marcas",
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,

      renderCell: (params) => {
        const count = params.row.brands?.length ?? 0;

        return (
          <div
            onClick={() => handleEdit(params.row)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              color: "#3d44c9",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            <Tag size={15} />
            {count} {count === 1 ? "marca" : "marcas"}
          </div>
        );
      },
    },

    {
      field: "actions",
      headerName: "Acciones",
      width: 140,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,

      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 26,
            width: "100%",
            marginTop: 10,
          }}
        >
          <Edit
            size={18}
            style={{
              cursor: "pointer",
              color: "#22c55e",
            }}
            onClick={() => handleEdit(params.row)}
          />

          <Delete
            style={{
              cursor: "pointer",
              color: "#e53935",
            }}
            onClick={() => {
              setDeleteId(params.row.id);
              setOpenDelete(true);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <Wrapper>
      <Header>
        <BackButton
          onClick={() =>
            navigate("/inventory", {
              replace: true,
            })
          }
        >
          <ArrowLeft size={22} />
        </BackButton>

        <Title>Líneas</Title>
      </Header>

      <Content>
        <Actions>
          <AddButton onClick={handleNew}>+ Nueva línea</AddButton>
        </Actions>

        <div
          style={{
            height: 500,
            background: "white",
            borderRadius: 14,
          }}
        >
          <DataGrid
            rows={lines}
            columns={columns}
            getRowId={(row) => row.id}
            pageSizeOptions={[5, 10, 20]}
            slots={{
              toolbar: GridToolbar,
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: {
                  debounceMs: 300,
                },
              },
            }}
            sx={{
              border: "1px solid #eee",

              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f8f9ff",
                fontWeight: 700,
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

      <CreateLineModal
        open={open}
        onClose={handleClose}
        form={form}
        setForm={setForm}
        isEdit={isEdit}
        isLoading={isLoading}
        onSubmit={async (data) => {
          if (isEdit) {
            await updateLine(editId, data);
          } else {
            await createLine(data);
          }

          handleClose();
        }}
      />

      <ConfirmDeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          await deleteLine(deleteId);

          setOpenDelete(false);
        }}
      />
    </Wrapper>
  );
}
