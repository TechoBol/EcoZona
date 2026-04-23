import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthentication from "../hooks/useAuthentication";
import useInventory from "../hooks/useInventory";

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
import { useCartStore } from "../components/store/cartStore";
import { useAmazonS3 } from "../hooks/useAmazonS3";
function Inventory() {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);

  const {
    products,
    search,
    setSearch,
    onFilterTextBoxChanged
  } = useInventory();

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [errorProductId, setErrorProductId] = useState(null);

  const pressTimer = useRef(null);

  const handleMouseDown = (productId) => {
    pressTimer.current = setTimeout(() => {
      navigate(`/product/${productId}`);
    }, 700);
  };

  const handleMouseUp = () => {
    clearTimeout(pressTimer.current);
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
    const stock = product.inventories?.[0]?.quantity || 0;
    if (stock === 0) {
      setErrorProductId(product.id);
      setTimeout(() => {
        setErrorProductId(null);
      }, 400);
      return;
    }

    toggleSelect(product);
  };

  const isSelected = (id) => selectedProducts.some((p) => p.id === id);

  const handleGoToCart = () => {
    selectedProducts.forEach((product) => {
      addToCart(product);
    });

    navigate("/cart");
  };

  const [imageUrls, setImageUrls] = useState({});
  const { getFileUrl } = useAmazonS3();

  useEffect(() => {
    if (!products.length) return;

    const loadImages = async () => {
      const urls = {};

      for (const product of products) {
        if (!product.imageUrl) continue;
        if (imageUrls[product.id]) continue;

        // ✅ Solo intenta S3 si parece un key válido
        const isS3Key = product.imageUrl.startsWith("ECOZONA/");

        if (!isS3Key) {
          urls[product.id] = null; // fallback al placeholder
          continue;
        }

        try {
          const url = await getFileUrl(product.imageUrl);
          urls[product.id] = url;
        } catch (err) {
          console.error("Error imagen:", err);
          urls[product.id] = null;
        }
      }

      if (Object.keys(urls).length > 0) {
        setImageUrls((prev) => ({ ...prev, ...urls }));
      }
    };

    loadImages();
  }, [products]);

  return (
    <Wrapper>
      <Header>
        <UserMenu />
        <Title>Inventario</Title>
        <div />
      </Header>

      <SearchBar>
        <SearchInput
          placeholder="Buscar producto..."
          value={search}
          onChange={onFilterTextBoxChanged}
        />
        <ScanButton>
          <ScanLine size={18} />
        </ScanButton>
      </SearchBar>

      <ProductsGrid>
        {products.map((product) => (
          <Card
            key={product.id}
            $selected={isSelected(product.id)}
            $error={errorProductId === product.id}
            onMouseDown={() => handleMouseDown(product.id)}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={() => handleClick(product)}
          >
            <ProductImage
              src={imageUrls[product.id] || "https://via.placeholder.com/150"}
            />
            <ProductInfo>
              <ProductName>{product.name}</ProductName>
              <ProductCode>{product.code}</ProductCode>

              <ProductFooter>
                <Price>Bs {product.finalPrice}</Price>
                {(() => {
                  const stock = product.inventories?.[0]?.quantity || 0;
                  return (
                    <Stock style={{ color: stock === 0 ? "#e81d12" : "#333" }}>
                      Cant: {stock}
                    </Stock>
                  );
                })()}
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
