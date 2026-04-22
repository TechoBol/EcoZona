import styled, { createGlobalStyle } from "styled-components";

/* WRAPPER */
export const Wrapper = styled.div`
  min-height: 100vh;
  background: #ffffff;
  padding: 20px;
`;

/* HEADER */
export const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  margin-bottom: 20px;
`;

export const Title = styled.h1`
  font-family: var(--font-title);
  font-size: 25px;
  font-weight: 700;
  color: #000;
  text-align: center;
`;

/* BOTÓN PERFIL */
export const ProfileButton = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #3D44C9;

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

/* LOGOUT ITEM */
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

/* CARRITO (DERECHA) */
export const CartButton = styled.div`
  justify-self: end;

  width: 40px;
  height: 40px;
  background: #ffffff;
  border-radius: 10px;

  display: flex;
  justify-content: center;
  align-items: center;

  color: #3D44C9;
  cursor: pointer;
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

  &::placeholder {
    color: rgba(0, 0, 0, 0.4);
  }
`;

export const ScanButton = styled.div`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);

  width: 28px;
  height: 28px;

  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: rgba(0, 0, 0, 0.3);
`;

/* GRID */
export const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
`;

/* CARD */
export const Card = styled.div`
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;

  display: flex;
  flex-direction: column;

  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

/* IMAGE */
export const ProductImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
`;

/* INFO */
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

/* FOOTER */
export const ProductFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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