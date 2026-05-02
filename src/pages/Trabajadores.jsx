import { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Delete } from "@mui/icons-material";
import { Edit, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useEmployees } from "../hooks/useEmployees";
import CreateEmployeeModal from "../components/modals/CreateEmployeeModal";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";

import { Wrapper, Header, Title, Content } from "../components/ui/Location";
import UserMenu from "../components/menus/UserMenu";
import { Actions, AddButton } from "../components/ui/Location";
import { BackButton } from "../components/ui/Product";
import { useRoles } from "../hooks/useRoles";
import { useSucursales } from "../hooks/useSucursales";
import { useLoginStore } from "../components/store/loginStore";
import { FiltersRow, FilterInput } from "../components/ui/Location";
import socket from "../services/SocketIOConnection";
import { usePermissions } from "../hooks/usePermissions";

export default function Employees() {
  const navigate = useNavigate();
  const { roles } = useRoles();
  const { data: locations } = useSucursales();
  const { data, createEmployee, updateEmployee, deleteEmployee } =
    useEmployees();

  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    roleId: "",
    locationId: "",
    password: "",
  });

  const rows = (data || [])
    .map((emp) => ({
      ...emp,
      roleName: emp.role?.name || "",
      locationName: emp.location?.name || "",
    }))
    .filter((emp) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        emp.name?.toLowerCase().includes(q) ||
        emp.lastName?.toLowerCase().includes(q) ||
        emp.email?.toLowerCase().includes(q) ||
        emp.roleName?.toLowerCase().includes(q) ||
        emp.locationName?.toLowerCase().includes(q)
      );
    });
  const { role } = useLoginStore();

  const permissions = usePermissions();

  const canEdit =
    permissions.canManageEmployees && !permissions.isReadOnly;
    
  const columns = [
    {
      field: "name",
      disableColumnMenu: true,
      headerName: "Nombre",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "lastName",
      disableColumnMenu: true,
      headerName: "Apellido",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "email",
      disableColumnMenu: true,
      headerName: "Email",
      flex: 1,
      minWidth: 200,
    },

    {
      field: "roleName",
      disableColumnMenu: true,
      headerName: "Rol",
      width: 200,
    },
    {
      field: "locationName",
      disableColumnMenu: true,
      headerName: "Ubicación",
      width: 200,
    },
    canEdit
      ? {
          field: "actions",
          headerName: "Acciones",
          width: 140,
          sortable: false,
          filterable: false,
          disableColumnMenu: true,
          align: "center",
          headerAlign: "center",
          renderCell: (params) => (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 16,
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
                    lastName: params.row.lastName,
                    email: params.row.email || "",
                    roleId: params.row.role?.id || "",
                    locationId: params.row.location?.id || "",
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
        <UserMenu isOpen={menuOpen} setIsOpen={setMenuOpen} />
        <Title>Trabajadores</Title>
      </Header>

      <Content>
        <Actions>
          {canEdit && (
            <AddButton
              onClick={() => {
                setForm({
                  name: "",
                  lastName: "",
                  email: "",
                  roleId: "",
                  locationId: "",
                  password: "",
                });
                setIsEdit(false);
                setOpen(true);
              }}
            >
              + Nuevo empleado
            </AddButton>
          )}
        </Actions>
        <FiltersRow>
          <FilterInput
            placeholder="Buscar por nombre, email, rol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </FiltersRow>
        <div style={{ height: 500, background: "white", borderRadius: 12 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
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
              },
            }}
          />
        </div>
      </Content>

      <CreateEmployeeModal
        open={open}
        onClose={() => {
          setOpen(false);
          setIsEdit(false);
        }}
        form={form}
        setForm={setForm}
        isEdit={isEdit}
        roles={roles}
        locations={locations}
        onSubmit={async (data) => {
          let newEmployee;
          if (isEdit) {
            newEmployee = await updateEmployee(editId, data);
          } else {
            newEmployee = await createEmployee(data);
          }
          socket.emit("createEmployee", newEmployee);
          setOpen(false);
          setIsEdit(false);
        }}
      />

      <ConfirmDeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={async () => {
          await deleteEmployee(deleteId);
          setOpenDelete(false);
        }}
      />
    </Wrapper>
  );
}
