import styled from "styled-components";
import { theme } from "./Theme";

export const Wrapper = styled.div`
  min-height: 100dvh;
  background: ${theme.colors.background};
  display: flex;
  flex-direction: column;
  padding: 20px;

  @media (min-width: 900px) {
    padding: 30px 60px;
  }
`;

export const BackButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid transparent;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${theme.colors.text};
  margin-bottom: 24px;
  flex-shrink: 0;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  flex: 1;

  @media (min-width: 900px) {
    flex-direction: row;
    align-items: stretch;
    gap: 40px;
    min-height: calc(100dvh - 100px);
  }
`;

export const ImageSection = styled.div`
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  background: ${theme.colors.card};
  border: 1px solid ${theme.colors.border};
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 900px) {
    width: 50%;
    flex-shrink: 0;
    aspect-ratio: unset;
  }
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const InfoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;

  @media (min-width: 900px) {
    justify-content: center;
    width: 50%;
  }
`;

export const BadgeRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Badge = styled.span`
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 5px 12px;
  border-radius: 20px;
  background: ${theme.colors.card};
  color: ${theme.colors.textSecondary};
  border: 1px solid ${theme.colors.border};
`;

export const BrandBadge = styled.span`
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 5px 12px;
  border-radius: 20px;
  background: ${theme.colors.primaryLight};
  color: ${theme.colors.primary};
  border: 1px solid ${theme.colors.primaryBorder};
`;

export const ProductName = styled.h1`
  font-size: 22px;
  font-weight: 500;
  color: ${theme.colors.text};
  line-height: 1.3;
  margin: 0;
`;

export const PriceLabel = styled.p`
  font-size: 13px;
  color: ${theme.colors.textSecondary};
  margin: 0 0 4px 0;
`;

export const ProductPrice = styled.span`
  font-size: 30px;
  font-weight: 500;
  color: ${theme.colors.primary};
  letter-spacing: -0.5px;
`;

export const Description = styled.p`
  font-size: 14px;
  color: ${theme.colors.textSecondary};
  line-height: 1.7;
  margin: 0;
`;

export const StockRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StockDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ available }) => (available ? "#4caf50" : "#f44336")};
  flex-shrink: 0;
`;

export const StockText = styled.span`
  font-size: 13px;
  color: ${theme.colors.textSecondary};
`;

export const Divider = styled.div`
  height: 1px;
  background: ${theme.colors.border};
`;

export const QuantityRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const QuantityLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text};
`;

export const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${theme.colors.card};
  border-radius: 30px;
  padding: 4px;
  border: 1px solid ${theme.colors.border};
`;

export const QtyButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text};
  border-radius: 50%;
  -webkit-tap-highlight-color: transparent;

  &:focus {
    outline: none;
  }

  &:active {
    transform: scale(0.9);
  }

  &:hover:not(:disabled) {
    background: ${theme.colors.background};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

export const QtyText = styled.span`
  font-size: 15px;
  font-weight: 500;
  min-width: 28px;
  text-align: center;
  color: ${theme.colors.text};
`;

export const AddToCartButton = styled.button`
  width: 100%;
  padding: 15px;
  background: ${theme.colors.primary};
  color: ${theme.colors.background};
  border: none;
  border-radius: 30px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  letter-spacing: 0.01em;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const ErrorText = styled.p`
  text-align: center;
  color: ${theme.colors.textSecondary};
  margin-top: 60px;
`;

export const ActionsSection = styled.div`
  margin-top: auto;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;