import React from "react";
import {
  Wrapper,
  Header,
  Title,
  CartButton,
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
  Stock
} from "../components/ui/Inventory";

import { ShoppingCart, ScanLine } from "lucide-react";

function Inventory() {
  return (
    <Wrapper>
      
      {/* HEADER */}
      <Header>
        <Title>Inventario</Title>

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

    </Wrapper>
  );
}

export default Inventory;