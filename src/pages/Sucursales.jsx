import { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Delete } from "@mui/icons-material";
import { ArrowLeft, Edit } from "lucide-react";

import { useSucursales } from "../hooks/useSucursales";
import CreateLocationModal from "../components/modals/CreateLocationModal";

import { Wrapper, Header, Title, Content } from "../components/ui/Location";

import { Actions, AddButton } from "../components/ui/Location";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";
import { BackButton } from "../components/ui/Product";
import { useNavigate } from "react-router-dom";

import { useLoginStore } from "../components/store/loginStore";
import socket from "../services/SocketIOConnection";
import { usePermissions } from "../hooks/usePermissions";

export default function Sucursales() {
  const { data, createLocation, deleteLocation, updateLocation } =
    useSucursales();

  const { role } = useLoginStore();

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    abbreviation: "",
    type: "BRANCH",
  });
  const [deleteId, setDeleteId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  // COLUMNAS
  const permissions = usePermissions();

  const canEdit = permissions.canManageBranches && !permissions.isReadOnly;
  
  const columns = [
    {
      field: "name",
      disableColumnMenu: true,
      headerName: "Nombre",
      flex: 1,
      minWidth: 160,
    },
    {
      field: "type",
      headerName: "Tipo",
      disableColumnMenu: true,
      flex: 1,
      minWidth: 130,
      renderCell: ({ value }) => {
        if (value === "BRANCH") return "Sucursal";
        if (value === "WAREHOUSE") return "Almacén";
        return value;
      },
    },
    {
      field: "abbreviation",
      disableColumnMenu: true,
      headerName: "Abrev.",
      flex: 1,
      minWidth: 120,
    },

    canEdit
      ? {
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
                marginTop: "10px",
                gap: 40,
                width: "100%",
              }}
            >
              <Edit
                size={18}
                style={{ cursor: "pointer", color: "#22c55e" }}
                onClick={() => {
                  setForm({
                    name: params.row.name,
                    abbreviation: params.row.abbreviation,
                    type: params.row.type,
                  });

                  setEditId(params.row.id);
                  setIsEdit(true);
                  setOpen(true);
                }}
              />

              <Delete
                style={{ cursor: "pointer", color: "#e53935" }}
                onClick={() => {
                  setDeleteId(params.row.id);
                  setOpenDelete(true);
                }}
              />
            </div>
          ),
        }
      : null,
  ].filter(Boolean);

  return (
    <Wrapper>
      <Header>
        <BackButton onClick={() => navigate("/inventory", { replace: true })}>
          <ArrowLeft size={22} />
        </BackButton>
        <Title>Sucursales</Title>
      </Header>

      <Content>
        <Actions>
          {canEdit && (
            <AddButton
              onClick={() => {
                setForm({
                  name: "",
                  abbreviation: "",
                  type: "BRANCH",
                });
                setOpen(true);
                setIsEdit(false);
              }}
            >
              + Nueva sucursal
            </AddButton>
          )}
        </Actions>
        <div style={{ height: 450, background: "white", borderRadius: 12 }}>
          <DataGrid
            rows={data}
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
              border: "1px solid #eee",

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
      <CreateLocationModal
        open={open}
        onClose={() => {
          setOpen(false);
          setIsEdit(false);
        }}
        form={form}
        setForm={setForm}
        isEdit={isEdit}
        onSubmit={async (data) => {
          let newLocation;
          if (isEdit) {
            newLocation = await updateLocation(editId, data);
          } else {
            newLocation = await createLocation(data);
          }

          setForm({
            name: "",
            abbreviation: "",
            type: "BRANCH",
          });
          socket.emit("createLocation", newLocation);
          setIsEdit(false);
          setOpen(false);
        }}
      />
      <ConfirmDeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          await deleteLocation(deleteId);
          setOpenDelete(false);
        }}
      />
    </Wrapper>
  );
}
