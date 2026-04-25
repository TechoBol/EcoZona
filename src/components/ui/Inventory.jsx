import styled from "styled-components";
import {theme} from "./Theme"

/* Wrapper */
export const Wrapper = styled.div`
  height: 100dvh; 
  background: ${theme.colors.background};;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden; 
`;

/* Header */
export const Header = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 20px;
`;

/* Title */
export const Title = styled.h1`
  font-family: var(--font-title);
  font-size: 20px;
  font-weight: 700;
  color: ${theme.colors.text};
  text-align: center;
  justify-self: center;
`;

/* Profile */
export const ProfileButton = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 30px;
  background: transparent;

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

/* Dropdown */
export const Dropdown = styled.div`
  position: absolute;
  right: 0;
  margin-top: 10px;

  background: ${theme.colors.background};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  overflow: hidden;
  min-width: 180px;
  z-index: 50;
`;

/* User Info */
export const UserInfo = styled.div`
  padding: 12px;
  border-bottom: 1px solid #eee;
  background: ${theme.colors.background};
`;

export const Name = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text};
`;

export const Role = styled.p`
  font-size: 12px;
  color: ${theme.colors.textSecondary};
`;

/* Logout */
export const LogoutButton = styled.button`
  width: 100%;
  padding: 10px 12px;

  display: flex;
  align-items: center;
  gap: 8px;
  background: ${theme.colors.background};
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: ${theme.colors.primary};

  svg {
    color: ${theme.colors.primary};
  }

  &:hover {
    background: #ffe5e5;
  }
`;

/* Search */
export const SearchBar = styled.div`
  position: relative;
  margin-bottom: 12px;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 40px 0 15px;

  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: ${theme.colors.background};

  font-size: 13px;
  outline: none;

  box-sizing: border-box;
`;

export const ScanButton = styled.div`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
`;

/* ScrollArea — único componente nuevo */
export const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding-bottom: 80px;
`;

/* Grid */
export const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
`;

/* Card */
export const Card = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  padding: 12px;
  background: ${theme.colors.background};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  overflow: hidden;

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
    0%   { transform: translateX(0); }
    25%  { transform: translateX(-4px); }
    50%  { transform: translateX(4px); }
    75%  { transform: translateX(-3px); }
    100% { transform: translateX(0); }
  }
`;

/* Menu Option */
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
    background: ${theme.colors.background};
  }
`;

/* Image */
export const ProductImage = styled.img`
  width: calc(100% + 24px);
  height: 140px;
  object-fit: cover;
  margin: -12px -12px 0 -12px;
`;

/* Info */
export const ProductInfo = styled.div`
  padding: 10px 4px 4px 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const ProductName = styled.p`
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ProductCode = styled.p`
  font-size: 12px;
  color: ${theme.colors.textSecondary};
  margin: 0;
`;

export const ProductFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
  gap: 4px;
`;

export const Price = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${theme.colors.textSecondary};
  white-space: nowrap;
`;

export const Stock = styled.span`
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
`;

/* Button Actions */
export const BottomActions = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;

  display: flex;
  align-items: center;
  gap: 12px;
`;

/* + Button */
export const AddProductButton = styled.button`
  width: 40px;
  height: 40px;

  border-radius: 50%;
  background: transparent;
  color: ${theme.colors.text};
  border: none;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  &:active {
    transform: scale(0.95);
  }

  &:hover {
    opacity: 0.9;
  }
`;

/* Escanner Button */
export const ScannerButton = styled.button`
  width: 52px;
  height: 52px;

  border-radius: 50%;
  background: ${theme.colors.secondary};;
  color: ${theme.colors.background};

  border: 2px solid ${theme.colors.secondary};

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);

  &:active {
    transform: scale(0.95);
  }

  &:hover {
    opacity: 0.9;
  }
`;

/* Principal Button */
export const AddToCartButton = styled.button`
  flex: 1;
  height: 52px;

  background: ${theme.colors.primary};
  color: ${theme.colors.background};

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

/* Scanner Overlay */
export const ScannerOverlay = styled.div`
  position: fixed;
  inset: 0;

  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(4px);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 9999;
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;

  background: rgba(0, 0, 0, 0.2);

  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);

  z-index: 40;
`;