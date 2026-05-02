import styled from "styled-components";
import { theme } from "./Theme";

/* ================= WRAPPER ================= */
export const Wrapper = styled.div`
  min-height: 100dvh;
  background: ${theme.colors.background};
  padding: 25px;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

/* ================= HEADER ================= */
export const Header = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  max-width: 1080px;
  margin: 0 auto 28px auto;
  padding: 8px 0;
  width: 100%;

  @media (max-width: 768px) {
    padding: 8px 12px;
    box-sizing: border-box;
  }
`;

export const BackButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 10px;

  background: transparent;
  border: none;
  cursor: pointer;
  color: ${theme.colors.text};

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    left: 20px;
  }
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  font-family: var(--font-title);
  color: ${theme.colors.text};

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

/* ================= FORM CARD ================= */
export const Form = styled.form`
  max-width: 1080px;
  margin: 0 auto;
  background: ${theme.colors.background};
  border-radius: 26px;
  padding: 28px;
  box-sizing: border-box;
  width: 100%;

  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 22px;
  align-items: start;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  @media (max-width: 768px) {
    padding: 12px;
    border-radius: 18px;
    gap: 12px;
  }
`;

/* ================= COLUMNAS ================= */
export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;

  @media (max-width: 992px) {
    gap: 14px;
  }
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;

  @media (max-width: 992px) {
    gap: 14px;
  }
`;

/* ================= BUTTON ROW ================= */
export const ButtonRow = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  margin-top: 6px;
`;

/* ================= SECTION ================= */
export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 20px;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: ${theme.colors.background};

  @media (max-width: 768px) {
    padding: 14px;
    gap: 12px;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${theme.colors.textSecondary};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

/* ================= GRID ================= */
export const Grid2 = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

export const Grid3 = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

/* ================= INPUT ================= */
export const ContainerInput = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const Input = styled.input`
  height: 52px;
  width: 100%;
  border-radius: 14px;
  border: 1px solid
    ${({ hasError }) =>
      hasError ? theme.colors.error : "rgba(0,0,0,0.15)"};
  padding: 0 16px;
  font-size: 14px;
  outline: none;
  background: ${theme.colors.background};
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(61, 68, 201, 0.12);
  }
`;

export const Select = styled.select`
  height: 52px;
  width: 100%;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  padding: 0 16px;
  font-size: 14px;
  outline: none;
  background: ${theme.colors.background};
  cursor: pointer;
  appearance: none;
  box-sizing: border-box;

  background-image: url("data:image/svg+xml;utf8,<svg fill='%23666' height='20' viewBox='0 0 20 20' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M5 7l5 5 5-5H5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 12px center;

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(61, 68, 201, 0.12);
  }
`;

export const ErrorText = styled.span`
  color: ${theme.colors.error};
  font-size: 12px;
  margin-top: 5px;
`;

/* ================= BARCODE ================= */
export const BarcodeWrapper = styled.div`
  position: relative;
`;

export const ScanButton = styled.button`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: ${theme.colors.primary};
  cursor: pointer;
`;

/* ================= IMAGE ================= */
export const ImageActions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

export const UploadBox = styled.label`
  height: 70px;
  border: 2px dashed rgba(0, 0, 0, 0.12);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  font-size: 16px;
  background: ${theme.colors.background};
  color: ${theme.colors.textSecondary};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.primary};
    background: rgba(61, 68, 201, 0.04);
  }
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const PreviewContainer = styled.div`
  margin: 0 auto;
  position: relative;
  width: fit-content;
`;

export const PreviewImage = styled.img`
  width: 220px;
  height: 220px;
  object-fit: cover;
  border-radius: 18px;
  border: 1px solid rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    width: 160px;
    height: 160px;
  }
`;

export const RemoveButton = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: ${theme.colors.primary};
  color: ${theme.colors.background};
  cursor: pointer;
`;

/* ================= SUBMIT ================= */
export const Button = styled.button`
  width: 320px;
  max-width: 100%;
  height: 56px;
  border-radius: 30px;
  border: none;
  background: ${theme.colors.primary};
  color: ${theme.colors.background};
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(61, 68, 201, 0.25);

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

/* ================= SCANNER ================= */
export const ScannerOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 9999;
`;