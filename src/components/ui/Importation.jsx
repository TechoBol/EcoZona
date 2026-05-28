import styled from "styled-components";
import { theme } from "./Theme";

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
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: transparent;
    color: ${theme.colors.text};
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  
    &:active { transform: scale(0.95); }
    &:hover  { opacity: 0.9; }
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
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
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
  &:active { transform: scale(0.9); }
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: ${theme.colors.text};
  margin-bottom: 6px;
`;

export const InfoLabel = styled.span`
  font-weight: 600;
`;

export const InfoValue = styled.span`
  color: ${theme.colors.textSecondary};
  text-align: right;
`;

export const Section = styled.div`
  margin-top: 14px;
`;

export const SectionTitle = styled.div`
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
`;

export const ProductsBox = styled.div`
  border: 1px solid #eee;
  border-radius: 14px;
  padding: 10px;
  max-height: 200px;
  overflow-y: auto;
`;

export const ProductItem = styled.div`
  padding: 8px 0;
  border-bottom: 1px solid #f1f1f1;
  &:last-child { border-bottom: none; }
`;

export const ProductTop = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 14px;
`;

export const ProductMeta = styled.div`
  font-size: 12px;
  color: ${theme.colors.textSecondary};
`;

export const StatusBadge = styled.div`
  padding: 0 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  text-transform: uppercase;
  height: 28px;
  ${({ status }) => {
        switch (status) {
            case "MANUAL":
                return `background: #eef2ff; color: #5b6cff;`;
            case "EXCEL":
                return `background: #e8f8f0; color: #27ae60;`;
            default:
                return `background: #f5f5f5; color: #888;`;
        }
    }}
`;

export const DrawerOverlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  animation: fadeIn 0.2s ease;
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const DrawerPanel = styled.div`
  position: fixed;
  top: 0; right: 0;
  width: 420px;
  max-width: 95vw;
  height: 100vh;
  background: ${theme.colors.background};
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1001;
  animation: slideIn 0.25s ease;
  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
`;

export const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
`;

export const DrawerTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${theme.colors.text};
  margin: 0;
`;

export const DrawerBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
`;

export const DrawerSection = styled.div`
  margin-bottom: 20px;
`;

export const ProductTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`;

export const ProductTableHead = styled.thead`
  background: #f8f9ff;
  th {
    padding: 10px 12px;
    text-align: left;
    font-weight: 600;
    color: ${theme.colors.text};
    border-bottom: 1px solid #eee;
  }
  th:last-child { text-align: right; }
`;

export const ProductTableBody = styled.tbody`
  tr {
    border-bottom: 1px solid #f5f5f5;
    &:last-child { border-bottom: none; }
    &:hover { background: #fafafa; }
  }
  td {
    padding: 10px 12px;
    color: ${theme.colors.text};
    vertical-align: middle;
  }
  td:last-child { text-align: right; }
`;

export const ProductTableWrapper = styled.div`
  border: 1px solid #eee;
  border-radius: 14px;
  overflow: hidden;
  max-height: 400px;
  overflow-y: auto;
`;

export const TotalRow = styled.tr`
  background: #f8f9ff;
  font-weight: 700;
  td {
    padding: 12px;
    border-top: 2px solid #eee;
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

export const ButtonGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;