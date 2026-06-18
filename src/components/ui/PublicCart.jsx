import styled from "styled-components";
import { theme } from "./Theme";

export const Wrapper = styled.div`
  min-height: 100dvh;
  background: ${theme.colors.background};
  display: flex;
  flex-direction: column;

  @media (min-width: 900px) {
    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr 360px;
    grid-template-areas:
      "header header"
      "list   summary";
    gap: 0 20px;
    padding: 20px 40px;
    align-items: start;
  }
`;

export const Header = styled.div`
  background: ${theme.colors.background};
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  align-items: center;
  padding: 14px 20px;
  gap: 12px;
  flex-shrink: 0;

  @media (min-width: 900px) {
    grid-area: header;
    background: transparent;
    border-bottom: none;
    padding: 0 0 20px 0;
  }
`;

export const BackButton = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: transparent;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text};
  flex-shrink: 0;
`;

export const Title = styled.h1`
  font-size: 17px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin: 0;
`;

export const CartBadge = styled.span`
  margin-left: auto;
  background: #E1F5EE;
  color: #0F6E56;
  font-size: 12px;
  font-weight: 500;
  padding: 3px 12px;
  border-radius: 99px;
`;

export const ProductList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  overflow-y: auto;

  @media (min-width: 900px) {
    grid-area: list;
    padding: 0;
  }
`;

export const SectionLabel = styled.p`
  font-size: 11px;
  font-weight: 600;
  color: ${theme.colors.textSecondary};
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0 0 6px 0;
`;

export const ProductCard = styled.div`
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: 14px;
  padding: 14px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

export const ProductImage = styled.img`
  width: 58px;
  height: 58px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.surface};
  flex-shrink: 0;
`;

export const RightSection = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
`;

export const ProductText = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ProductName = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin: 0 0 4px 0;
  line-height: 1.3;
`;

export const ProductPriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ProductPrice = styled.span`
  font-size: 12px;
  color: ${theme.colors.textSecondary};
`;

export const PriceDivider = styled.span`
  color: ${theme.colors.border};
  font-size: 12px;
`;

export const ProductSubtotal = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${theme.colors.primary};
`;

export const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
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
  min-width: 36px;
  text-align: center;
  color: ${theme.colors.text};
`;

export const DeleteButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${theme.colors.textSecondary};
  display: flex;
  align-items: center;
  padding: 4px;

  &:active { transform: scale(0.9); }
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  flex-shrink: 0;

  @media (min-width: 900px) {
    grid-area: summary;
    padding: 0;
    position: sticky;
    top: 20px;
  }
`;

export const CustomerSection = styled.div`
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin: 0;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const TwoColumnRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

export const Label = styled.label`
  font-size: 12px;
  color: ${theme.colors.textSecondary};
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid ${theme.colors.border};
  border-radius: 10px;
  background: ${theme.colors.background};
  color: ${theme.colors.text};
  font-size: 13px;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }

  &::placeholder { color: ${theme.colors.textSecondary}; }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 72px;
  resize: vertical;
  padding: 10px 12px;
  border: 1px solid ${theme.colors.border};
  border-radius: 10px;
  background: ${theme.colors.background};
  color: ${theme.colors.text};
  font-size: 13px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }

  &::placeholder { color: ${theme.colors.textSecondary}; }
`;

export const PhonePrefix = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${theme.colors.border};
  border-radius: 10px;
  overflow: hidden;
  background: ${theme.colors.background};
  height: 40px;

  span {
    padding: 0 10px;
    font-size: 12px;
    color: ${theme.colors.textSecondary};
    border-right: 1px solid ${theme.colors.border};
    height: 100%;
    display: flex;
    align-items: center;
    white-space: nowrap;
    background: ${theme.colors.surface};
  }

  input {
    flex: 1;
    height: 100%;
    padding: 0 10px;
    border: none;
    background: transparent;
    color: ${theme.colors.text};
    font-size: 13px;

    &:focus { outline: none; }
    &::placeholder { color: ${theme.colors.textSecondary}; }
  }
`;

export const SummaryCard = styled.div`
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: 14px;
  padding: 16px;
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: ${theme.colors.textSecondary};
  padding: 4px 0;
`;

export const Total = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 600;
  color: ${theme.colors.text};
  border-top: 1px solid ${theme.colors.border};
  margin-top: 8px;
  padding-top: 12px;

  span:last-child { color: ${theme.colors.primary}; }
`;

export const CheckoutButton = styled.button`
  width: 100%;
  margin-top: 12px;
  background: ${theme.colors.primary};
  color: #fff;
  padding: 13px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

// legacy exports para que no rompa el Cart privado si los usa
export const DiscountInput = styled.input``;
export const DiscountPrefix = styled.span``;
export const ActionsColumn = styled.div``;
export const ProductInfo = styled.div``;