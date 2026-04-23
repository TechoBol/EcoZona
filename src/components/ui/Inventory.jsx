import styled from "styled-components";

/* WRAPPER */
export const Wrapper = styled.div`
  min-height: 100vh;
  background: #ffffff;
  padding: 20px;
`;

/* HEADER */
export const Header = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 20px;
`;

/* TITLE */
export const Title = styled.h1`
  font-family: var(--font-title);
  font-size: 25px;
  font-weight: 700;
  color: #000;
  text-align: center;
  justify-self: center;
`;

/* PROFILE */
export const ProfileButton = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 30px;
  background: #404594;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

export const Initial = styled.span`
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
`;

/* DROPDOWN */
export const Dropdown = styled.div`
  position: absolute;
  right: 0;
  margin-top: 10px;

  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  overflow: hidden;
  min-width: 180px;
  z-index: 50;
`;

/* USER INFO */
export const UserInfo = styled.div`
  padding: 12px;
  border-bottom: 1px solid #eee;
`;

export const Name = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #000;
`;

export const Role = styled.p`
  font-size: 12px;
  color: gray;
`;

/* LOGOUT */
export const LogoutButton = styled.button`
  width: 100%;
  padding: 10px 12px;

  display: flex;
  align-items: center;
  gap: 8px;

  background: ${({ $active }) => ($active ? "#f3f4f6" : "#ffffff")};
  border: none;

  cursor: pointer;
  font-size: 14px;
  color: #000;

  &:hover {
    background: #f3f4f6;
  }
`;

/* SEARCH */
export const SearchBar = styled.div`
  position: relative;
  margin-bottom: 15px;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 40px 0 15px;

  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: #fff;

  font-size: 13px;
  outline: none;
`;

export const ScanButton = styled.div`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
`;

/* GRID */
export const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
`;

/* CARD */
export const Card = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  padding: 12px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);

  border: 2px solid
    ${(props) =>
      props.$error
        ? "#dc655f"
        : props.$selected
        ? "#69d584"
        : "transparent"};

  transition: all 0.2s ease;

  ${(props) =>
    props.$error &&
    `
    animation: shake 0.25s;
  `}

  @keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    50% { transform: translateX(4px); }
    75% { transform: translateX(-3px); }
    100% { transform: translateX(0); }
  }
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
`;

export const ProductInfo = styled.div`
  padding: 10px;
`;

export const ProductName = styled.p`
  font-size: 14px;
  font-weight: 600;
`;

export const ProductCode = styled.p`
  font-size: 12px;
  color: gray;
`;

export const ProductFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
`;

export const Price = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

export const Stock = styled.span`
  font-size: 16px;
  font-weight: 700;
`;

/* BOTTOM ACTIONS */
export const BottomActions = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;

  display: flex;
  align-items: center;
  gap: 12px;
`;

/* BOTÓN + */
export const AddProductButton = styled.button`
  width: 52px;
  height: 52px;

  border-radius: 50%;

  background: #C85F1C;
  color: #ffffff;

  border: 2px solid #C85F1C;

  font-size: 26px;
  font-weight: bold;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);

  &:active {
    transform: scale(0.95);
  }
`;

/* BOTÓN PRINCIPAL */
export const AddToCartButton = styled.button`
  flex: 1;
  height: 52px;

  background: #404594;
  color: #ffffff;

  border: none;
  border-radius: 30px;

  font-size: 16px;
  font-weight: 600;

  display: flex;
  justify-content: center;
  align-items: center;

  gap: 10px;

  cursor: pointer;

  box-shadow: 0 4px 10px rgba(61, 68, 201, 0.25);

  &:active {
    transform: scale(0.98);
  }
`;
