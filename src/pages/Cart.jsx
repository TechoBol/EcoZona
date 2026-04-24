import React, { useEffect, useState } from "react";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";

import {
  Wrapper,
  Header,
  Title,
  CartContainer,
  ProductList,
  ProductCard,
  ProductImage,
  RightSection,
  TopRow,
  ProductText,
  ProductName,
  ProductPrice,
  QuantityControls,
  QuantityText,
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

import { useCartStore } from "../components/store/cartStore";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAmazonS3 } from "../hooks/useAmazonS3";

const Cart = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    removeItem,
    increaseQty,
    decreaseQty,
    getTotal,
    clearCart,
  } = useCartStore();

  const { createSale } = useCart();
  const [descuento, setDescuento] = useState("0");

  const subtotal = getTotal();
  const discountValue = Number(descuento || 0);
  const total = Math.max(0, subtotal - discountValue);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    if (isProcessing) return; // evita doble click

    setIsProcessing(true); // bloquea

    const payload = {
      products: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      discount: Number(descuento),
    };

    try {
      await createSale(payload, cartItems, subtotal, Number(descuento), total);

      clearCart();
      setDescuento("0");
      navigate("/inventory", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Error al procesar la venta");
    } finally {
      setIsProcessing(false); // 🔓 por si falla
    }
  };

  // IMÁGENES
  const [imageUrls, setImageUrls] = useState({});
  const { getFileUrl } = useAmazonS3();

  useEffect(() => {
    if (!cartItems.length) return;

    const loadImages = async () => {
      const urls = {};

      for (const item of cartItems) {
        if (!item.imageUrl) continue;
        if (imageUrls[item.id]) continue;

        const isS3Key = item.imageUrl.startsWith("ECOZONA/");

        if (!isS3Key) {
          urls[item.id] = null;
          continue;
        }

        try {
          const url = await getFileUrl(item.imageUrl);
          urls[item.id] = url;
        } catch {
          urls[item.id] = null;
        }
      }

      if (Object.keys(urls).length > 0) {
        setImageUrls((prev) => ({ ...prev, ...urls }));
      }
    };

    loadImages();
  }, [cartItems]);

  return (
    <Wrapper>
      <Header>
        <BackButton onClick={() => navigate("/inventory", { replace: true })}>
          <ArrowLeft size={22} />
        </BackButton>
        <Title>Venta</Title>
      </Header>

      <CartContainer>
        <ProductList>
          {cartItems.map((item) => (
            <ProductCard key={item.id}>
              <ProductImage
                src={imageUrls[item.id] || "https://via.placeholder.com/150"}
                alt={item.name}
              />

              <RightSection>
                <TopRow>
                  <ProductText>
                    <ProductName>{item.name}</ProductName>
                    <ProductPrice>Bs {item.finalPrice}</ProductPrice>
                  </ProductText>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 6,
                    }}
                  >
                    {/* FILA 1: CONTROLES */}
                    <QuantityControls>
                      <Button onClick={() => decreaseQty(item.id)}>
                        <Minus size={18} />
                      </Button>

                      <QuantityText>{item.quantity}</QuantityText>

                      <Button onClick={() => increaseQty(item.id)}>
                        <Plus size={18} />
                      </Button>
                    </QuantityControls>

                    {/* FILA 2: TRASH */}
                    <DeleteButton onClick={() => removeItem(item.id)}>
                      <Trash2 size={18} />
                    </DeleteButton>
                  </div>
                </TopRow>
              </RightSection>
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

        <CheckoutButton
          onClick={handleCheckout}
          disabled={isProcessing}
        >
          {isProcessing ? "Procesando..." : "Finalizar Venta"}
        </CheckoutButton>
      </Footer>
    </Wrapper>
  );
};

export default Cart;