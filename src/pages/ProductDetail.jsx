import React, { useEffect, useState } from "react";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Wrapper,
  BackButton,
  Content,
  ImageSection,
  ProductImage,
  InfoSection,
  BadgeRow,
  Badge,
  BrandBadge,
  ProductName,
  PriceLabel,
  ProductPrice,
  Description,
  StockRow,
  StockDot,
  StockText,
  Divider,
  QuantityRow,
  QuantityLabel,
  QuantityControls,
  QtyButton,
  QtyText,
  AddToCartButton,
  ErrorText,
  ActionsSection
} from "../components/ui/ProductDetail";
import { useProductDetail } from "../hooks/useProductDetail";
import { useCartStore } from "../components/store/cartStore";
import { useAmazonS3 } from "../hooks/useAmazonS3";
import Swal from "sweetalert2";

const ProductDetail = () => {
  const { state } = useLocation();
  const token = state?.token;
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, error, fetchProductDetail } = useProductDetail();
  const { addToCart, addToCartWithQuantity } = useCartStore();
  const { getFileUrl } = useAmazonS3();

  const [quantity, setQuantity] = useState(1);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProductDetail(Number(id));
    }
  }, [id]);

  useEffect(() => {
    if (!product?.imageUrl) return;

    const loadImage = async () => {
      const isS3Key = product.imageUrl.startsWith("ECOZONA/");

      if (!isS3Key) {
        setImageUrl(product.imageUrl);
        return;
      }

      try {
        const url = await getFileUrl(product.imageUrl);
        setImageUrl(url);
      } catch (error) {
        console.error("Error al obtener imagen desde S3:", error);
        setImageUrl(null);
      }
    };

    loadImage();
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;

    if (quantity > product.stock) {
      Swal.fire({
        title: "Stock insuficiente",
        text: `Solo hay ${product.stock} unidades disponibles.`,
        icon: "warning",
      });
      return;
    }

    addToCartWithQuantity(
      { ...product, inventories: [{ quantity: product.stock }] },
      quantity
    );

    navigate("/added-to-cart", {
      state: { product, quantity, imageUrl, token },
    });
  };

  if (loading) {
    return (
      <Wrapper>
        <ErrorText>Cargando producto...</ErrorText>
      </Wrapper>
    );
  }

  if (error || !product) {
    return (
      <Wrapper>
        <ErrorText>No se pudo cargar el producto.</ErrorText>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <BackButton onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
      </BackButton>

      <Content>
        <ImageSection>
          <ProductImage
            src={imageUrl || "https://via.placeholder.com/400"}
            alt={product.name}
          />
        </ImageSection>

        <InfoSection>
          <BadgeRow>
            {product.line && (
              <Badge>{product.line.name}</Badge>
            )}
            {product.brandName && (
              <BrandBadge>{product.brandName}</BrandBadge>
            )}
          </BadgeRow>

          <ProductName>{product.name}</ProductName>

          <div>
            <PriceLabel>Precio</PriceLabel>
            <ProductPrice>Bs {product.finalPrice.toFixed(2)}</ProductPrice>
          </div>

          {product.description && (
            <Description>{product.description}</Description>
          )}

          <ActionsSection>
            <QuantityRow>
              <QuantityLabel>Cantidad</QuantityLabel>
              <QuantityControls>
                <QtyButton
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus size={14} />
                </QtyButton>
                <QtyText>{quantity}</QtyText>
                <QtyButton
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus size={14} />
                </QtyButton>
              </QuantityControls>
            </QuantityRow>

            <AddToCartButton
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? "Sin stock" : "Añadir al carrito"}
            </AddToCartButton>
          </ActionsSection>
        </InfoSection>
      </Content>
    </Wrapper>
  );
};

export default ProductDetail;