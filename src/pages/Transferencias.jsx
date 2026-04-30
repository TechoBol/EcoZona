import { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { PiInfoBold } from "react-icons/pi";
import { useTransfers } from "../hooks/useTransfers";
import useInventory from "../hooks/useInventory";

import CreateTransferModal from "../components/modals/CreateTransferModal";
import { useLoginStore } from "../components/store/loginStore";

import {
  Wrapper,
  Header,
  Title,
  Content,
  Actions,
  AddButton,
  StatusBadge,
} from "../components/ui/Location";

import { BackButton } from "../components/ui/Product";
import TransferDetailModal from "../components/modals/TransferDetailModal";
import { useAmazonS3 } from "../hooks/useAmazonS3";

//////////////////////////////////////////
// 🔹 LABEL STATUS
//////////////////////////////////////////
const getStatusLabel = (status) => {
  switch (status) {
    case "PENDING":
      return "Pendiente";
    case "APPROVED":
      return "Aprobado";
    case "REJECTED":
      return "Rechazado";
    default:
      return status;
  }
};

export default function Transfers() {
  const navigate = useNavigate();

  const { data, createTransfer, approveTransfer, rejectTransfer } =
    useTransfers();
  const { products: inventory } = useInventory();
  const { location } = useLoginStore();
  const { getFileUrl } = useAmazonS3();

  const [open, setOpen] = useState(false);
  const [view, setView] = useState("mine"); // 🔹 "mine" | "all"

  const [form, setForm] = useState({
    items: [],
  });

  //////////////////////////////////////////
  // 🔹 FILTRO DE VISTA
  //////////////////////////////////////////
  const filteredData = (data || []).filter((t) =>
    view === "mine"
      ? t.toLocation?.id === location?.id
      : t.toLocation?.id !== location?.id,
  );

  //////////////////////////////////////////
  // 🔹 ROWS
  //////////////////////////////////////////
  const rows = filteredData.map((t) => ({
    id: t.id,
    transferCode: t.transferCode,
    fromLocation: t.fromLocation?.name || "No asignado",
    toLocation: t.toLocation?.name || "Pendiente",
    status: t.status,
    products: t.items
      ?.map((i) => `${i.product.name} (${i.quantity})`)
      .join(", "),

    date: new Date(t.createdAt).toLocaleString(),
  }));

  //////////////////////////////////////////
  // 🔹 COLUMNS
  //////////////////////////////////////////
  const columns = [
    {
      field: "transferCode",
      headerName: "Nº",
      width: 110,
      disableColumnMenu: true,
    },
    {
      field: "products",
      headerName: "Productos",
      flex: 2,
      minWidth: 220,
      disableColumnMenu: true,
    },
    {
      field: "fromLocation",
      headerName: "Origen",
      flex: 1,
      minWidth: 130,
      disableColumnMenu: true,
    },
    {
      field: "toLocation",
      headerName: "Destino",
      flex: 1,
      minWidth: 130,
      disableColumnMenu: true,
    },
    {
      field: "date",
      headerName: "Fecha",
      flex: 1,
      minWidth: 160,
      disableColumnMenu: true,
    },
    {
      field: "status",
      headerName: "Estado",
      flex: 1,
      minWidth: 140,
      align: "center",
      disableColumnMenu: true,

      renderCell: (params) => {
        if (!params.value) return null;

        return (
          <StatusBadge status={params.value}>
            {getStatusLabel(params.value)}
          </StatusBadge>
        );
      },
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 180,
      align: "center",
      disableColumnMenu: true,

      renderCell: (params) => {
        return (
          <div style={{ display: "flex", gap: "6px" }}>
            {/* 🔹 SOLO EN MINE */}
            {view === "all" && (
              <PiInfoBold
                size={20}
                onClick={() => handleViewDetail(params.row)}
                style={{
                  cursor: "pointer",
                  marginTop: "10px",
                  color: "#f20707",
                  marginRight: "10px",
                }}
              />
            )}

            {/* 🔹 SIEMPRE */}
            <BsFillFileEarmarkPdfFill
              size={20}
              style={{ cursor: "pointer", marginTop: "10px", color: "#f20707" }}
              onClick={() => handleViewPDF(params.row.transferCode)}
            />
          </div>
        );
      },
    },
  ];
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const handleViewDetail = (row) => {
    const fullTransfer = filteredData.find((t) => t.id === row.id);
    setSelectedTransfer(fullTransfer);
    setOpenDetail(true);
  };
  const handleApprove = async (id) => {
    await approveTransfer(id, location.id);
  };

  const handleReject = async (id) => {
    await rejectTransfer(id);
  };

  const handleViewPDF = async (key) => {
    const url = await getFileUrl("ECOZONA/TRANSFERENCIAS/" + key + ".pdf");
    window.open(url, "_blank");
  };
  //////////////////////////////////////////
  // 🎨 UI
  //////////////////////////////////////////
  return (
    <Wrapper>
      <Header>
        <BackButton onClick={() => navigate("/inventory")}>
          <ArrowLeft size={22} />
        </BackButton>

        <Title>Transferencias</Title>
      </Header>

      <Content>
        <Actions>
          {/* 🔹 BOTONES DE VISTA */}
          <div style={{ display: "flex", gap: 10, marginRight: 10 }}>
            <AddButton
              style={{
                background: view === "mine" ? "#2c3e50" : "#ecf0f1",
                color: view === "mine" ? "white" : "#2c3e50",
              }}
              onClick={() => setView("mine")}
            >
              Mis solicitudes
            </AddButton>

            <AddButton
              style={{
                background: view === "all" ? "#2c3e50" : "#ecf0f1",
                color: view === "all" ? "white" : "#2c3e50",
              }}
              onClick={() => setView("all")}
            >
              Todas las transferencias
            </AddButton>
          </div>

          {/* 🔹 CREAR */}
          <AddButton
            onClick={() => {
              setForm({ items: [] });
              setOpen(true);
            }}
          >
            + Solicitar transferencia
          </AddButton>
        </Actions>

        <div
          style={{
            height: 500,
            background: "white",
            borderRadius: 12,
          }}
        >
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

      {/* 🔹 MODAL */}
      <CreateTransferModal
        open={open}
        onClose={() => setOpen(false)}
        form={form}
        setForm={setForm}
        inventory={inventory}
        location={location}
        onSubmit={async (data) => {
          await createTransfer(data);
          setOpen(false);
        }}
      />
      <TransferDetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        transfer={selectedTransfer}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </Wrapper>
  );
}
