import styled, { keyframes } from "styled-components";
import { theme } from "./Theme";

// ── Wrapper principal ─────────────────────────────────────────────────────────
export const Wrapper = styled.div`
  min-height: 100dvh;
  background: ${theme.colors.background};
  padding: 30px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 0;

  @media (min-width: 900px) {
    padding: 24px 40px;
  }
`;

// ── Header ────────────────────────────────────────────────────────────────────
export const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0 20px;
  flex-shrink: 0;
`;

export const BackButton = styled.button`
  position: absolute;
  left: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${theme.colors.text};
  &:hover { opacity: 0.6; }
`;

export const SecondaryButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: ${theme.colors.success};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: auto;
`;

export const Title = styled.h1`
  font-size: 22px;
  font-weight: bold;
  color: ${theme.colors.text};
  font-family: var(--font-title);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

// ── Layout desktop ────────────────────────────────────────────────────────────
export const DesktopLayout = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;

  @media (min-width: 900px) {
    flex-direction: row;
    gap: 32px;
    align-items: flex-start;
  }
`;

export const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (min-width: 900px) {
    width: 450px  ;
    flex-shrink: 0;
    padding-top: 30px;
  }
`;

export const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;

  @media (min-width: 900px) {
    border-left: 1px solid #e5e7eb;
    padding-left: 32px;
    min-height: 400px;
    padding-top: 30px;
  }
`;

// ── Inputs ────────────────────────────────────────────────────────────────────
export const SearchWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const SearchInput = styled.input`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 30px;
  padding: 10px 16px;
  font-size: 14px;
  color: ${theme.colors.text};
  background: ${theme.colors.surface};
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: ${theme.colors.primary};
  }
`;

export const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: ${theme.colors.background};
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 400px;
  overflow-y: auto;
`;

export const DropdownItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 14px 16px;
  border: none;
  border-bottom: 1px solid #f3f4f6;
  background: transparent;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &:last-child { border-bottom: none; }
  &:hover { background: ${theme.colors.surface}; }
`;

export const DropdownBarcode = styled.span`
  font-size: 11px;
  color: ${theme.colors.textSecondary};
`;

export const DropdownName = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text};
  margin: 0;
`;

export const DropdownHint = styled.p`
  text-align: center;
  color: ${theme.colors.textSecondary};
  font-size: 13px;
  padding: 14px;
  margin: 0;
`;

// ── LocationSelect ────────────────────────────────────────────────────────────
export const LocationWrapper = styled.div`
  position: relative;
`;

export const LocationIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  color: #9ca3af;
`;

export const LocationSelectInput = styled.select`
  width: 100%;
  padding: 12px 14px 12px 36px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-size: 13px;
  font-weight: 500;
  color: ${({ $hasValue }) => $hasValue ? theme.colors.text : "#9ca3af"};
  appearance: none;
  cursor: ${({ disabled }) => disabled ? "not-allowed" : "pointer"};
  outline: none;
  box-sizing: border-box;
`;

export const LocationArrow = styled.div`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #9ca3af;
  font-size: 10px;
`;

// ── ModeToggle ────────────────────────────────────────────────────────────────
export const ToggleWrapper = styled.div`
  display: flex;
  background: #F3F4F6;
  border-radius: 30px;
  padding: 4px;
  position: relative;
`;

export const ToggleSlider = styled.div`
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: ${({ $mode }) => $mode === "MANUAL" ? "4px" : "calc(50% + 2px)"};
  width: calc(50% - 6px);
  border-radius: 26px;
  background: ${({ $mode }) => $mode === "MANUAL" ? "#F20C1F" : "#319B34"};
  box-shadow: ${({ $mode }) => $mode === "MANUAL"
    ? "0 2px 8px rgba(242,12,31,0.25)"
    : "0 2px 8px rgba(49,155,52,0.25)"};
  transition: left 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
`;

export const ToggleButton = styled.button`
  flex: 1;
  padding: 10px 0;
  border-radius: 26px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  border: none;
  background: transparent;
  color: ${({ $active }) => $active ? "#fff" : "gray"};
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
`;

