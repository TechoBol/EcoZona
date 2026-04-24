import styled from "styled-components";

export const Wrapper = styled.div`
  min-height: 100vh;
  background: #f7f8fc;
  padding: 20px;
`;

export const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center; /* centra el título */
  padding: 10px 0;
`;

/* TITLE */
export const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  font-family: var(--font-title);
`;

export const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 5px 100px 5px;
`;
/* ACTIONS */
export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

export const AddButton = styled.button`
  height: 44px;
  padding: 0 20px;
  border-radius: 22px;
  background: #404594;
  color: white;
  border: none;
  font-weight: 600;
  cursor: pointer;

  box-shadow: 0 4px 10px rgba(64, 69, 148, 0.25);

  &:hover {
    opacity: 0.95;
  }

  &:active {
    transform: scale(0.97);
  }
`;

/* OVERLAY */
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;

  background: rgba(0, 0, 0, 0.45);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 1000;

  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

/* MODAL */
export const ModalContent = styled.div`
  background: #ffffff;
  padding: 30px 25px 25px 25px;
  border-radius: 20px;
  width: 360px;
  position: relative;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  animation: scaleIn 0.2s ease;

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

/* TITLE */
export const ModalTitle = styled.h3`
  margin-bottom: 20px;
  padding-right: 50px;
  font-size: 20px;
  font-weight: 700;
  color: #000;
`;

/* FORM WRAPPER 🔥 (CLAVE PARA ESPACIADO) */
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px; /* 🔥 separación real entre inputs */
  margin-bottom: 10px;
`;

/* INPUT CUSTOM (NO AFECTA A LOS DEMÁS) */
export const ModalInput = styled.input`
  height: 48px;
  width: 100%;
  border-radius: 14px;
  border: 1px solid #e0e0e0;

  padding: 0 14px;
  font-size: 14px;

  outline: none;
  background: #fafafa;

  transition: all 0.2s ease;

  &:focus {
    border-color: #404594;
    background: #fff;
  }
`;

/* SELECT CUSTOM */
export const ModalSelect = styled.select`
  height: 48px;
  width: 100%;
  border-radius: 14px;
  border: 1px solid #e0e0e0;

  padding: 0 12px;
  font-size: 14px;

  background: #fafafa;
  cursor: pointer;

  &:focus {
    border-color: #404594;
    background: #fff;
  }
`;

/* BOTÓN GUARDAR */
export const SaveButton = styled.button`
  margin-top: 20px;
  height: 50px;
  border-radius: 25px;

  background: #404594;
  color: white;

  border: none;
  font-size: 16px;
  font-weight: 600;

  cursor: pointer;

  width: 100%;

  box-shadow: 0 4px 12px rgba(64, 69, 148, 0.3);

  &:active {
    transform: scale(0.97);
  }
`;

/* BOTÓN CERRAR */
export const CloseButton = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;

  width: 36px;
  height: 36px;

  border-radius: 50%;
  border: none;

  background: #f2f2f2;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    background: #e6e6e6;
  }

  &:active {
    transform: scale(0.9);
  }
`;