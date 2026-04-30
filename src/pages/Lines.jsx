import { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Delete } from "@mui/icons-material";
import { ArrowLeft, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useLines } from "../hooks/useLine";
import CreateLineModal from "../components/modals/CreateLineModal";
import ConfirmDeleteModal from "../components/modals/ConfirmDeleteModal";

import { Wrapper, Header, Title, Content, Actions, AddButton } from "../components/ui/Location";
import { BackButton } from "../components/ui/Product";

export default function Lines() {
  const { lines, createLine, updateLine, deleteLine, isLoading } = useLines();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "" });
  const [deleteId, setDeleteId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const columns = [
    { field: "name", headerName: "Nombre", flex: 1, minWidth: 160 },
    {
      field: "actions",
      headerName: "Acciones",
      width: 140,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px", gap: 40, width: "100%" }}>
          <Edit
            size={18}
            style={{ cursor: "pointer", color: "#22c55e" }}
            onClick={() => {
              setForm({ name: params.row.name });
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
        <BackButton onClick={() => navigate("/inventory", { replace: true })}>
          <ArrowLeft size={22} />
        </BackButton>
        <Title>Líneas</Title>
      </Header>

      <Content>
        <Actions>
          <AddButton onClick={() => { setForm({ name: "" }); setIsEdit(false); setOpen(true); }}>
            + Nueva línea
          </AddButton>
        </Actions>

        <div style={{ height: 450, background: "white", borderRadius: 12 }}>
          <DataGrid
            rows={lines}
            columns={columns}
            getRowId={(row) => row.id}
            pageSizeOptions={[5, 10]}
            slots={{ toolbar: GridToolbar }}
            slotProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 300 } } }}
            sx={{
              border: "1px solid #eee",
              "& .MuiDataGrid-columnHeaders": { backgroundColor: "#f8f9ff", fontWeight: 600 },
              "& .MuiDataGrid-toolbarContainer": { padding: "10px" },
              "& .MuiInputBase-root": { borderRadius: "12px", backgroundColor: "#f5f5f5", paddingLeft: "8px" },
              "& .MuiDataGrid-columnHeaderTitle": { fontWeight: "bold" },
            }}
          />
        </div>
      </Content>

      <CreateLineModal
        open={open}
        onClose={() => { setOpen(false); setIsEdit(false); }}
        form={form}
        setForm={setForm}
        isEdit={isEdit}
        isLoading={isLoading}
        onSubmit={async (data) => {
          if (isEdit) await updateLine(editId, data);
          else await createLine(data);
          setForm({ name: "" });
          setIsEdit(false);
          setOpen(false);
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