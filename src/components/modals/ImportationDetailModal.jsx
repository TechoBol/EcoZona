import { X, Download } from "lucide-react";
import { exportImportationPDF } from "../pdf/generarImportationPDF";
import {
    ModalOverlay, ModalContent, ModalTitle, CloseButton,
    InfoRow, InfoLabel, InfoValue, Section, SectionTitle,
    StatusBadge, ProductTable, ProductTableHead,
    ProductTableBody, ProductTableWrapper, TotalRow, SaveButton,
} from "../ui/Importation";

export default function ImportationDetailModal({ open, onClose, importation, loading }) {
    if (!open) return null;

    const total = importation?.items?.reduce(
        (sum, item) => sum + item.quantity * item.unitCost, 0
    ) ?? 0;

    const handleExportPDF = () => exportImportationPDF(importation);

    return (
        <ModalOverlay>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}>
                    <X size={18} />
                </CloseButton>

                <ModalTitle>Detalle de importación</ModalTitle>

                {loading || !importation ? (
                    <p style={{ textAlign: "center", color: "#aaa", fontSize: 14 }}>
                        Cargando...
                    </p>
                ) : (
                    <>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px", marginBottom: 20 }}>
                            <InfoRow>
                                <InfoLabel>Código</InfoLabel>
                                <InfoValue>{importation.code}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>Tipo</InfoLabel>
                                <StatusBadge status={importation.type}>
                                    {importation.type === "MANUAL" ? "Manual" : "Excel"}
                                </StatusBadge>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>Empleado</InfoLabel>
                                <InfoValue>
                                    {importation.employee
                                        ? `${importation.employee.name} ${importation.employee.lastName}`
                                        : "-"}
                                </InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>Ubicación</InfoLabel>
                                <InfoValue>{importation.location?.name ?? "-"}</InfoValue>
                            </InfoRow>
                            <InfoRow>
                                <InfoLabel>Fecha</InfoLabel>
                                <InfoValue>
                                    {new Date(importation.createdAt).toLocaleDateString("es-BO")}
                                </InfoValue>
                            </InfoRow>
                        </div>

                        {importation.items && importation.items.length > 0 && (
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
                                                    <td style={{ color: "#888", fontSize: 12 }}>{item.product.barcode}</td>
                                                    <td>{item.product.name}</td>
                                                    <td>{item.quantity} unid.</td>
                                                    <td>Bs {item.unitCost}</td>
                                                    <td>Bs {(item.quantity * item.unitCost).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                            <TotalRow>
                                                <td
                                                    colSpan={4}
                                                    style={{ textAlign: "right", whiteSpace: "nowrap" }}
                                                >
                                                    Total
                                                </td>
                                                <td style={{ whiteSpace: "nowrap", minWidth: "120px" }}>
                                                    Bs. {total.toFixed(2)}
                                                </td>
                                            </TotalRow>
                                        </ProductTableBody>
                                    </ProductTable>
                                </ProductTableWrapper>
                            </Section>
                        )}
                        <div style={{
                            position: "absolute", top: 14, right: 14,
                            display: "flex", alignItems: "center", gap: 8
                        }}>
                            <button
                                onClick={handleExportPDF}
                                title="Exportar PDF"
                                style={{
                                    width: 36, height: 36,
                                    borderRadius: "50%",
                                    border: "none",
                                    background: "#FFFFFF",
                                    color: "#F20C1F",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    cursor: "pointer",
                                }}
                            >
                                <Download size={16} />
                            </button>

                            <button
                                onClick={onClose}
                                style={{
                                    width: 36, height: 36,
                                    borderRadius: "50%",
                                    border: "none",
                                    background: "transparent",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    cursor: "pointer",
                                }}
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </>
                )}
            </ModalContent>
        </ModalOverlay>
    );
}