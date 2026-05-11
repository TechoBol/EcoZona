import styled from "styled-components";
import { theme } from "./Theme";

//////////////////////////////////////////
// WRAPPER
//////////////////////////////////////////

export const Wrapper = styled.div`
  min-height: 100dvh;
  background: ${theme.colors.background};
  padding: 20px;
`;

//////////////////////////////////////////
// HEADER
//////////////////////////////////////////

export const Header = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  margin-bottom: 20px;
`;

export const Title = styled.h1`
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  font-family: var(--font-title);
  color: ${theme.colors.text};
`;

//////////////////////////////////////////
// CONTENT
//////////////////////////////////////////

export const Content = styled.div`
  background: white;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
`;

//////////////////////////////////////////
// BUTTONS
//////////////////////////////////////////

export const AddButton = styled.button`
  height: 44px;
  padding: 0 18px;
  border: none;
  border-radius: 14px;
  background: ${theme.colors.primary};
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.95;
  }

  &:active {
    transform: scale(0.97);
  }
`;

//////////////////////////////////////////
// MODAL
//////////////////////////////////////////

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 9999;

  backdrop-filter: blur(3px);

  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
`;

export const ModalContent = styled.div`
  background: ${theme.colors.background};

  width: 900px;
  max-width: 95vw;

  border-radius: 22px;

  padding: 28px;

  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);

  animation: scaleIn 0.2s ease;

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.96);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

export const ModalTitle = styled.h2`
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 28px;
  color: ${theme.colors.text};
  font-family: var(--font-title);
`;

//////////////////////////////////////////
// SECTIONS
//////////////////////////////////////////

export const Section = styled.div`
  border: 1px solid #ececec;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 18px;
`;

export const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 18px;
  color: ${theme.colors.textSecondary};
`;

//////////////////////////////////////////
// ROWS
//////////////////////////////////////////

export const Row = styled.div`
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 14px;
  align-items: center;

  margin-bottom: 14px;

  &:last-child {
    margin-bottom: 0;
  }
`;

//////////////////////////////////////////
// LABEL
//////////////////////////////////////////

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text};
`;

//////////////////////////////////////////
// INPUTS
//////////////////////////////////////////

export const ModalInput = styled.input`
  width: 100%;
  height: 46px;

  border-radius: 14px;
  border: 1px solid #dcdcdc;

  padding: 0 14px;

  font-size: 14px;

  outline: none;

  background: white;

  transition: all 0.2s ease;

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(91, 108, 255, 0.12);
  }

  &::placeholder {
    color: #aaa;
  }
`;

export const ModalSelect = styled.select`
  width: 100%;
  height: 46px;

  border-radius: 14px;
  border: 1px solid #dcdcdc;

  padding: 0 14px;

  font-size: 14px;
  font-weight: 500;

  background: white;

  outline: none;
  cursor: pointer;

  transition: all 0.2s ease;

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(91, 108, 255, 0.12);
  }
`;

//////////////////////////////////////////
// DATE ROW
//////////////////////////////////////////

export const DatesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
`;

//////////////////////////////////////////
// RADIO
//////////////////////////////////////////

export const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 6px;
`;

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 500;

  cursor: pointer;
`;

//////////////////////////////////////////
// ACTIONS
//////////////////////////////////////////

export const ActionsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  margin-top: 24px;
`;

//////////////////////////////////////////
// BUTTONS
//////////////////////////////////////////

export const SaveButton = styled.button`
  min-width: 120px;
  height: 46px;

  border: none;
  border-radius: 14px;

  background: ${theme.colors.primary};
  color: white;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    opacity: 0.95;
  }

  &:active {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  min-width: 120px;
  height: 46px;

  border-radius: 14px;
  border: 1px solid #ddd;

  background: white;

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    background: #f8f8f8;
  }

  &:active {
    transform: scale(0.97);
  }
`;

//////////////////////////////////////////
// TABLE WRAPPER
//////////////////////////////////////////

export const TableWrapper = styled.div`
  height: 700px;
  width: 100%;
  background: white;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid #eee;
`;

//////////////////////////////////////////
// TOTAL BAR
//////////////////////////////////////////

export const TotalBar = styled.div`
  margin-top: 14px;

  display: flex;
  justify-content: flex-end;
  align-items: center;

  gap: 12px;

  padding: 16px 20px;

  background: white;

  border-radius: 14px;

  border: 1px solid #eee;
`;

export const TotalText = styled.span`
  font-size: 18px;

  font-weight: ${({ $bold }) => ($bold ? 700 : 500)};

  color: ${theme.colors.text};
`;