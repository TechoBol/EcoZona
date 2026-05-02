import { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Delete } from "@mui/icons-material";
import { ArrowLeft, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserMenu from "../components/menus/UserMenu";
import { useRoles } from "../hooks/useRoles";
import CreateRoleModal from "../components/modals/CreateRoleModal";
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
import socket from "../services/SocketIOConnection";

export default function Roles() {
  const navigate = useNavigate();
  const { roles, createRole, updateRole, deleteRole, isLoading } = useRoles();

  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    maxEmployeesAllowed: 1,
  });

  const columns = [
    { field: "name", headerName: "Nombre", flex: 1, minWidth: 150 },
    { field: "description", headerName: "Descripción", flex: 1, minWidth: 200 },
    {
      field: "maxEmployeesAllowed",
      headerName: "Máx empleados",
      width: 180,
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
            gap: 40,
            marginTop: "10px",
            width: "100%",
          }}
        >
          <Edit
            size={18}
            style={{ cursor: "pointer", color: "#22c55e" }}
            onClick={() => {
              setForm({
                name: params.row.name,
                description: params.row.description || "",
                maxEmployeesAllowed:
                  params.row.maxEmployeesAllowed || 1,
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
    },
  ];

  return (
    <Wrapper>
      <Header>
       <UserMenu isOpen={menuOpen} setIsOpen={setMenuOpen} />
        <Title>Roles</Title>
      </Header>

      <Content>
        <Actions>
          <AddButton
            onClick={() => {
              setForm({
                name: "",
                description: "",
                maxEmployeesAllowed: 1,
              });
              setIsEdit(false);
              setOpen(true);
            }}
          >
            + Nuevo rol
          </AddButton>
        </Actions>

        <div style={{ height: 450, background: "white", borderRadius: 12 }}>
          <DataGrid
            rows={roles}
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
}
            }}
          />
        </div>
      </Content>

      {/* MODAL */}
      <CreateRoleModal
        open={open}
        onClose={() => {
          setOpen(false);
          setIsEdit(false);
        }}
       
        form={form}
        setForm={setForm}
        isEdit={isEdit}
        onSubmit={async (data) => {
          let newRole;
          if (isEdit) {
            newRole = await updateRole(editId, data);
          } else {
            newRole =await createRole(data);
          }

          setForm({
            name: "",
            description: "",
            maxEmployeesAllowed: 1,
          });
          console.log(newRole);
          socket.emit("createRole", newRole);
          setIsEdit(false);
          setOpen(false);
        }}
         isLoading={isLoading}
      />

      {/* DELETE */}
      <ConfirmDeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          await deleteRole(deleteId);
          setOpenDelete(false);
        }}
      />
    </Wrapper>
  );
}