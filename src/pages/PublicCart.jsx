import React, { useEffect, useState } from "react";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";

import {
  Wrapper, Header, Title, BackButton, CartBadge,
  ProductList, SectionLabel,
  ProductCard, ProductImage, RightSection, TopRow,
  ProductText, ProductName, ProductPriceRow, ProductPrice,
  PriceDivider, ProductSubtotal,
  QuantityControls, QuantityText, Button, DeleteButton,
  Footer, CustomerSection, SectionTitle,
  InputGroup, TwoColumnRow, Label, Input, TextArea, PhonePrefix,
  SummaryCard, SummaryRow, Total, CheckoutButton,
} from "../components/ui/PublicCart";
import { notificationToast } from "../services/toasts";
import { theme } from "../components/ui/Theme";
import { useCartStore } from "../components/store/cartStore";
import { useNavigate } from "react-router-dom";
import { usePublicCart } from "../hooks/usePublicCart";
import { useAmazonS3 } from "../hooks/useAmazonS3";
import Swal from "sweetalert2";
import socket from "../services/SocketIOConnection";
import { useParams } from "react-router-dom";

const PublicCart = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const {
    cartItems,
    removeItem,
    increaseQty,
    decreaseQty,
    getTotal,
    clearCart,
  } = useCartStore();

  const { createSale } = usePublicCart();
  const [descuento, setDescuento] = useState("0");

  const subtotal = getTotal();
  const discountValue = Number(descuento || 0);
  const total = Math.max(0, subtotal - discountValue);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleIncrease = (item) => {
    const blocked = increaseQty(item.id);
    if (blocked) {
      const stock = item.inventories?.[0]?.quantity ?? item.stock;
      notificationToast(
        stock != null
          ? `Solo hay ${stock} unidades disponibles`
          : "No hay más stock disponible"
      );
    }
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

    // PASO 2B: Pago QR
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

      metodoPago,

      codigoTransaccion,

      customerName,
      customerPhone,
      customerDocument,
      customerAddress,
      customerNote,
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
      navigate("/inventory/" + token, { replace: true });
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
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerDocument, setCustomerDocument] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerNote, setCustomerNote] = useState("");

  return (
    <Wrapper>
      <Header>
        <BackButton onClick={() => navigate("/inventory/" + token, { replace: true })}>
          <ArrowLeft size={18} />
        </BackButton>
        <Title>Tu carrito</Title>
        <CartBadge>{cartItems.length} {cartItems.length === 1 ? "producto" : "productos"}</CartBadge>
      </Header>

      <ProductList>
        <SectionLabel>Productos seleccionados</SectionLabel>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: theme.colors.textSecondary }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
            <p style={{ fontWeight: 600 }}>El carrito está vacío</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Vuelve al inventario y agrega productos.</p>
          </div>
        ) : (
          cartItems.map((item) => (
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
                      <PriceDivider>·</PriceDivider>
                      <ProductSubtotal>Bs {(item.finalPrice * item.quantity).toFixed(2)}</ProductSubtotal>
                    </ProductPriceRow>
                  </ProductText>
                  <DeleteButton onClick={() => removeItem(item.id)}>
                    <Trash2 size={16} />
                  </DeleteButton>
                </TopRow>
                <QuantityControls>
                  <Button onClick={() => decreaseQty(item.id)}>
                    <Minus size={18} />
                  </Button>
                  <QuantityText>{item.quantity}</QuantityText>
                  <Button onClick={() => handleIncrease(item)}>
                    <Plus size={18} />
                  </Button>
                </QuantityControls>
              </RightSection>
            </ProductCard>
          ))
        )}
      </ProductList>

      <Footer>
        <SectionLabel>Datos del cliente</SectionLabel>
        <CustomerSection>
          <SectionTitle>Información de contacto</SectionTitle>

          <InputGroup>
            <Label>Nombre completo</Label>
            <Input placeholder="Ej: Juan Pérez" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          </InputGroup>

          <TwoColumnRow>
            <InputGroup>
              <Label>Teléfono</Label>
              <PhonePrefix>
                <span>🇧🇴</span>
                <input placeholder="7XXXXXXX" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} maxLength={8} inputMode="numeric" />
              </PhonePrefix>
            </InputGroup>
            <InputGroup>
              <Label>CI / NIT</Label>
              <Input placeholder="Ej: 123456789" value={customerDocument} onChange={(e) => setCustomerDocument(e.target.value)} />
            </InputGroup>
          </TwoColumnRow>

          <InputGroup>
            <Label>Dirección</Label>
            <Input placeholder="Ej: Av. Ayacucho #123, Cochabamba" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} />
          </InputGroup>

          <InputGroup>
            <Label>Nota del pedido</Label>
            <TextArea placeholder="Ej: entregar por la tarde..." value={customerNote} onChange={(e) => setCustomerNote(e.target.value)} />
          </InputGroup>
        </CustomerSection>

        <SectionLabel>Resumen</SectionLabel>
        <SummaryCard>
          <SummaryRow>
            <span>Subtotal ({cartItems.length} items)</span>
            <span>Bs {subtotal.toFixed(2)}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Envío</span>
            <span style={{ color: theme.colors.primary }}>A coordinar</span>
          </SummaryRow>
          <Total>
            <span>Total</span>
            <span>Bs {total.toFixed(2)}</span>
          </Total>
          <CheckoutButton onClick={handleCheckout} disabled={isProcessing}>
            {isProcessing ? "Procesando..." : "Finalizar pedido"}
          </CheckoutButton>
        </SummaryCard>
      </Footer>
    </Wrapper>
  );
};

export default PublicCart;