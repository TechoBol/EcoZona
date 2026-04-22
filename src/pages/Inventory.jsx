import React from "react";
import UserMenu from "../components/menus/UserMenu";
import { ScanLine } from "lucide-react";

import {
  Wrapper,
  Header,
  Title,
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
  BottomActions,
  AddProductButton,
  AddToCartButton
} from "../components/ui/Inventory";

function Inventory() {
  return (
    <Wrapper>

      {/* HEADER */}
      <Header>
        <UserMenu />
        <Title>Inventario</Title>
        <div />
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

      {/* BOTTOM ACTIONS */}
      <BottomActions>

        {/* ➕ */}
        <AddProductButton>
          +
        </AddProductButton>

        {/* 🟣 */}
        <AddToCartButton>
          Añadir al Carrito
        </AddToCartButton>

      </BottomActions>

    </Wrapper>
  );
}

export default Inventory;