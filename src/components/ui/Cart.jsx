import styled from "styled-components";

/* WRAPPER */
export const Wrapper = styled.div`
  min-height: 100vh;
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
  justify-content: center; /* centra el título */
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
  color: #C85F1C;

  &:hover {
    opacity: 0.6;
  }
`;

export const Title = styled.h1`
  font-size: 22px;
  font-weight: bold;
  color: #111;
  font-family: var(--font-title);
  text-align: center;
`;

/* CART CONTAINER */
export const CartContainer = styled.div`
  flex: 1;
  margin-top: 15px;
`;

/* LIST */
export const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

/* CARD */
export const ProductCard = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 14px;
  padding: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  gap: 12px;
`;

/* IMAGE */
export const ProductImage = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 12px;
  object-fit: cover;
`;

/* INFO */
export const ProductInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const ProductName = styled.span`
  font-weight: 600;
  font-size: 20px;
`;

export const ProductCode = styled.span`
  font-size: 12px;
  color: #999;
`;

export const ProductPrice = styled.span`
  font-size: 14px;
  font-weight: 500;
  margin-top: 4px;
  color: gray:
`;

/* QUANTITY */
export const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

/* BUTTON */
export const Button = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: #eee;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #ddd;
  }
`;

/* DELETE */
export const DeleteButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #ff3b30;
  display: flex;
  align-items: center;
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
  align-items: center;
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

/* CHECKOUT */
export const CheckoutButton = styled.button`
  width: 100%;
  margin-top: 15px;
  background: #404594;
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

/* DISCOUNT */
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
    border-color: #C85F1C;
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