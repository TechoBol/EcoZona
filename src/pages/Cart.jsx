import React, { useEffect, useState } from "react";
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

import { ArrowLeft, Trash2 } from "lucide-react";
import { useCartStore } from "../components/store/cartStore";
import { useNavigate } from "react-router-dom";
import { useLoginStore } from "../components/store/loginStore";
import { useCart } from "../hooks/useCart";
import { generarPDF } from "../components/pdf/generarPDF";
import { useAmazonS3 } from "../hooks/useAmazonS3";
import Swal from "sweetalert2";

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

  const generatePayload = () => {
    return {
      products: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      discount: discountValue,
    };
  };

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
    confirmButtonColor: "#28a745",
    denyButtonColor: "#007bff",
  });

  // Canceló
  if (confirmResult.isDismissed) return;

  // PASO 2A: Pago en efectivo
  if (confirmResult.isConfirmed) {
    await finalizarVenta({ metodoPago: "efectivo", codigoTransaccion: null });
    Swal.fire({
      title: "¡Venta realizada!",
      text: "Pago en efectivo registrado correctamente.",
      icon: "success",
      confirmButtonColor: "#28a745",
    });
    return;
  }

  // PASO 2B: Pago QR → pedir código de transacción
  if (confirmResult.isDenied) {
    const qrResult = await Swal.fire({
      title: "Pago QR",
      text: "Ingresa el código de transacción",
      input: "text",
      inputPlaceholder: "Ej: TRX-123456",
      inputAttributes: { autocapitalize: "off" },
      showCancelButton: true,
      confirmButtonText: "Confirmar pago",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#007bff",
      showLoaderOnConfirm: true,
      inputValidator: (value) => {
        if (!value || value.trim() === "") {
          return "Debes ingresar el código de transacción";
        }
      },
      preConfirm: async (codigo) => {
        try {
          return codigo.trim();
        } catch (error) {
          Swal.showValidationMessage(`Error: ${error.message}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (!qrResult.isConfirmed) return;

    await finalizarVenta({ metodoPago: "qr", codigoTransaccion: qrResult.value });

    Swal.fire({
      title: "¡Venta realizada!",
      html: `Pago QR confirmado.<br><b>Código:</b> ${qrResult.value}`,
      icon: "success",
      confirmButtonColor: "#28a745",
    });
  }
};

const finalizarVenta = async ({ metodoPago, codigoTransaccion }) => {
  const payload = {
      products: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      discount: Number(descuento),
      metodoPago: metodoPago,
      codigoTransaccion : codigoTransaccion
    };

    try {
      await createSale(payload, cartItems, subtotal, Number(descuento), total);

      clearCart();
      setDescuento("0");
      navigate("/inventory", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Error al procesar la venta");
    }
};
    /*
    
  };*/
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
          urls[item.id] = null; // fallback al placeholder
          continue;
        }

        try {
          const url = await getFileUrl(item.imageUrl);
          urls[item.id] = url;
        } catch (err) {
          console.error("Error imagen:", err);
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

              <ProductInfo>
                <ProductName>{item.name}</ProductName>
                <ProductCode>{item.code}</ProductCode>
                <ProductPrice style={{ color: "gray" }}>
                  Bs {item.finalPrice}
                </ProductPrice>
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
