import styled from "styled-components";
import { theme } from "./Theme";

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${theme.colors.text};
`;

export const StockCard = styled.div`
  padding: 12px;
  border-radius: 12px;
  background: ${theme.colors.background};
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
`;

export const StockText = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

export const NumberInput = styled.input`
  width: 100%;
  height: 44px;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.15);
  padding: 0 12px;
  font-size: 14px;
  box-sizing: border-box;
`;

export const PreviewCard = styled.div`
  padding: 14px;
  border-radius: 14px;
  background: rgba(0,0,0,0.03);
`;
export const AddToCartButton = styled.button`
  width: 260px;
  height: 56px;

  align-self: center;

  background: ${theme.colors.primary};
  color: ${theme.colors.background};

  border: none;
  border-radius: 30px;

  font-size: 16px;
  font-weight: 600;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  box-shadow: 0 4px 10px rgba(61, 68, 201, 0.25);

  &:active {
    transform: scale(0.98);
  }
`;

export const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 5px 100px 5px;
`;

export const Wrapper = styled.div`
  height: 100dvh;
  background: ${theme.colors.background};
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
export const ProductInput = styled.input`
  width: 100%;
  height: 44px;
  border-radius: 12px;
  border: 1px solid #ddd;
  padding: 0 12px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  background: #fafafa;

  &:focus {
    background: white;
    border-color: ${theme.colors.primary};
  }
`;
export const SearchWrapper = styled.div`
  position: relative;
`;

export const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;

  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;

  max-height: 260px;
  overflow-y: auto;

  z-index: 50;

  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
`;

export const DropdownItem = styled.div`
  padding: 12px 14px;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;

  &:hover {
    background: #f8f8f8;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const DropdownName = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

export const DropdownBarcode = styled.div`
  font-size: 12px;
  color: #999;
`;

export const DropdownHint = styled.div`
  padding: 14px;
  text-align: center;
  color: #999;
  font-size: 13px;
`;
export const ProductRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;

  > div {
    flex: 1;
    min-width: 0;
  }
`;

export const StockRow = styled.div`
  display: flex;
  gap: 12px;

  > div {
    flex: 1;
  }
`;

export const QuantityWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const QuantityInput = styled(NumberInput)`
  width: 140px;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
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

export const SelectInput = styled.select`
  width: 100%;
  height: 44px;
  border-radius: 12px;
  border: 1px solid #ddd;
  padding: 0 12px;
  font-size: 14px;
  background: white;
  outline: none;

  &:focus {
    border-color: ${theme.colors.primary};
  }
`;