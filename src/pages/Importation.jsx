import { useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Plus, Eye } from "lucide-react";
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

export default function ImportationsPage() {
    const {
        importations,
        loading,
        getImportationById,
        selectedImportation,
        loadingDetail,
    } = useImportation({ fetchOnMount: true });

    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);

    const columns = [
        {
            field: "code",
            headerName: "Código",
            disableColumnMenu: true,
            flex: 1,
            minWidth: 140,
        },
        {
            field: "type",
            headerName: "Tipo",
            disableColumnMenu: true,
            flex: 1,
            minWidth: 120,
            renderCell: ({ value }) => {
                if (value === "MANUAL") return (
                    <span style={{
                        background: "#40459420",
                        color: "#404594",
                        padding: "3px 10px",
                        borderRadius: "12px",
                        fontWeight: 600,
                        fontSize: "0.8rem"
                    }}>
                        Manual
                    </span>
                );
                if (value === "EXCEL") return (
                    <span style={{
                        background: "#319B3420",
                        color: "#319B34",
                        padding: "3px 10px",
                        borderRadius: "12px",
                        fontWeight: 600,
                        fontSize: "0.8rem"
                    }}>
                        Excel
                    </span>
                );
                return value;
            },
        },
        {
            field: "employee",
            headerName: "Empleado",
            disableColumnMenu: true,
            flex: 1,
            minWidth: 120,
            renderCell: ({ value }) =>
                value ? `${value.name} ${value.lastName}` : "-",
        },
        {
            field: "location",
            headerName: "Ubicación",
            disableColumnMenu: true,
            flex: 1,
            minWidth: 120,
            renderCell: ({ value }) => value?.name ?? "-",
        },
        {
            field: "createdAt",
            headerName: "Fecha",
            disableColumnMenu: true,
            flex: 1,
            minWidth: 150,
            renderCell: ({ value }) =>
                new Date(value).toLocaleDateString("es-BO"),
        },
        {
            field: "actions",
            headerName: "Acciones",
            width: 100,
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
                        width: "100%",
                    }}
                >
                    <Eye
                        size={18}
                        style={{
                            cursor: "pointer",
                            color: "#3b82f6",
                        }}
                        onClick={async () => {
                            await getImportationById(params.row.id);
                            setOpenDetail(true);
                        }}
                    />
                </div>
            ),
        },
    ];

    return (
        <Wrapper>
            <Header>
                <UserMenu
                    isOpen={menuOpen}
                    setIsOpen={setMenuOpen}
                />

                <Title>Importaciones</Title>

                <ButtonGroup>
                    <AddButton onClick={() => navigate("/new-importation")}>
                        <Plus size={18} />
                    </AddButton>
                </ButtonGroup>
            </Header>

            <Content>
                <div
                    style={{
                        height: 450,
                        background: "white",
                        borderRadius: 12,
                    }}
                >
                    <DataGrid
                        rows={importations}
                        columns={columns}
                        loading={loading}
                        getRowId={(row) => row.id}
                        pageSizeOptions={[5, 10]}
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

            <ImportationDetailModal
                open={openDetail}
                onClose={() => setOpenDetail(false)}
                importation={selectedImportation}
                loading={loadingDetail}
            />
        </Wrapper>
    );
}