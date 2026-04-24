import styled, { createGlobalStyle } from "styled-components";

/* WRAPPER */
export const Wrapper = styled.div`
  min-height: 100vh;
  background: #f7f8fc;
  padding: 20px;
`;

/* HEADER */
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

/* FORM */
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-family: var(--font-title);
`;

/* CONTAINER INPUT */
export const ContainerInput = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

/* INPUT */
export const Input = styled.input`
  height: 45px;
  width: 100%;
  border-radius: 12px;
  border: 1px solid ${({ hasError }) =>
    hasError ? "#ff4d4f" : "#d9d9d9"};

  padding: 0 12px;
  font-size: 14px;
  outline: none;
  background: white;
  font-family: var(--font-title);

  transition: all 0.2s ease;

  &:focus {
    border-color: #404594;
    box-shadow: 0 0 0 0px transparent; /* 👈 elimina expansión fea */
  }

  &.with-icon {
    padding-right: 44px; /* 🔥 espacio real para el icono */
  }
`;

/* ERROR TEXT */
export const ErrorText = styled.span`
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
  margin-left: 4px;
`;

export const BarcodeWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

export const ScanButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);

  width: 30px;
  height: 30px;

  border: none;
  background: transparent;
  color: #404594;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  padding: 0;

  z-index: 2;

  &:hover {
    opacity: 0.7;
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;
/* BUTTON */
export const Button = styled.button`
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
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:active {
    transform: scale(0.98);
  }
`;

/* IMAGE UPLOAD */
export const UploadBox = styled.label`
  width: 100%;
  max-width: 400px;
  margin-bottom: 10px;

  border: 2px dashed #d9d9d9;
  border-radius: 16px;
  padding: 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;

  cursor: pointer;
  background: white;

  transition: all 0.2s ease;

  &:hover {
    border-color: #404594;
    background: #f4f5ff;
  }
`;

export const UploadText = styled.span`
  font-size: 14px;
  color: #666;
`;

export const HiddenInput = styled.input`
  display: none;
`;

/* CONTENEDOR */
export const PreviewContainer = styled.div`
  position: relative;
  width: fit-content;
  margin: 0 auto;

  animation: fadeIn 0.25s ease;

  &.closing {
    animation: fadeOut 0.2s ease forwards;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.9);
    }
  }
`;

/* IMAGEN */
export const PreviewImage = styled.img`
  width: 220px;
  height: 220px;
  object-fit: cover;
  border-radius: 14px;
  border: 1px solid #eee;

  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
`;

/* BOTÓN ELIMINAR */
export const RemoveButton = styled.button`
  position: absolute;

  /* 🔥 ajuste fino real */
  top: -12px;
  right: -12px;

  width: 34px;
  height: 34px;

  border-radius: 50%;
  border: 2px solid white;

  background: #ff4d4f;
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);

  transition: all 0.2s ease;

  /* 👇 animación entrada */
  animation: popIn 0.3s ease;

  @keyframes popIn {
    from {
      transform: scale(0);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  &:hover {
    background: #d9363e;
    transform: scale(1.15);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const ScannerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  width: 100%;
  height: 100vh;

  background: black;

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 9999;
`;

export const BackButton = styled.button`
  position: absolute;
  left: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c85f1c;

  &:hover {
    opacity: 0.6;
  }
`;
