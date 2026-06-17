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
  CustomerSection,
  SectionTitle,
  InputGroup,
  Label,
  Input,
  TextArea,
} from "../components/ui/Cart";

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
        <BackButton
          onClick={() => navigate("/inventory/" + token, { replace: true })}
        >
          <ArrowLeft size={22} />
        </BackButton>
        <Title>Venta</Title>
      </Header>

      <ProductList>
        {cartItems.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              flex: 1,
              height: "100%",
              padding: "20px",
              minHeight: "60vh",
              color: "gray",
              gap: "10px",
            }}
          >
            <div style={{ fontSize: "50px" }}>🛒</div>
            <h3 style={{ margin: 0 }}>Ups... el carrito está vacío</h3>
            <p style={{ margin: 0, fontSize: "14px" }}>
              Es hora de llenarlo. 🚀
            </p>
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
                      <PriceDivider>|</PriceDivider>
                      <ProductSubtotal>
                        Bs {(item.finalPrice * item.quantity).toFixed(2)}
                      </ProductSubtotal>
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
          ))
        )}
      </ProductList>

      <Footer>
        <CustomerSection>
          <SectionTitle>Datos del cliente</SectionTitle>

          <InputGroup>
            <Label>Nombre completo</Label>

            <Input
              placeholder="Ingresa tu nombre"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <Label>Teléfono</Label>

            <Input
              placeholder="77777777"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <Label>CI / NIT</Label>

            <Input
              placeholder="Opcional"
              value={customerDocument}
              onChange={(e) => setCustomerDocument(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <Label>Dirección</Label>

            <Input
              placeholder="Opcional"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <Label>Nota del pedido</Label>

            <TextArea
              placeholder="Ej: entregar por la tarde..."
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
            />
          </InputGroup>
        </CustomerSection>
        <SummaryRow>
          <span>Subtotal:</span>
          <span>Bs {subtotal.toFixed(2)}</span>
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

export default PublicCart;
