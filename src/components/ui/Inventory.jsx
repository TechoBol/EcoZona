import styled from "styled-components";

/* WRAPPER */
export const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
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

export const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 5px 100px 5px;
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
  background: ${({ $active }) => ($active ? "#ffe5e5" : "#ffffff")};
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #e53935;
  svg {
    color: #e53935;
  }
  &:hover {
    background: #ffe5e5;
  }
`;

/* SEARCH — mismo ancho que BottomActions (left/right 20px) */
export const SearchBar = styled.div`
  position: relative;
  margin-bottom: 12px;
  /* El Wrapper tiene padding: 20px, así que no necesitamos ajuste extra */
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

  box-sizing: border-box; /* ✅ evita que se desborde */
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);

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

export const MenuOption = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 10px 12px;
  border: none;
  background: ${({ $active }) => ($active ? "#f2f2f2" : "transparent")};

  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: #f2f2f2;
  }
`;
export const ProductImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 25px;
`;

export const ProductInfo = styled.div`
  padding: 10px 4px 4px 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const ProductName = styled.p`
  font-size: 15px;       /* ✅ bajado un poco para que respire */
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* ✅ corta nombres largos con "..." */
`;

export const ProductCode = styled.p`
  font-size: 12px;
  color: gray;
  margin: 0;
`;

export const ProductFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
  gap: 4px;              /* ✅ separación mínima garantizada */
`;

export const Price = styled.span`
  font-size: 13px;       /* ✅ reducido para que no choque */
  font-weight: 500;
  color: gray;
  white-space: nowrap;
`;

export const Stock = styled.span`
  font-size: 13px;       /* ✅ mismo tamaño que Price */
  font-weight: 700;
  white-space: nowrap;
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

  background: #c85f1c;
  color: #ffffff;

  border: 2px solid #c85f1c;

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