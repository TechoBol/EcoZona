import styled from "styled-components";
import {theme} from "./Theme"

export const Wrapper = styled.div`
  min-height: 100dvh;
  background: ${theme.colors.background};
  padding: 20px;
`;

export const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center; /* centra el título */
  padding: 10px 0;
`;

/* Title */
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
/* Actions */
export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

export const AddButton = styled.button`
  height: 44px;
  padding: 0 20px;
  border-radius: 22px;
  background: ${theme.colors.primary};
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

/* Overlay */
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;

  background: rgba(0, 0, 0, 0.5);

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

/* Modal */
export const ModalContent = styled.div`
  background: ${theme.colors.background};
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

/* Modal Title */
export const ModalTitle = styled.h3`
  margin-bottom: 20px;
  padding-right: 50px;
  font-size: 20px;
  font-weight: 700;
  color: ${theme.colors.text};
`;

/* form Wrapper  */
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 10px;
`;

/* Input Custom */
export const ModalInput = styled.input`
  height: 48px;
  width: 100%;
  border-radius: 14px;
  border: 1px solid #e0e0e0;

  padding: 0 14px;
  font-size: 14px;

  outline: none;
  background: ${theme.colors.background};

  transition: all 0.2s ease;

  &:focus {
    border-color: ${theme.colors.text};
    background: ${theme.colors.background};
  }
`;

/* Select Custom */
export const ModalSelect = styled.select`
  height: 48px;
  width: 100%;
  border-radius: 14px;
  border: 1px solid #e0e0e0;

  padding: 0 12px;
  font-size: 14px;

  background: ${theme.colors.background};;
  cursor: pointer;

  &:focus {
    border-color: ${theme.colors.text};
    background: ${theme.colors.background};
  }
`;

/* Save Button */
export const SaveButton = styled.button`
  margin-top: 20px;
  height: 50px;
  border-radius: 25px;

  background: ${theme.colors.primary};
  color: ${theme.colors.background};

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

/* Close Button */
export const CloseButton = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;

  width: 36px;
  height: 36px;

  border-radius: 50%;
  border: none;

  background: transparent;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    background: transparent;
  }

  &:active {
    transform: scale(0.9);
  }
`;