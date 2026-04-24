import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  ScannerButton,
  AddToCartButton,
  ScannerOverlay,
} from "../components/ui/Inventory";

import { ScanLine, Plus } from "lucide-react";
import UserMenu from "../components/menus/UserMenu";
import { useCartStore } from "../components/store/cartStore";
import { useAmazonS3 } from "../hooks/useAmazonS3";
import BarcodeReader from "../components/Scanner/BarcodeReader";

function Inventory() {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);

  const {
    products,
    search,
    setSearch,
    onFilterTextBoxChanged,
  } = useInventory();

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [errorProductId, setErrorProductId] = useState(null);
  const [scanning, setScanning] = useState(false);

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
      if (exists) return prev.filter((p) => p.id !== product.id);
      return [...prev, product];
    });
  };

  const handleClick = (product) => {
    const stock = product.inventories?.[0]?.quantity || 0;

    if (stock === 0) {
      setErrorProductId(product.id);
      setTimeout(() => setErrorProductId(null), 400);
      return;
    }

    toggleSelect(product);
  };

  const isSelected = (id) => selectedProducts.some((p) => p.id === id);

  const handleGoToCart = () => {
    selectedProducts.forEach((product) => addToCart(product));
    navigate("/cart");
  };

  /* 🔥 ESCÁNER CORREGIDO */
  const handleBarcodeDetected = (code) => {
    const cleanCode = code.trim(); // 🔥 clave

    setSearch(cleanCode);
    setScanning(false);

    // 🔥 Scroll automático al resultado (opcional pero pro)
    setTimeout(() => {
      const element = document.querySelector("[data-found='true']");
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
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

        const isS3Key = product.imageUrl.startsWith("ECOZONA/");

        if (!isS3Key) {
          urls[product.id] = null;
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
      {/* HEADER */}
      <Header>
        <UserMenu />
        <Title>Inventario</Title>
        <AddProductButton onClick={() => navigate("/product")}>
          <Plus size={18} />
        </AddProductButton>
      </Header>

      {/* SEARCH */}
      <SearchBar>
        <SearchInput
          placeholder="Buscar producto..."
          value={search}
          onChange={onFilterTextBoxChanged}
        />
        <ScanButton onClick={() => setScanning(true)} style={{ cursor: "pointer" }}>
          <ScanLine size={18} />
        </ScanButton>
      </SearchBar>

      {/* LISTA */}
      <div
        style={{
          height: "calc(100vh - 180px)",
          overflowY: "auto",
          padding: "0 10px 100px 10px",
        }}
      >
        <ProductsGrid>
          {products.map((product) => {
            const stock = product.inventories?.[0]?.quantity || 0;

            return (
              <Card
                key={product.id}
                data-found={product.barcode === search} // 🔥 para scroll
                $selected={isSelected(product.id)}
                $error={errorProductId === product.id}
                onMouseDown={() => handleMouseDown(product.id)}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={() => handleClick(product)}
              >
                <ProductImage
                  src={imageUrls[product.id] || "https://via.placeholder.com/150"}
                  alt={product.name}
                />

                <ProductInfo>
                  <ProductName>{product.name}</ProductName>

                  {/* 🔥 CORREGIDO */}
                  <ProductCode>{product.barcode}</ProductCode>

                  <ProductFooter>
                    <Price>Bs {product.finalPrice}</Price>
                    <Stock style={{ color: stock === 0 ? "#e81d12" : "#333" }}>
                      Cant: {stock}
                    </Stock>
                  </ProductFooter>
                </ProductInfo>
              </Card>
            );
          })}
        </ProductsGrid>
      </div>

      {/* BOTTOM */}
      <BottomActions>
        <ScannerButton onClick={() => setScanning(true)}>
          <ScanLine size={22} />
        </ScannerButton>

        <AddToCartButton onClick={handleGoToCart}>
          Ir al carrito ({selectedProducts.length})
        </AddToCartButton>
      </BottomActions>

      {/* SCANNER */}
      {scanning && (
        <ScannerOverlay>
          <BarcodeReader
            onDetected={handleBarcodeDetected}
            onClose={() => setScanning(false)}
          />
        </ScannerOverlay>
      )}
    </Wrapper>
  );
}

export default Inventory;