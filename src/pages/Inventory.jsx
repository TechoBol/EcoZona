import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useInventory from "../hooks/useInventory";
import Beep from "../assets/sounds/Beep.mp3";

import {
  Wrapper,
  Header,
  Title,
  SearchBar,
  SearchInput,
  ScanButton,
  ScrollArea,
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
import MultiBarCodeReader from "../components/Scanner/MultiBarCodeReader";

import { useLoginStore } from "../components/store/loginStore";

function Inventory() {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const { role } = useLoginStore();
  const { products, search, setSearch, onFilterTextBoxChanged } =
    useInventory();

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [errorProductId, setErrorProductId] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [scanCartMode, setScanCartMode] = useState(false);
  const [scannedProducts, setScannedProducts] = useState([]);
  const [lastScanned, setLastScanned] = useState({ code: "", time: 0 });

  const beepRef = useRef(null);

  useEffect(() => {
    beepRef.current = new Audio(Beep);
  }, []);

  const playBeep = () => {
    if (!beepRef.current) return;
    beepRef.current.currentTime = 0;
    beepRef.current.play().catch(() => {});
  };

  const pressTimer = useRef(null);

  // --- MOUSE (desktop) ---
  const handleMouseDown = (product) => {
    pressTimer.current = setTimeout(() => {
      navigate(`/product/edit`, { state: product });
    }, 700);
  };

  const handleMouseUp = () => clearTimeout(pressTimer.current);

  // --- TOUCH (móvil) ---
  const handleTouchStart = (product) => {
    pressTimer.current = setTimeout(() => {
      navigate(`/product/edit`, { state: product });
    }, 700);
  };

  const handleTouchEnd = () => {
    clearTimeout(pressTimer.current);
  };

  const handleTouchMove = () => {
    // Si el usuario scrollea, cancelar el long press
    clearTimeout(pressTimer.current);
  };

  // SELECCIÓN MANUAL
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

  const handleBarcodeDetected = (code) => {
    const cleanCode = code.trim();
    const now = Date.now();

    if (lastScanned.code === cleanCode && now - lastScanned.time < 1200) {
      return;
    }
    setLastScanned({ code: cleanCode, time: now });

    const found = products.find(
      (p) => p.barcode?.toLowerCase() === cleanCode.toLowerCase(),
    );

    if (!found) return;

    playBeep();

    if (scanCartMode) {
      setScannedProducts((prev) => {
        const exists = prev.find((p) => p.id === found.id);
        if (exists) {
          return prev.map((p) =>
            p.id === found.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p,
          );
        }
        return [...prev, { ...found, quantity: 1 }];
      });
      return;
    }

    setSearch(cleanCode);
    setScanning(false);

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
        {menuOpen && <Overlay onClick={() => setMenuOpen(false)} />}
        <UserMenu isOpen={menuOpen} setIsOpen={setMenuOpen} />
        <Title>Inventario</Title>
        {(role === "Administrador sucursal" ||
          role === "Almacenero" ||
          role === "Técnico en sistemas") && (
          <AddProductButton onClick={() => navigate("/product")}>
            <Plus size={18} />
          </AddProductButton>
        )}
      </Header>

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

      <ScrollArea>
        <ProductsGrid>
          {products.map((product) => {
            const stock = product.inventories?.[0]?.quantity || 0;

            return (
              <Card
                key={product.id}
                data-found={product.barcode === search}
                $selected={isSelected(product.id)}
                $error={errorProductId === product.id}
                // Mouse (desktop)
                onMouseDown={() => handleMouseDown(product)}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                // Touch (móvil) ← fix
                onTouchStart={() => handleTouchStart(product)}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
                onClick={() => handleClick(product)}
              >
                <ProductImage
                  src={
                    imageUrls[product.id] || "https://via.placeholder.com/150"
                  }
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
      </ScrollArea>
      {(role === "Administrador sucursal" ||
        role === "Almacenero" ||
        role === "Técnico en sistemas" ||
        role === "Vendedor") && (
        <BottomActions>
          <ScannerButton
            onClick={async () => {
              if (beepRef.current) {
                try {
                  await beepRef.current.play();
                  beepRef.current.pause();
                  beepRef.current.currentTime = 0;
                } catch {}
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
      )}

      {scanning && (
        <ScannerOverlay>
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {scanCartMode ? (
              <MultiBarCodeReader
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
                  background: "#F20C1F",
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
