import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuthentication from "../hooks/useAuthentication";

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
  LogoutButton,
  AddToCartButton,
} from "../components/ui/Inventory";

import { ShoppingCart, ScanLine, LogOut } from "lucide-react";
import UserMenu from "../components/menus/UserMenu";

function Inventory() {
  const { logOut } = useAuthentication();
  const navigate = useNavigate();

  const [selectedProducts, setSelectedProducts] = useState([]);

  const pressTimer = useRef(null);
  const isLongPress = useRef(false);

  const products = [
    { id: 1, name: "Termo Stanley" },
    { id: 2, name: "Coca Cola" },
  ];

  // 🔥 LONG PRESS
  const handleMouseDown = (productId) => {
    isLongPress.current = false;

    pressTimer.current = setTimeout(() => {
      isLongPress.current = true;

      console.log("👉 LONG PRESS → ir a detalle");

      navigate(`/product/${productId}`);
    }, 700);
  };

  // 🔥 SOLO LIMPIA TIMER
  const handleMouseUp = () => {
    clearTimeout(pressTimer.current);
  };

  // 🔥 CLICK NORMAL (SELECCIÓN)
  const handleClick = (product) => {
    if (isLongPress.current) return;

    console.log("🖱️ CLICK NORMAL");

    toggleSelect(product);
  };

  // 🔥 AGREGAR / QUITAR
  const toggleSelect = (product) => {
    setSelectedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);

      if (exists) {
        const updated = prev.filter((p) => p.id !== product.id);
        console.log("❌ REMOVIDO:", product.id);
        console.log("📦 LISTA:", updated);
        return updated;
      } else {
        const updated = [...prev, product];
        console.log("✅ AGREGADO:", product.id);
        console.log("📦 LISTA:", updated);
        return updated;
      }
    });
  };

  // 🔥 VERIFICAR SI ESTÁ SELECCIONADO
  const isSelected = (id) => {
    return selectedProducts.some((p) => p.id === id);
  };

  return (
    <Wrapper>
      <Header>
        <UserMenu />
        <Title>Inventario</Title>
        <div />
      </Header>

      <SearchBar>
        <SearchInput placeholder="Buscar producto..." />
        <ScanButton>
          <ScanLine size={18} />
        </ScanButton>
      </SearchBar>

      <ProductsGrid>
        {products.map((product) => (
          <Card
            key={product.id}
            $selected={isSelected(product.id)}
            onContextMenu={(e) => e.preventDefault()}
            onMouseDown={() => handleMouseDown(product.id)}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={() => handleClick(product)}
            onTouchStart={() => handleMouseDown(product.id)}
            onTouchEnd={handleMouseUp}
          >
            <ProductImage src="https://via.placeholder.com/150" />

            <ProductInfo>
              <ProductName>{product.name}</ProductName>
              <ProductCode>123456</ProductCode>

              <ProductFooter>
                <Price>Bs 150.00</Price>
                <Stock>Stock: 10</Stock>
              </ProductFooter>
            </ProductInfo>
          </Card>
        ))}
      </ProductsGrid>

      {/* BOTTOM ACTIONS */}
      <BottomActions>
        {/* ➕ */}
        <AddProductButton>+</AddProductButton>

        {/* 🟣 */}
        <AddToCartButton
          onClick={() => console.log("🛒 CARRITO:", selectedProducts)}
        >
          Ir al carrito ({selectedProducts.length})
        </AddToCartButton>
      </BottomActions>
    </Wrapper>
  );
}

export default Inventory;
