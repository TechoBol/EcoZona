import styled from "styled-components";

/* WRAPPER */
export const Wrapper = styled.div`
  min-height: 100dvh;
  background: #ffffff;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

/* HEADER */
export const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
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
  color: #0D0D0D;

  &:hover {
    opacity: 0.6;
  }
`;

export const Title = styled.h1`
  font-size: 22px;
  font-weight: bold;
  color: #0D0D0D;
  font-family: var(--font-title);
  text-align: center;
`;

/* CART */
export const CartContainer = styled.div`
  flex: 1;
  margin-top: 15px;
`;

export const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
export const DiscountInput = styled.input`
  width: 70px;
  text-align: right;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 2px 6px;
  font-size: 14px;
  color: #111;
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
  color: #999;
  margin-right: 4px;
`;

/* CARD */
export const ProductCard = styled.div`
  display: flex;
  align-items: stretch;
  background: #fff;
  border-radius: 14px;
  padding: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  gap: 12px;
  overflow: hidden;
`;

/* IMAGE FULL HEIGHT */
export const ProductImage = styled.img`
  width: 90px;
  height: calc(100% + 24px);
  object-fit: cover;

  margin: -12px 0 -12px -12px;

  border-top-left-radius: 14px;
  border-bottom-left-radius: 14px;

  flex-shrink: 0;
`;

/* RIGHT SIDE */
export const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

/* TOP ROW */
export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/* TEXT */
export const ProductText = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ProductName = styled.span`
  font-weight: 600;
  font-size: 22px;
`;

export const ProductPrice = styled.span`
  font-size: 14px;
  color: gray;
  margin-top: 4px;
`;

/* DELETE BUTTON */
export const DeleteButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #ff3b30;

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

/* QUANTITY */
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

/* FOOTER */
export const Footer = styled.div`
  margin-top: auto;
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
  background: #F20C1F;
  color: white;
  padding: 12px;
  border-radius: 30px;
  border: none;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

export const ActionsColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;