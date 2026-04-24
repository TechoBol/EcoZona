import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useInventory from "../hooks/useInventory";
import Beep from "../assets/sounds/Beep.mp3"

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

//DOS ESCÁNERES
import BarcodeReader from "../components/Scanner/BarcodeReader";
import MultiBarcodeReader from "../components/Scanner/MultiBarcodeReader";

function Inventory() {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);

  const { products, search, setSearch, onFilterTextBoxChanged } = useInventory();

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [errorProductId, setErrorProductId] = useState(null);
  const [scanning, setScanning] = useState(false);

  // 🛒 MODO CARRITO
  const [scanCartMode, setScanCartMode] = useState(false);
  const [scannedProducts, setScannedProducts] = useState([]);
  const [lastScanned, setLastScanned] = useState({
    code: "",
    time: 0,
  });

  // AUDIO
  const beepRef = useRef(null);

  useEffect(() => {
    beepRef.current = new Audio(Beep);
  }, []);

  const playBeep = () => {
    if (!beepRef.current) return;
    beepRef.current.currentTime = 0;
    beepRef.current.play().catch(() => { });
  };

  // ⏱ LONG PRESS
  const pressTimer = useRef(null);

  const handleMouseDown = (productId) => {
    pressTimer.current = setTimeout(() => {
      navigate(`/product/${productId}`);
    }, 700);
  };

  const handleMouseUp = () => clearTimeout(pressTimer.current);

  // ✅ selección manual
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

  // ESCÁNER
  const handleBarcodeDetected = (code) => {
    const cleanCode = code.trim();
    const now = Date.now();

    if (
      lastScanned.code === cleanCode &&
      now - lastScanned.time < 1200 // ⏱ 1.2s bloqueo
    ) {
      return;
    }
    setLastScanned({ code: cleanCode, time: now });

    const found = products.find(
      (p) => p.barcode?.toLowerCase() === cleanCode.toLowerCase()
    );

    if (!found) return;

    playBeep();

    // MODO CARRITO
    if (scanCartMode) {
      setScannedProducts((prev) => {
        const exists = prev.find((p) => p.id === found.id);

        if (exists) {
          return prev.map((p) =>
            p.id === found.id
              ? { ...p, quantity: (p.quantity || 1) + 1 }
              : p
          );
        }

        return [...prev, { ...found, quantity: 1 }];
      });

      return;
    }

    // MODO BÚSQUEDA
    setSearch(cleanCode);
    setScanning(false);

    setTimeout(() => {
      const element = document.querySelector("[data-found='true']");
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  // IMÁGENES
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
        } catch {
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
        <AddProductButton onClick={() => navigate("/product")}>
          <Plus size={18} />
        </AddProductButton>
      </Header>

      {/* BUSCADOR */}
      <SearchBar>
        <SearchInput
          placeholder="Buscar producto..."
          value={search}
          onChange={onFilterTextBoxChanged}
        />
        <ScanButton onClick={() => setScanning(true)}>
          <ScanLine size={18} />
        </ScanButton>
      </SearchBar>

      {/* LISTA */}
      <div style={{ height: "calc(100vh - 180px)", overflowY: "auto" }}>
        <ProductsGrid>
          {products.map((product) => {
            const stock = product.inventories?.[0]?.quantity || 0;

            return (
              <Card
                key={product.id}
                data-found={product.barcode === search}
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
                  <ProductCode>{product.barcode}</ProductCode>

                  <ProductFooter>
                    <Price>Bs {product.finalPrice}</Price>
                    <Stock>Cant: {stock}</Stock>
                  </ProductFooter>
                </ProductInfo>
              </Card>
            );
          })}
        </ProductsGrid>
      </div>

      {/* BOTONES */}
      <BottomActions>
        <ScannerButton
          onClick={async () => {
            if (beepRef.current) {
              try {
                await beepRef.current.play(); //desbloquea audio
                beepRef.current.pause();
                beepRef.current.currentTime = 0;
              } catch { }
            }

            setScanCartMode(true);
            setScannedProducts([]);
            setScanning(true);
          }}
        >
          <ScanLine size={22} />
        </ScannerButton>

        <AddToCartButton onClick={handleGoToCart}>
          Ir al carrito ({selectedProducts.length})
        </AddToCartButton>
      </BottomActions>

      {/* SCANNER */}
      {scanning && (
        <ScannerOverlay>
          <div style={{ position: "relative", width: "100%", height: "100%" }}>

            {scanCartMode ? (
              <MultiBarcodeReader
                onDetected={handleBarcodeDetected}
                onClose={() => {
                  setScanning(false);
                  setScanCartMode(false);
                  setScannedProducts([]);
                }}
              />
            ) : (
              <BarcodeReader
                onDetected={handleBarcodeDetected}
                onClose={() => setScanning(false)}
              />
            )}

            {scanCartMode && (
              <button
                onClick={() => {
                  scannedProducts.forEach((p) => {
                    for (let i = 0; i < (p.quantity || 1); i++) {
                      addToCart(p);
                    }
                  });

                  setScanning(false);
                  setScanCartMode(false);
                  navigate("/cart");
                }}
                style={{
                  position: "absolute",
                  bottom: 30,
                  left: 20,
                  right: 20,
                  height: 50,
                  borderRadius: 30,
                  border: "none",
                  background: "#404594",
                  color: "#fff",
                  fontWeight: "600",
                }}
              >
                Añadir {scannedProducts.length} productos
              </button>
            )}
          </div>
        </ScannerOverlay>
      )}
    </Wrapper>
  );
}

export default Inventory;