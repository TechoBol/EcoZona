import styled from "styled-components";
import { theme } from "./Theme";

export const Wrapper = styled.div`
  height: 100dvh;
  background: ${theme.colors.background};
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text};

  &:hover {
    opacity: 0.6;
  }
`;

export const Title = styled.h1`
  font-size: 22px;
  font-weight: bold;
  color: ${theme.colors.text};
  font-family: var(--font-title);
  text-align: center;
`;

export const ProductList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 15px;
  padding-right: 4px;
`;

export const DiscountInput = styled.input`
  width: 70px;
  text-align: right;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 2px 6px;
  font-size: 14px;
  color: ${theme.colors.text};
  outline: none;

  &:focus {
    border-color: transparent;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }
`;

export const DiscountPrefix = styled.span`
  font-size: 14px;
  color: ${theme.colors.textSecondary};
  margin-right: 4px;
`;

export const ProductCard = styled.div`
  display: flex;
  align-items: stretch;
  background: ${theme.colors.background};
  border-radius: 14px;
  padding: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  gap: 12px;
  overflow: hidden;
  flex-shrink: 0;
`;

export const ProductImage = styled.img`
  width: 90px;
  height: calc(100% + 24px);
  object-fit: cover;
  margin: -12px 0 -12px -12px;
  border-top-left-radius: 14px;
  border-bottom-left-radius: 14px;
  flex-shrink: 0;
`;

export const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ProductText = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ProductName = styled.span`
  font-weight: 600;
  font-size: 20px;
`;

export const ProductPrice = styled.span`
  font-size: 14px;
  color: ${theme.colors.textSecondary};
  margin-top: 4px;
`;

export const DeleteButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  -webkit-tap-highlight-color: transparent;

  &:focus {
    outline: none;
  }

  &:active {
    transform: scale(0.9);
  }
`;

export const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
`;

export const Button = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  -webkit-tap-highlight-color: transparent;

  &:focus {
    outline: none;
  }

  &:active {
    transform: scale(0.9);
  }
`;

export const QuantityText = styled.span`
  font-size: 14px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
`;

export const Footer = styled.div`
  flex-shrink: 0;
  padding-top: 15px;
  border-top: 1px solid #eee;
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 14px;
`;

export const Total = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 16px;
  margin-top: 10px;
`;

export const CheckoutButton = styled.button`
  width: 100%;
  margin-top: 15px;
  background: ${theme.colors.primary};
  color: ${theme.colors.background};
  padding: 12px;
  border-radius: 30px;
  border: none;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ActionsColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

export const ProductPriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

export const PriceDivider = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: 13px;
  opacity: 0.5;
`;

export const ProductSubtotal = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text};
`;