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
  AddToCartButton,
} from "../components/ui/Inventory";

import { ScanLine } from "lucide-react";
import UserMenu from "../components/menus/UserMenu";

// 🛒 STORE GLOBAL
import { useCartStore } from "../components/store/cartStore";

function Inventory() {
  const { logOut } = useAuthentication();
  const navigate = useNavigate();

  const addToCart = useCartStore((state) => state.addToCart);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const pressTimer = useRef(null);
  const longPressProductId = useRef(null);

  const products = [
    { id: 1, name: "Termo Stanley", code: "123456", price: "150.00", stock: 10 },
    { id: 2, name: "Coca Cola", code: "654321", price: "20.00", stock: 8 },
  ];

  const handleMouseDown = (productId) => {
    longPressProductId.current = productId;

    pressTimer.current = setTimeout(() => {
      navigate(`/product/${productId}`);
    }, 700);
  };

  const handleMouseUp = () => {
    clearTimeout(pressTimer.current);
    longPressProductId.current = null;
  };

  const toggleSelect = (product) => {
    setSelectedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);

      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }

      return [...prev, product];
    });
  };

  const handleClick = (product) => {
    toggleSelect(product);
  };

  const isSelected = (id) =>
    selectedProducts.some((p) => p.id === id);

  const handleGoToCart = () => {
    selectedProducts.forEach((product) => {
      addToCart(product);
    });

    navigate("/cart");
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
              <ProductCode>{product.code}</ProductCode>

              <ProductFooter>
                <Price>Bs {product.price}</Price>
                <Stock>Stock: {product.stock}</Stock>
              </ProductFooter>
            </ProductInfo>
          </Card>
        ))}
      </ProductsGrid>

      <BottomActions>
        <AddProductButton onClick={() => navigate("/product")}>
          +
        </AddProductButton>

        <AddToCartButton onClick={handleGoToCart}>
          Ir al carrito ({selectedProducts.length})
        </AddToCartButton>
      </BottomActions>
    </Wrapper>
  );
}

export default Inventory;