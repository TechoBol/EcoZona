import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  SaveButton,
} from "../ui/Location";

import styled from "styled-components";

const DangerButton = styled(SaveButton)`
  background: #e53935;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>¿Eliminar sucursal?</ModalTitle>

        <p style={{ fontSize: 14, color: "#555" }}>
          Esta acción no se puede deshacer.
        </p>

        <Actions>
          <SaveButton onClick={onClose}>
            Cancelar
          </SaveButton>

          <DangerButton onClick={onConfirm}>
            Eliminar
          </DangerButton>
        </Actions>
      </ModalContent>
    </ModalOverlay>
  );
}