import { useState } from "react";
import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  FormGroup,
  SaveButton,
  CloseButton,
  StatusBadge,
} from "../ui/Location";

import { X } from "lucide-react";
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
export default function TransferDetailModal({
  open,
  onClose,
  transfer,
  onApprove,
  onReject,
}) {
  const [reason, setReason] = useState("");

  if (!open || !transfer) return null;

  const handleApprove = () => {
    onApprove(transfer.id);
    onClose();
  };

  const handleReject = () => {
    onReject(transfer.id, reason);
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent
        style={{ width: 500 }}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton onClick={onClose}>
          <X size={18} />
        </CloseButton>

        <ModalTitle>Detalle de transferencia</ModalTitle>

        <FormGroup>
          {/* 🔹 INFO GENERAL */}
          <div>
            <strong>Código:</strong>{" "}
            {transfer.transferCode || `TR-${transfer.id}`}
          </div>

          <div>
            <strong>Destino:</strong>{" "}
            {transfer.toLocation?.name || "Sin destino"}
          </div>

          <div>
            <strong>Fecha:</strong>{" "}
            {new Date(transfer.createdAt).toLocaleString()}
          </div>

          <div>
            <strong>Estado:</strong>{" "}
            <StatusBadge status={transfer.status}>
              {getStatusLabel(transfer.status)}
            </StatusBadge>
          </div>

          {/* 🔹 PRODUCTOS */}
          <div style={{ marginTop: 10 }}>
            <strong>Productos:</strong>
            <div
              style={{
                marginTop: 8,
                border: "1px solid #eee",
                borderRadius: 10,
                padding: 10,
                maxHeight: 150,
                overflowY: "auto",
              }}
            >
              {transfer.items?.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "4px 0",
                  }}
                >
                  <span>{item.product.name}</span>
                  <span>x{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 🔹 RECHAZO */}
          {transfer.status === "PENDING" && (
            <>
              <textarea
                placeholder="Motivo de rechazo (opcional)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: 70,
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  padding: 10,
                  fontSize: 13,
                }}
              />

              {/* 🔹 BOTONES */}
              <div style={{ display: "flex", gap: 10 }}>
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
              </div>
            </>
          )}
        </FormGroup>
      </ModalContent>
    </ModalOverlay>
  );
}