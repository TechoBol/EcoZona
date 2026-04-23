import React, { useState } from "react";
import {
  Wrapper,
  Header,
  Title,
  CartContainer,
  ProductList,
  ProductCard,
  ProductImage,
  ProductInfo,
  ProductName,
  ProductCode,
  ProductPrice,
  QuantityControls,
  Button,
  DeleteButton,
  Footer,
  SummaryRow,
  Total,
  CheckoutButton,
  DiscountInput,
  DiscountPrefix,
  BackButton,
} from "../components/ui/Cart";

import { ArrowLeft } from "lucide-react";
import { useCartStore } from "../components/store/cartStore";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom"; // 🔥 IMPORTANTE

const Cart = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    removeItem,
    increaseQty,
    decreaseQty,
    getTotal,
    clearCart, // 🔥 NUEVO
  } = useCartStore();

  const [descuento, setDescuento] = useState("0");

  const subtotal = getTotal();
  const discountValue = Number(descuento || 0);
  const total = Math.max(0, subtotal - discountValue);

  const generatePayload = () => {
    const items = cartItems.map((item) => ({
      productId: item.id,
      name: item.name,
      code: item.code,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
    }));

    return {
      items,
      subtotal: Number(subtotal.toFixed(2)),
      discount: Number(discountValue.toFixed(2)),
      total: Number(total.toFixed(2)),
    };
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    const payload = generatePayload();

    console.log("VENTA:", payload);

    // 🔥 AQUÍ IRÁ TU API
    // await createSale(payload);

    // ✅ 1. limpiar carrito
    clearCart();

    // ✅ 2. reset descuento
    setDescuento("0");

    // ✅ 3. redirigir
    navigate("/inventory");
  };

  return (
    <Wrapper>
      <Header>
        <BackButton onClick={() => navigate("/inventory")}>
          <ArrowLeft size={22} />
        </BackButton>

        <Title>Venta</Title>
      </Header>

      <CartContainer>
        <ProductList>
          {cartItems.map((item) => (
            <ProductCard key={item.id}>
              <ProductImage src={item.image} alt={item.name} />

              <ProductInfo>
                <ProductName>{item.name}</ProductName>
                <ProductCode>{item.code}</ProductCode>
                <ProductPrice>Bs {item.price}</ProductPrice>
              </ProductInfo>

              <QuantityControls>
                <Button onClick={() => decreaseQty(item.id)}>-</Button>
                <span>{item.quantity}</span>
                <Button onClick={() => increaseQty(item.id)}>+</Button>
              </QuantityControls>

              <DeleteButton onClick={() => removeItem(item.id)}>
                <Trash2 size={18} />
              </DeleteButton>
            </ProductCard>
          ))}
        </ProductList>
      </CartContainer>

      <Footer>
        <SummaryRow>
          <span>Subtotal:</span>
          <span>Bs {subtotal.toFixed(2)}</span>
        </SummaryRow>

        <SummaryRow>
          <span>Descuento:</span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <DiscountPrefix>Bs</DiscountPrefix>

            <DiscountInput
              type="number"
              min="0"
              value={descuento}
              onFocus={() => {
                if (descuento === "0") setDescuento("");
              }}
              onBlur={() => {
                if (descuento === "") setDescuento("0");
              }}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || Number(value) >= 0) {
                  setDescuento(value);
                }
              }}
            />
          </div>
        </SummaryRow>

        <Total>
          <span>Total:</span>
          <span>Bs {total.toFixed(2)}</span>
        </Total>

        <CheckoutButton onClick={handleCheckout}>
          Finalizar Venta
        </CheckoutButton>
      </Footer>
    </Wrapper>
  );
};

export default Cart;