// ── DropZone ──────────────────────────────────────────────────────────────────
export const DropZoneArea = styled.div`
  border: 2px dashed ${({ $isDragging }) => $isDragging ? "#319B34" : "#e5e7eb"};
  border-radius: 16px;
  padding: 40px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  background: ${({ $isDragging }) => $isDragging ? "rgba(49,155,52,0.04)" : "#fafafa"};
  transition: all 0.2s ease;
`;

export const DropZoneIconCircle = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: ${({ $isDragging }) => $isDragging ? "rgba(49,155,52,0.1)" : "#F3F4F6"};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
`;

export const DropZoneTitle = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin: 0 0 4px;
  text-align: center;
`;

export const DropZoneSubtitle = styled.p`
  font-size: 12px;
  color: gray;
  margin: 0;
  text-align: center;
`;

export const FilePreview = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 30px;
  background: rgba(49,155,52,0.06);
  border: 1px solid rgba(49,155,52,0.25);
  transition: all 0.2s ease;
`;

export const FileName = styled.span`
  flex: 1;
  font-size: 13px;
  color: #319B34;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
`;

// ── Tabla ─────────────────────────────────────────────────────────────────────
export const TableWrapper = styled.div`
  flex: 1;
  overflow-y: auto;

  @media (min-width: 900px) {
    max-height: calc(100dvh - 200px);
  }
`;

export const Table = styled.table`
  width: 100%;
  font-size: 13px;
  border-collapse: collapse;
`;

export const Thead = styled.thead`
  tr {
    border-bottom: 1px solid #e5e7eb;
  }
  th {
    padding: 8px 4px;
    text-align: left;
    color: ${theme.colors.textSecondary};
    font-weight: 500;
    white-space: nowrap;
  }
`;

export const Tbody = styled.tbody`
  tr {
    border-bottom: 1px solid #f3f4f6;
  }
  td {
    padding: 12px 4px;
    color: ${theme.colors.text};
  }
`;


export const NumberInput = styled.input`
  background: transparent;
  border: none;
  border-radius: 30px;
  padding: 6px 12px;
  text-align: center;
  font-size: 13px;
  color: ${theme.colors.text};
  outline: none;
  width: ${({ $width }) => $width || "72px"};

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type="number"] { -moz-appearance: textfield; }
`;

export const RemoveButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${theme.colors.error};
  font-size: 14px;
  padding: 4px 6px;
  -webkit-tap-highlight-color: transparent;
  &:active { transform: scale(0.9); }
`;

export const EmptyHint = styled.p`
  text-align: center;
  color: ${theme.colors.textSecondary};
  margin-top: 40px;
  font-size: 14px;
`;

export const ExcelEmptyHint = styled(EmptyHint)`
  margin-top: 80px;
`;

// ── Footer ────────────────────────────────────────────────────────────────────
export const Footer = styled.div`
  flex-shrink: 0;
  padding-top: 12px;
  border-top: 1px solid #eee;

  @media (min-width: 900px) {
    margin-top: 24px;
  }
`;

export const ErrorText = styled.p`
  color: ${theme.colors.error};
  font-size: 13px;
  text-align: center;
  margin-bottom: 8px;
`;

export const SubmitButton = styled.button`
  width: 100%;
  background: ${theme.colors.success};
  color: ${theme.colors.background};
  padding: 13px;
  border-radius: 30px;
  border: none;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;

  @media (min-width: 900px) {
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
    display: block;
  }

  &:hover { opacity: 0.9; }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// NewImportation.js (styles)
export const ExcelReadyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 12px;
  padding: 60px 40px;
  text-align: center;
`;

export const ExcelReadyIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(49,155,52,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ExcelReadyTitle = styled.p`
  font-size: 15px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin: 0;
`;

export const ExcelReadySubtitle = styled.p`
  font-size: 13px;
  color: ${theme.colors.textSecondary};
  margin: 0;
  max-width: 280px;
`;

//Edit Importation  
export const SectionLabel = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${theme.colors.textSecondary};
  margin: 0;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

export const CodeDisplay = styled.div`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 30px;
  padding: 10px 16px;
  font-size: 14px;
  color: ${theme.colors.textSecondary};
  background: ${theme.colors.surface};
  box-sizing: border-box;
  opacity: 0.7;
  cursor: not-allowed;
`;