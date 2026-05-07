import styled from "styled-components";
import { theme } from "./Theme"
import { FaTrash } from "react-icons/fa";

export const Wrapper = styled.div`
  min-height: 100dvh;
  background: ${theme.colors.background};
  padding: 20px;
`;

export const Header = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 20px;
`;

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
  &:hover { opacity: 0.95; }
  &:active { transform: scale(0.97); }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0;
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

export const ModalContent = styled.div`
  background: ${theme.colors.background};
  padding: 30px 25px 25px 25px;
  border-radius: 20px;
  width: 360px;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: scaleIn 0.2s ease;
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
`;

export const ModalTitle = styled.h3`
  margin-bottom: 20px;
  padding-right: 50px;
  font-size: 20px;
  font-weight: 700;
  color: ${theme.colors.text};
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 10px;
`;

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

export const ModalSelect = styled.select`
  height: 48px;
  width: 100%;
  border-radius: 14px;
  border: 1px solid #e0e0e0;
  padding: 0 14px;
  font-size: 15px;
  font-weight: 500;
  background: ${theme.colors.background};
  cursor: pointer;

  &:focus {
    border-color: ${theme.colors.text};
  }
`;

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
  &:active { transform: scale(0.97); }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 14px; right: 14px;
  width: 36px; height: 36px;
  border-radius: 50%;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { background: transparent; }
  &:active { transform: scale(0.9); }
`;

export const TotalBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  background: ${theme.colors.background};
  border-radius: 0 0 12px 12px;
  border-top: 1px solid #f0f0f0;
  padding: 14px 24px;
  margin-top: -1px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  font-family: var(--font-title);
`;

export const TotalText = styled.span`
  font-size: 20px;
  font-weight: ${({ $bold }) => ($bold ? 700 : 400)};
  color: ${theme.colors.text};
  font-family: var(--font-title);
`;

export const FiltersRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
`;

export const FilterInput = styled.input`
  height: 44px;
  flex: 1;
  border-radius: 14px;
  border: 1px solid #e0e0e0;
  padding: 0 14px;
  font-size: 14px;
  outline: none;
  background: ${theme.colors.background};
  color: ${theme.colors.text};
  transition: border-color 0.2s ease;
  &:focus { border-color: ${theme.colors.text}; }
  &::placeholder { color: ${theme.colors.textSecondary}; }
`;

export const DatePickerWrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
  align-items: center;
    flex-wrap: nowrap;

  .MuiFormControl-root {
    flex: 1;
    min-width: 0;
  }
`;

export const ClearButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: ${theme.colors.primary};
  color: ${theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
  &:hover { opacity: 0.9; }
  &:active { transform: scale(0.97); }
`;

//////////////////////////////////////////
// 🔹 ITEM ROW
//////////////////////////////////////////
export const ItemRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  ${ModalSelect} {
    flex: 1;
    min-width: 0;
  }
`;

//////////////////////////////////////////
// STOCK TEXT
//////////////////////////////////////////
export const StockText = styled.span`
  font-size: 12px;
  min-width: 55px;
  text-align: right;
  color: ${theme.colors.textSecondary};
`;

//////////////////////////////////////////
// 🔹 DELETE BUTTON
//////////////////////////////////////////
export const DeleteButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: #e74c3c;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    transform: scale(0.9);
  }
`;

//////////////////////////////////////////
// ADD ITEM BUTTON
//////////////////////////////////////////
export const AddItemButton = styled.button`
  height: 44px;
  border-radius: 14px;
  border: 1px dashed #ccc;
  background: transparent;
  cursor: pointer;
  font-weight: 500;
  color: ${theme.colors.text};

  &:hover {
    background: rgba(0, 0, 0, 0.03);
  }

  &:active {
    transform: scale(0.98);
  }
`;

//////////////////////////////////////////
// SMALL INPUT (CANTIDAD)
//////////////////////////////////////////
export const SmallInput = styled(ModalInput)`
  width: 70px;
  text-align: center;
  padding: 0;
`;

export const StatusBadge = styled.div`
  padding: 0px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  text-transform: uppercase;
  height: 40px;
  ${({ status }) => {
    switch (status) {
      case "PENDING":
        return `
          background: #fff4e5;
          color: #f39c12;
        `;
      case "APPROVED":
        return `
          background: #e8f8f0;
          color: #27ae60;
        `;
      case "REJECTED":
        return `
          background: #fdecea;
          color: #e74c3c;
        `;
      default:
        return `
          background: #eef2ff;
          color: #5b6cff;
        `;
    }
  }}
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: ${theme.colors.text};
`;

export const InfoLabel = styled.span`
  font-weight: 600;
`;

export const InfoValue = styled.span`
  color: ${theme.colors.textSecondary};
  text-align: right;
`;

export const Section = styled.div`
  margin-top: 10px;
`;

export const SectionTitle = styled.div`
  font-weight: 600;
  margin-bottom: 6px;
`;

export const ProductsBox = styled.div`
  border: 1px solid #eee;
  border-radius: 14px;
  padding: 10px;
  max-height: 180px;
  overflow-y: auto;
`;

export const ProductItem = styled.div`
  padding: 8px 0;
  border-bottom: 1px solid #f1f1f1;

  &:last-child {
    border-bottom: none;
  }
`;

export const ProductTop = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 600;
`;

export const ProductMeta = styled.div`
  font-size: 12px;
  color: ${theme.colors.textSecondary};
`;

export const TotalContainer = styled.div`
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 16px;
`;

export const RejectTextarea = styled.textarea`
  width: 100%;
  min-height: 70px;
  border-radius: 14px;
  border: 1px solid #ddd;
  padding: 10px;
  font-size: 13px;
  margin-top: 10px;
  outline: none;

  &:focus {
    border-color: ${theme.colors.primary};
  }
`;

export const ActionsRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;