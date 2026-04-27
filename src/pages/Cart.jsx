import React, { useEffect, useState } from "react";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";

import {
  Wrapper,
  Header,
  Title,
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
  ProductPriceRow,
  PriceDivider,
  ProductSubtotal,
} from "../components/ui/Cart";

import { useCartStore } from "../components/store/cartStore";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAmazonS3 } from "../hooks/useAmazonS3";
import Swal from "sweetalert2";
import socket from "../services/SocketIOConnection";
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
      Swal.fire({
        title: "Carrito vacío",
        text: "Agrega productos antes de continuar.",
        icon: "warning",
      });
      return;
    }

    // PASO 1: Confirmar la venta
    const confirmResult = await Swal.fire({
      title: "¿Confirmar venta?",
      text: "Selecciona el método de pago",
      icon: "question",

      showDenyButton: true,

      confirmButtonText: "💵 Efectivo",
      denyButtonText: "📱 QR",

      confirmButtonColor: "#F20C1F",
      denyButtonColor: "#ffffff",

      customClass: {
        denyButton: "qr-button",
      },
    });

    // Canceló
    if (confirmResult.isDismissed) return;

    if (confirmResult.isConfirmed) {
      await finalizarVenta({ metodoPago: "Efectivo", codigoTransaccion: null });
      Swal.fire({
        title: "¡Venta realizada!",
        text: "Pago en efectivo registrado correctamente.",
        icon: "success",
        confirmButtonColor: "#69d584",
      });
      return;
    }

    // PASO 2B: Pago QR → pedir código de transacción
    if (confirmResult.isDenied) {
      await finalizarVenta({
        metodoPago: "Qr",
        codigoTransaccion: null,
      });

      Swal.fire({
        title: "¡Venta realizada!",
        text: "Pago QR registrado correctamente.",
        icon: "success",
        confirmButtonColor: "#28a745",
      });
    }
  };

  const finalizarVenta = async ({ metodoPago, codigoTransaccion }) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const payload = {
      products: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      discount: Number(descuento),
      metodoPago: metodoPago,
      codigoTransaccion: codigoTransaccion,
    };

    try {
      const result = await createSale(
        payload,
        cartItems,
        subtotal,
        Number(descuento),
        total,
      );
      console.log("Venta");
      console.log(result);
      clearCart();
      setDescuento("0");
      socket.emit("newCartProduct", result);
      navigate("/inventory", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Error al procesar la venta");
    } finally {
      setIsProcessing(false);
    }
  };

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
                  <ProductPriceRow>
                    <ProductPrice>Bs {item.finalPrice}</ProductPrice>
                    <PriceDivider>|</PriceDivider>
                    <ProductSubtotal>Bs {(item.finalPrice * item.quantity).toFixed(2)}</ProductSubtotal>
                  </ProductPriceRow>
                </ProductText>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 6,
                  }}
                >
                  <QuantityControls>
                    <Button onClick={() => decreaseQty(item.id)}>
                      <Minus size={18} />
                    </Button>
                    <QuantityText>{item.quantity}</QuantityText>
                    <Button onClick={() => increaseQty(item.id)}>
                      <Plus size={18} />
                    </Button>
                  </QuantityControls>

                  <DeleteButton onClick={() => removeItem(item.id)}>
                    <Trash2 size={18} />
                  </DeleteButton>
                </div>
              </TopRow>
            </RightSection>
          </ProductCard>
        ))}
      </ProductList>

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
                if (value === "") {
                  setDescuento("");
                  return;
                }
                const num = Number(value);
                if (num < 0) return;
                if (num > subtotal) {
                  setDescuento(String(subtotal));
                } else {
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

        <CheckoutButton onClick={handleCheckout} disabled={isProcessing}>
          {isProcessing ? "Procesando..." : "Finalizar Venta"}
        </CheckoutButton>
      </Footer>
    </Wrapper>
  );
};

export default Cart;
