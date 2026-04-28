import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useInventory from "../hooks/useInventory";
import Beep from "../assets/sounds/Beep.mp3";
import { useLoginStore } from "../components/store/loginStore";
import { useSucursales } from "../hooks/useSucursales";

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

function Inventory() {
  const navigate = useNavigate();
  const { location, role } = useLoginStore();
  const { data: locations } = useSucursales();

  const addToCart = useCartStore((state) => state.addToCart);

  const { products, search, setSearch, onFilterTextBoxChanged } =
    useInventory();

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [errorProductId, setErrorProductId] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [scanCartMode, setScanCartMode] = useState(false);
  const [scannedProducts, setScannedProducts] = useState([]);
  const [lastScanned, setLastScanned] = useState({ code: "", time: 0 });

  // SUCURSAL
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [openLocations, setOpenLocations] = useState(false);

  const allowedRoles = ["Gerente General", "Gerente Operaciones"];
  const canChangeLocation = allowedRoles.includes(role);

  useEffect(() => {
    if (!locations.length) return;

    if (canChangeLocation) {
      const defaultLoc = locations.find((l) => l.id === 1) || locations[0];
      setSelectedLocation(defaultLoc);
    } else {
      const userLoc = locations.find((l) => l.id === location?.id);
      setSelectedLocation(userLoc || locations[0]);
    }
  }, [locations, role, location]);

  // BEEP
  const beepRef = useRef(null);
  useEffect(() => {
    beepRef.current = new Audio(Beep);
  }, []);

  const playBeep = () => {
    if (!beepRef.current) return;
    beepRef.current.currentTime = 0;
    beepRef.current.play().catch(() => {});
  };

  // LONG PRESS
  const pressTimer = useRef(null);

  const handleMouseDown = (product) => {
    pressTimer.current = setTimeout(() => {
      navigate(`/product/edit`, { state: product });
    }, 700);
  };

  const handleMouseUp = () => clearTimeout(pressTimer.current);

  const handleTouchStart = (product) => {
    pressTimer.current = setTimeout(() => {
      navigate(`/product/edit`, { state: product });
    }, 700);
  };

  const handleTouchEnd = () => clearTimeout(pressTimer.current);
  const handleTouchMove = () => clearTimeout(pressTimer.current);

  // STOCK DINÁMICO
  const getStock = (product) => {
    if (product.stockBySucursal && selectedLocation) {
      const found = product.stockBySucursal.find(
        (s) => s.locationId === selectedLocation.id,
      );
      return found?.quantity || 0;
    }

    return product.inventories?.[0]?.quantity || 0;
  };

  // SELECCIÓN
  const toggleSelect = (product) => {
    setSelectedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      return [...prev, product];
    });
  };

  const handleClick = (product) => {
    const stock = getStock(product);

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

        try {
          urls[product.id] = await getFileUrl(product.imageUrl);
        } catch {
          urls[product.id] = null;
        }
      }

      setImageUrls((prev) => ({ ...prev, ...urls }));
    };

    loadImages();
  }, [products]);

  // SCANNER
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
  };

  return (
    <Wrapper>
      <Header>
        <UserMenu isOpen={menuOpen} setIsOpen={setMenuOpen} />

        <Title
          onClick={() => {
            if (!canChangeLocation) return;
            setOpenLocations(!openLocations);
          }}
          style={{
            cursor: canChangeLocation ? "pointer" : "default",
            opacity: canChangeLocation ? 1 : 0.7,
          }}
        >
          {selectedLocation?.name || "Inventario"}
        </Title>

        {(role === "Administrador sucursal" ||
          role === "Almacenero" ||
          role === "Técnico en sistemas") && (
          <AddProductButton onClick={() => navigate("/product")}>
            <Plus size={18} />
          </AddProductButton>
        )}
      </Header>

      {/* SELECTOR */}
      {openLocations && canChangeLocation && (
        <div
          style={{
            position: "absolute",
            top: 70,
            left: 20,
            right: 20,
            background: "white",
            borderRadius: 12,
            padding: 10,
            zIndex: 1000,
          }}
        >
          {locations.map((loc) => (
            <div
              key={loc.id}
              onClick={() => {
                setSelectedLocation(loc);
                setOpenLocations(false);
              }}
              style={{ padding: 10, cursor: "pointer" }}
            >
              {loc.name}
            </div>
          ))}
        </div>
      )}

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
            const stock = getStock(product);

            return (
              <Card
                key={product.id}
                data-found={product.barcode === search}
                $selected={isSelected(product.id)}
                $error={errorProductId === product.id}
                $outOfStock={stock === 0}
                onMouseDown={() => handleMouseDown(product)}
                onMouseUp={handleMouseUp}
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
      {!canChangeLocation && (
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

            {/* 🔥 BOTONES */}
            {scanCartMode ? (
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
            ) : (
              <button
                onClick={() => {
                  setScanning(false);
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
                  background: "#111",
                  color: "#fff",
                  fontWeight: "600",
                }}
              >
                Ir al carrito
              </button>
            )}
          </div>
        </ScannerOverlay>
      )}
    </Wrapper>
  );
}

export default Inventory;
