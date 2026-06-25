import { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Pencil } from "lucide-react";
import UserMenu from "../components/menus/UserMenu";
import ImportationDetailModal from "../components/modals/ImportationDetailModal";

import { useImportation } from "../hooks/useImportation";

import {
    Wrapper,
    Header,
    Title,
    Content,
    AddButton,
    ButtonGroup,
} from "../components/ui/Importation";

// ── Badge de estado ───────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    DRAFT: { label: "Borrador", bg: "#F3F4F6", color: "#6B7280" },
    APPROVED: { label: "Aprobado", bg: "rgba(49,155,52,.12)", color: "#319B34" },
    CANCELLED: { label: "Cancelado", bg: "rgba(242,12,31,.10)", color: "#F20C1F" },
};

const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.DRAFT;
    return (
        <span style={{
            background: cfg.bg,
            color: cfg.color,
            padding: "3px 10px",
            borderRadius: 12,
            fontWeight: 600,
            fontSize: "0.78rem",
            whiteSpace: "nowrap",
        }}>
            {cfg.label}
        </span>
    );
};

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ImportationsPage() {
    const {
        importations,
        loading,
        getImportationById,
        selectedImportation,
        loadingDetail,
        loadingStatus,
        changeStatus,
        setSelectedImportation,
    } = useImportation({ fetchOnMount: true });

    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);

    const handleOpenDetail = async (id) => {
        await getImportationById(id);
        setOpenDetail(true);
    };

    const handleCloseDetail = () => {
        setOpenDetail(false);
        setSelectedImportation(null);
    };

    const columns = [
        {
            field: "code",
            headerName: "Código",
            disableColumnMenu: true,
            flex: 1,
            minWidth: 140,
        },
        {
            field: "status",
            headerName: "Estado",
            disableColumnMenu: true,
            flex: 1,
            minWidth: 120,
            renderCell: ({ value }) => <StatusBadge status={value} />,
        },
        {
            field: "type",
            headerName: "Tipo",
            disableColumnMenu: true,
            flex: 1,
            minWidth: 110,
            renderCell: ({ value }) => {
                const isManual = value === "MANUAL";
                return (
                    <span style={{
                        background: isManual ? "#40459420" : "#319B3420",
                        color: isManual ? "#404594" : "#319B34",
                        padding: "3px 10px",
                        borderRadius: 12,
                        fontWeight: 600,
                        fontSize: "0.78rem",
                    }}>
                        {isManual ? "Manual" : "Excel"}
                    </span>
                );
            },
        },
        {
            field: "employee",
            headerName: "Creado por",
            disableColumnMenu: true,
            flex: 1,
            minWidth: 140,
            renderCell: ({ value }) =>
                value ? `${value.name} ${value.lastName}` : "-",
        },
        {
            field: "resolvedBy",
            headerName: "Aprobado / Cancelado por",
            disableColumnMenu: true,
            flex: 1,
            minWidth: 190,
            renderCell: ({ value }) =>
                value ? `${value.name} ${value.lastName}` : "-",
        },
        {
            field: "createdAt",
            headerName: "Fecha creación",
            disableColumnMenu: true,
            flex: 1,
            minWidth: 140,
            renderCell: ({ value }) =>
                new Date(value).toLocaleDateString("es-BO"),
        },
        {
            field: "resolvedAt",
            headerName: "Fecha resolución",
            disableColumnMenu: true,
            flex: 1,
            minWidth: 150,
            renderCell: ({ value }) =>
                value ? new Date(value).toLocaleDateString("es-BO") : "-",
        },
        {
            field: "actions",
            headerName: "Acciones",
            width: 100,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => {
                const isDraft = params.row.status === "DRAFT";
                return (
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        marginTop: 10,
                        width: "100%",
                    }}>
                        {/* Ver detalle — siempre visible */}
                        <Eye
                            size={17}
                            style={{ cursor: "pointer", color: "#3b82f6" }}
                            onClick={() => handleOpenDetail(params.row.id)}
                        />

                        {/* Editar — solo DRAFT */}
                        {isDraft && (
                            <Pencil
                                size={16}
                                style={{ cursor: "pointer", color: "#6B7280" }}
                                onClick={() => navigate(`/edit-importation/${params.row.id}`)}
                            />
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <Wrapper>
            <Header>
                <UserMenu isOpen={menuOpen} setIsOpen={setMenuOpen} />
                <Title>Importaciones</Title>
                <ButtonGroup>
                    <AddButton onClick={() => navigate("/new-importation")}>
                        <Plus size={18} />
                    </AddButton>
                </ButtonGroup>
            </Header>

            <Content>
                <div style={{ height: "80vh", background: "white", borderRadius: 12 }}>
                    <DataGrid
                        rows={importations}
                        columns={columns}
                        loading={loading}
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
                            "& .MuiDataGrid-toolbarContainer": { padding: "10px" },
                            "& .MuiInputBase-root": {
                                borderRadius: "12px",
                                backgroundColor: "#f5f5f5",
                                paddingLeft: "8px",
                            },
                            "& .MuiDataGrid-columnHeaderTitle": { fontWeight: "bold" },
                        }}
                    />
                </div>
            </Content>

            <ImportationDetailModal
                open={openDetail}
                onClose={handleCloseDetail}
                importation={selectedImportation}
                loading={loadingDetail}
                loadingStatus={loadingStatus}
                onChangeStatus={changeStatus}
            />
        </Wrapper>
    );
}