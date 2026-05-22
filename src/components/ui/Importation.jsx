import styled from "styled-components";
import { theme } from "./Theme";

export const Wrapper = styled.div`
  height: 100dvh;
  background: ${theme.colors.background};
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (min-width: 900px) {
    padding: 20px 60px;
  }
`;

export const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
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

export const Title = styled.h1`
  font-size: 22px;
  font-weight: bold;
  color: ${theme.colors.text};
  font-family: var(--font-title);
`;

export const SearchWrapper = styled.div`
  position: relative;
  margin: 15px 0;
  flex-shrink: 0;

  @media (min-width: 900px) {
    max-width: 500px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
  }
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
  max-height: 200px;
  overflow-y: auto;
`;

export const DropdownItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  border: none;
  border-bottom: 1px solid #f3f4f6;
  background: transparent;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 2px;

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

export const TableWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
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
  background: ${theme.colors.surface};
  border: none;
  border-radius: 30px;
  padding: 6px 10px;
  text-align: center;
  font-size: 13px;
  color: ${theme.colors.text};
  outline: none;
  width: ${(p) => p.$width || "72px"};

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
  color: ${theme.colors.secondary};
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

export const Footer = styled.div`
  flex-shrink: 0;
  padding-top: 12px;
  border-top: 1px solid #eee;
`;

export const FeedbackRow = styled.div`
  text-align: center;
  font-size: 13px;
  margin-bottom: 8px;
`;

export const ErrorText = styled.p`
  color: ${theme.colors.error};
  font-size: 13px;
  text-align: center;
  margin-bottom: 8px;
`;

export const SubmitButton = styled.button`
  width: 100%;
  background: ${theme.colors.primary};
  color: ${theme.colors.background};
  padding: 13px;
  border-radius: 30px;
  border: none;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;

  @media (min-width: 900px) {
    max-width: 500px;
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