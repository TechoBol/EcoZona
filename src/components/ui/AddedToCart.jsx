import styled from "styled-components";
import { theme } from "./Theme";

export const Wrapper = styled.div`
  min-height: 100dvh;
  background: ${theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 860px;
  background: ${theme.colors.card};
  border: 1px solid ${theme.colors.border};
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (min-width: 700px) {
    flex-direction: row;
  }
`;

export const LeftSection = styled.div`
  flex: 1;
  padding: 28px;
  display: flex;
  align-items: center;
  gap: 20px;
  border-bottom: 1px solid ${theme.colors.border};

  @media (min-width: 700px) {
    border-bottom: none;
    border-right: 1px solid ${theme.colors.border};
  }
`;

export const ProductThumb = styled.img`
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 12px;
  flex-shrink: 0;
  border: 1px solid ${theme.colors.border};
`;

export const ProductMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ConfirmRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #4caf50;
  font-size: 13px;
  font-weight: 600;
`;

export const ProductName = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${theme.colors.text};
  line-height: 1.4;
`;

export const ProductQty = styled.span`
  font-size: 13px;
  color: ${theme.colors.textSecondary};
`;

export const RightSection = styled.div`
  width: 100%;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  justify-content: center;

  @media (min-width: 700px) {
    width: 280px;
    flex-shrink: 0;
  }
`;

export const SubtotalRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const SubtotalLabel = styled.span`
  font-size: 12px;
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const SubtotalValue = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: ${theme.colors.text};
  letter-spacing: -0.5px;
`;

export const ItemCount = styled.span`
  font-size: 12px;
  color: ${theme.colors.textSecondary};
`;

export const GoToCartButton = styled.button`
  width: 100%;
  padding: 13px;
  background: ${theme.colors.primary};
  color: ${theme.colors.background};
  border: none;
  border-radius: 30px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    opacity: 0.9;
  }
`;

export const ContinueButton = styled.button`
  width: 100%;
  padding: 13px;
  background: transparent;
  color: ${theme.colors.text};
  border: 1px solid ${theme.colors.border};
  border-radius: 30px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    opacity: 0.7;
  }
`;