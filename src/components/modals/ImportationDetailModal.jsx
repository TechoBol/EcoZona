import { useState } from "react";
import { X, Download, CheckCircle, XCircle } from "lucide-react";
import { exportImportationPDF } from "../pdf/generarImportationPDF";
import {
    ModalOverlay, ModalContent, ModalTitle, CloseButton,
    InfoRow, InfoLabel, InfoValue, Section, SectionTitle,
    StatusBadge, ProductTable, ProductTableHead,
    ProductTableBody, ProductTableWrapper, TotalRow, SaveButton,
} from "../ui/Importation";

// ── Badge de estado ───────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    DRAFT:     { label: "Borrador", bg: "#F3F4F6",             color: "#6B7280" },
    APPROVED:  { label: "Aprobado", bg: "rgba(49,155,52,.12)", color: "#319B34" },
    CANCELLED: { label: "Cancelado", bg: "rgba(242,12,31,.10)", color: "#F20C1F" },
};

const StatusPill = ({ status }) => {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.DRAFT;
    return (
        <span style={{
            background: cfg.bg, color: cfg.color,
            padding: "3px 12px", borderRadius: 12,
            fontWeight: 600, fontSize: "0.78rem",
        }}>
            {cfg.label}
        </span>
    );
};

// ── Diálogo de confirmación ───────────────────────────────────────────────────
const ConfirmDialog = ({ action, onConfirm, onCancel, loading }) => {
    const isApprove = action === "APPROVED";
    return (
        <div style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.45)",
            borderRadius: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 10,
        }}>
            <div style={{
                background: "#fff", borderRadius: 14,
                padding: "28px 32px", maxWidth: 320, width: "90%",
                textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            }}>
                <div style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: isApprove ? "rgba(49,155,52,.1)" : "rgba(242,12,31,.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px",
                }}>
                    {isApprove
                        ? <CheckCircle size={26} color="#319B34" />
                        : <XCircle size={26} color="#F20C1F" />
                    }
                </div>
                <p style={{ fontWeight: 700, fontSize: 15, margin: "0 0 8px", color: "#0D0D0D" }}>
                    {isApprove ? "¿Aprobar importación?" : "¿Cancelar importación?"}
                </p>
                <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 24px", lineHeight: 1.5 }}>
                    {isApprove
                        ? "Se aplicará el stock y costos al inventario. Esta acción no se puede deshacer."
                        : "La importación quedará cancelada y no podrá editarse ni aprobarse."}
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        style={{
                            flex: 1, padding: "10px 0", borderRadius: 10,
                            border: "1px solid #e5e7eb", background: "#fff",
                            fontWeight: 600, fontSize: 13, cursor: "pointer", color: "#6B7280",
                        }}
                    >
                        Volver
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        style={{
                            flex: 1, padding: "10px 0", borderRadius: 10, border: "none",
                            background: isApprove ? "#319B34" : "#F20C1F",
                            color: "#fff", fontWeight: 600, fontSize: 13,
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? "Procesando..." : isApprove ? "Sí, aprobar" : "Sí, cancelar"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Modal principal ───────────────────────────────────────────────────────────
export default function ImportationDetailModal({
    open,
    onClose,
    importation,
    loading,
    loadingStatus,
    onChangeStatus,
}) {
    const [confirmAction, setConfirmAction] = useState(null);

    if (!open) return null;

    const total = importation?.items?.reduce(
        (sum, item) => sum + item.quantity * item.unitCost, 0
    ) ?? 0;

    const isDraft = importation?.status === "DRAFT";

    const handleConfirm = async () => {
        if (!confirmAction) return;
        await onChangeStatus(importation.id, confirmAction);
        setConfirmAction(null);
    };

    return (
        <ModalOverlay>
            <ModalContent onClick={(e) => e.stopPropagation()} style={{ position: "relative" }}>

                {/* Diálogo de confirmación encima del contenido */}
                {confirmAction && (
                    <ConfirmDialog
                        action={confirmAction}
                        onConfirm={handleConfirm}
                        onCancel={() => setConfirmAction(null)}
                        loading={loadingStatus}
                    />
                )}

                {/* Botones top-right */}
                <div style={{
                    position: "absolute", top: 14, right: 14,
                    display: "flex", alignItems: "center", gap: 8,
                }}>
                    {importation && (
                        <button
                            onClick={() => exportImportationPDF(importation)}
                            title="Exportar PDF"
                            style={{
                                width: 36, height: 36, borderRadius: "50%",
                                border: "none", background: "#fff", color: "#F20C1F",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer",
                            }}
                        >
                            <Download size={16} />
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        style={{
                            width: 36, height: 36, borderRadius: "50%",
                            border: "none", background: "transparent",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer",
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                <ModalTitle>Detalle de importación</ModalTitle>

                {loading || !importation ? (
                    <p style={{ textAlign: "center", color: "#aaa", fontSize: 14 }}>
                        Cargando...
                    </p>
                ) : (
                    <>
                        {/* Info general */}
                        <div style={{
                            display: "grid", gridTemplateColumns: "1fr 1fr",
                            gap: "6px 24px", marginBottom: 20,
                        }}>
                            <InfoRow>
                                <InfoLabel>Código</InfoLabel>
                                <InfoValue>{importation.code}</InfoValue>
                            </InfoRow>

                            <InfoRow>
                                <InfoLabel>Estado</InfoLabel>
                                <StatusPill status={importation.status} />
                            </InfoRow>

                            <InfoRow>
                                <InfoLabel>Tipo</InfoLabel>
                                <StatusBadge status={importation.type}>
                                    {importation.type === "MANUAL" ? "Manual" : "Excel"}
                                </StatusBadge>
                            </InfoRow>

                            <InfoRow>
                                <InfoLabel>Ubicación</InfoLabel>
                                <InfoValue>{importation.location?.name ?? "-"}</InfoValue>
                            </InfoRow>

                            {/* Creación */}
                            <InfoRow>
                                <InfoLabel>Creado por</InfoLabel>
                                <InfoValue>
                                    {importation.employee
                                        ? `${importation.employee.name} ${importation.employee.lastName}`
                                        : "-"}
                                </InfoValue>
                            </InfoRow>

                            <InfoRow>
                                <InfoLabel>Fecha creación</InfoLabel>
                                <InfoValue>
                                    {new Date(importation.createdAt).toLocaleDateString("es-BO")}
                                </InfoValue>
                            </InfoRow>

                            {/* Resolución — solo si ya fue aprobada o cancelada */}
                            {importation.resolvedBy && (
                                <>
                                    <InfoRow>
                                        <InfoLabel>
                                            {importation.status === "APPROVED" ? "Aprobado por" : "Cancelado por"}
                                        </InfoLabel>
                                        <InfoValue>
                                            {`${importation.resolvedBy.name} ${importation.resolvedBy.lastName}`}
                                        </InfoValue>
                                    </InfoRow>

                                    <InfoRow>
                                        <InfoLabel>
                                            {importation.status === "APPROVED" ? "Fecha aprobación" : "Fecha cancelación"}
                                        </InfoLabel>
                                        <InfoValue>
                                            {new Date(importation.resolvedAt).toLocaleDateString("es-BO")}
                                        </InfoValue>
                                    </InfoRow>
                                </>
                            )}
                        </div>

                        {/* Tabla de productos */}
                        {importation.items?.length > 0 && (
                            <Section>
                                <SectionTitle>Productos ({importation.items.length})</SectionTitle>
                                <ProductTableWrapper>
                                    <ProductTable>
                                        <ProductTableHead>
                                            <tr>
                                                <th>Código</th>
                                                <th>Nombre</th>
                                                <th>Cantidad</th>
                                                <th>Costo unit.</th>
                                                <th>Subtotal</th>
                                            </tr>
                                        </ProductTableHead>
                                        <ProductTableBody>
                                            {importation.items.map((item) => (
                                                <tr key={item.id}>
                                                    <td style={{ color: "#888", fontSize: 12 }}>
                                                        {item.product.barcode}
                                                    </td>
                                                    <td>{item.product.name}</td>
                                                    <td>{item.quantity} unid.</td>
                                                    <td>Bs {item.unitCost}</td>
                                                    <td>Bs {(item.quantity * item.unitCost).toFixed(4)}</td>
                                                </tr>
                                            ))}
                                            <TotalRow>
                                                <td colSpan={4} style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                                                    Total
                                                </td>
                                                <td style={{ whiteSpace: "nowrap", minWidth: 120 }}>
                                                    Bs. {total.toFixed(4)}
                                                </td>
                                            </TotalRow>
                                        </ProductTableBody>
                                    </ProductTable>
                                </ProductTableWrapper>
                            </Section>
                        )}

                        {/* Botones de acción — solo DRAFT */}
                        {isDraft && (
                            <div style={{
                                display: "flex", gap: 10, marginTop: 20,
                            }}>
                                <button
                                    onClick={() => setConfirmAction("CANCELLED")}
                                    disabled={loadingStatus}
                                    style={{
                                        flex: 1, padding: "11px 0", borderRadius: 10,
                                        border: "1px solid #F20C1F", background: "transparent",
                                        color: "#F20C1F", fontWeight: 600, fontSize: 13,
                                        cursor: "pointer",
                                    }}
                                >
                                    Cancelar importación
                                </button>
                                <button
                                    onClick={() => setConfirmAction("APPROVED")}
                                    disabled={loadingStatus}
                                    style={{
                                        flex: 1, padding: "11px 0", borderRadius: 10,
                                        border: "none", background: "#319B34",
                                        color: "#fff", fontWeight: 600, fontSize: 13,
                                        cursor: "pointer",
                                    }}
                                >
                                    Aprobar importación
                                </button>
                            </div>
                        )}
                    </>
                )}
            </ModalContent>
        </ModalOverlay>
    );
}