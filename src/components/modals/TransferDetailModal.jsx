import { useState } from "react";
import { X } from "lucide-react";

import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  FormGroup,
  SaveButton,
  CloseButton,
  StatusBadge,
  InfoRow,
  InfoLabel,
  InfoValue,
  Section,
  SectionTitle,
  ProductsBox,
  ProductItem,
  ProductTop,
  ProductMeta,
  TotalContainer,
  RejectTextarea,
  ActionsRow,
} from "../ui/Location";

import { usePermissions } from "../../hooks/usePermissions";
import { errorToast, successToast } from "../../services/toasts";

const getStatusLabel = (status) => {
  switch (status) {
    case "PENDING": return "Pendiente";
    case "APPROVED": return "Aprobado";
    case "REJECTED": return "Rechazado";
    default: return status;
  }
};

export default function TransferDetailModal({
  open,
  onClose,
  transfer,
  onApprove,
  onReject,
}) {
  const [reason, setReason] = useState("");

  const permissions = usePermissions();

  // 🔐 permisos
  const canApproveReject = permissions.canApproveTransfers;

  if (!open || !transfer) return null;

  const handleApprove = async () => {
    try {
      await onApprove(transfer.id);
      successToast("Transferencia aprobada");
      onClose();
    } catch (error) {
      errorToast(error?.response?.data?.message || error?.message || "Error al aprobar la transferencia");
    }
  };

  const handleReject = async () => {
    try {
      await onReject(transfer.id, reason);
      successToast("Transferencia rechazada");
      onClose();
    } catch (error) {
      errorToast(error?.response?.data?.message || error?.message || "Error al rechazar la transferencia");
    }
  };

  // 💰 total
  const total =
    transfer.items?.reduce(
      (acc, item) => acc + item.quantity * (item.product?.finalPrice || 0),
      0,
    ) || 0;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent style={{ width: 500 }} onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <X size={18} />
        </CloseButton>

        <ModalTitle>Detalle de transferencia</ModalTitle>

        <FormGroup>
          <InfoRow>
            <InfoLabel>Código:</InfoLabel>
            <InfoValue>
              {transfer.transferCode || `TR-${transfer.id}`}
            </InfoValue>
          </InfoRow>

          <InfoRow>
            <InfoLabel>Origen:</InfoLabel>
            <InfoValue>{transfer.fromLocation?.name || "Sin origen"}</InfoValue>
          </InfoRow>

          <InfoRow>
            <InfoLabel>Destino:</InfoLabel>
            <InfoValue>{transfer.toLocation?.name || "Sin destino"}</InfoValue>
          </InfoRow>

          <InfoRow>
            <InfoLabel>Fecha solicitud:</InfoLabel>
            <InfoValue>
              {new Date(transfer.createdAt).toLocaleString()}
            </InfoValue>
          </InfoRow>

          <InfoRow>
            <InfoLabel>Estado:</InfoLabel>
            <StatusBadge status={transfer.status}>
              {getStatusLabel(transfer.status)}
            </StatusBadge>
          </InfoRow>

          <Section>
            <SectionTitle>Información</SectionTitle>

            <InfoRow>
              <InfoLabel>Solicitado por:</InfoLabel>
              <InfoValue>
                {transfer.requestedBy
                  ? `${transfer.requestedBy.name} ${transfer.requestedBy.lastName}`
                  : "Desconocido"}
              </InfoValue>
            </InfoRow>

            {transfer.approvedBy && (
              <InfoRow>
                <InfoLabel>Aprobado por:</InfoLabel>
                <InfoValue>
                  {`${transfer.approvedBy.name} ${transfer.approvedBy.lastName}`}
                </InfoValue>
              </InfoRow>
            )}

            {transfer.approvedAt && (
              <InfoRow>
                <InfoLabel>Fecha aprobación:</InfoLabel>
                <InfoValue>
                  {new Date(transfer.approvedAt).toLocaleString()}
                </InfoValue>
              </InfoRow>
            )}
            {transfer.rejectionReason && (
              <InfoRow>
                <InfoLabel>Motivo:</InfoLabel>
                <InfoValue>{transfer.rejectionReason}</InfoValue>
              </InfoRow>
            )}
          </Section>

          {/* PRODUCTOS */}
          <Section>
            <SectionTitle>Productos</SectionTitle>

            <ProductsBox>
              {transfer.items?.map((item) => (
                <ProductItem key={item.id}>
                  <ProductTop>
                    <span>{item.product?.name}</span>
                    <span>x{item.quantity}</span>
                  </ProductTop>

                  <ProductMeta>
                    {item.product?.brandName || "Sin línea"} •{" "}
                    {item.product?.line?.name || "Sin marca"}
                  </ProductMeta>

                  <ProductMeta>Código: {item.product?.barcode}</ProductMeta>
                </ProductItem>
              ))}
            </ProductsBox>
          </Section>

          {/* TOTAL */}
          <TotalContainer>
            <span>Total estimado</span>
            <span>
              Bs.{" "}
              {transfer.items?.reduce(
                (acc, item) =>
                  acc + item.quantity * (item.product?.finalPrice || 0),
                0,
              )}
            </span>
          </TotalContainer>

          {/* ACCIONES */}
          {transfer.status === "PENDING" && canApproveReject && (
            <>
              <RejectTextarea
                placeholder="Motivo de rechazo (opcional)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />

              <ActionsRow>
                <SaveButton
                  style={{ background: "#27ae60" }}
                  onClick={handleApprove}
                >
                  Aprobar
                </SaveButton>

                <SaveButton
                  style={{ background: "#e74c3c" }}
                  onClick={handleReject}
                >
                  Rechazar
                </SaveButton>
              </ActionsRow>
            </>
          )}
        </FormGroup>
      </ModalContent>
    </ModalOverlay>
  );
}
