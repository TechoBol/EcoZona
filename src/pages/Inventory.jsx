import React from "react";
import UserMenu from "../components//menus/UserMenu";

import {
  Wrapper,
  Header,
  Title,
  CartButton,
  LogoutButton,
  SearchBar,
  SearchInput,
  ScanButton,
  ProductsGrid,
  Card,
  ProductImage,
  ProductInfo,
  ProductName,
  ProductCode,
  ProductFooter,
  Price,
  Stock,
  AddButton
} from "../components/ui/Inventory";

import { ShoppingCart, ScanLine, LogOut } from "lucide-react";
import useAuthentication from "../hooks/useAuthentication";

function Inventory() {
  const { logOut } = useAuthentication();

  return (
    <Wrapper>

      {/* HEADER */}
      <Header>

        {/* IZQUIERDA - LOGOUT */}
        <LogoutButton onClick={logOut}>
          <LogOut size={22} />
        </LogoutButton>

        {/* CENTRO - TITULO */}
        <Title>Inventario</Title>

        {/* DERECHA - CARRITO */}
        <CartButton>
          <ShoppingCart size={22} />
        </CartButton>

      </Header>

      {/* SEARCH */}
      <SearchBar>
        <SearchInput placeholder="Buscar" />

        <ScanButton>
          <ScanLine size={18} />
        </ScanButton>
      </SearchBar>

      {/* PRODUCTS */}
      <ProductsGrid>

        <Card>
          <ProductImage src="https://via.placeholder.com/150" />

          <ProductInfo>
            <ProductName>Termo Stanley</ProductName>
            <ProductCode>123456</ProductCode>

            <ProductFooter>
              <Price>Bs 150.00</Price>
              <Stock>10</Stock>
            </ProductFooter>
          </ProductInfo>
        </Card>

      </ProductsGrid>

      {/* BOTÓN AGREGAR */}
      <AddButton>
        Añadir Producto
      </AddButton>

    </Wrapper>
  );
}

export default Inventory;