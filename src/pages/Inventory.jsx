import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useInventory from "../hooks/useInventory";
import Beep from "../assets/sounds/Beep.mp3";
import { useLoginStore } from "../components/store/loginStore";
import { useSucursales } from "../hooks/useSucursales";
import { theme } from "../components/ui/Theme";


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
  FilterRow,
  FilterChip,
  FilterChipActive,
  ChevronSep,
  ChipX,
} from "../components/ui/Inventory";

import { ScanLine, Plus } from "lucide-react";
import UserMenu from "../components/menus/UserMenu";
import { useCartStore } from "../components/store/cartStore";
import { useAmazonS3 } from "../hooks/useAmazonS3";

import BarcodeReader from "../components/Scanner/BarcodeReader";
import MultiBarCodeReader from "../components/Scanner/MultiBarCodeReader";
import { usePermissions } from "../hooks/usePermissions";

function Inventory() {
  const navigate = useNavigate();
  const { location, role, level } = useLoginStore();
  const { data: locations } = useSucursales();

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
  const [menuOpen, setMenuOpen] = useState(false);

  const [scanCartMode, setScanCartMode] = useState(false);
  const [scannedProducts, setScannedProducts] = useState([]);
  const [lastScanned, setLastScanned] = useState({ code: "", time: 0 });

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [openLocations, setOpenLocations] = useState(false);

  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const permissions = usePermissions();

  const canChangeLocation = permissions.isAdmin;

  ///////////////////////////////////////
  // SUCURSAL
  ///////////////////////////////////////
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

  ///////////////////////////////////////
  // BEEP
  ///////////////////////////////////////
  const beepRef = useRef(null);

  useEffect(() => {
    beepRef.current = new Audio(Beep);
  }, []);

  const playBeep = () => {
    if (!beepRef.current) return;
    beepRef.current.currentTime = 0;
    beepRef.current.play().catch(() => { });
  };

  ///////////////////////////////////////
  // LONG PRESS
  ///////////////////////////////////////
  const pressTimer = useRef(null);

  const handleMouseDown = (product) => {
    if (!permissions.canEditProduct) return;
    pressTimer.current = setTimeout(() => {
      navigate("/product/edit", { state: product });
    }, 700);
  };

  const handleMouseUp = () => clearTimeout(pressTimer.current);

  const handleTouchStart = (product) => {
    if (!permissions.canEditProduct) return;
    pressTimer.current = setTimeout(() => {
      navigate("/product/edit", { state: product });
    }, 700);
  };

  const handleTouchEnd = () => clearTimeout(pressTimer.current);
  const handleTouchMove = () => clearTimeout(pressTimer.current);

  ///////////////////////////////////////
  // STOCK
  ///////////////////////////////////////
  const getStock = (product) => {
    if (product.stockBySucursal && selectedLocation) {
      const found = product.stockBySucursal.find(
        (s) => s.locationId === selectedLocation.id,
      );
      return found?.quantity || 0;
    }
    return product.inventories?.[0]?.quantity || 0;
  };

  ///////////////////////////////////////
  // CARRITO
  ///////////////////////////////////////
  const toggleSelect = (product) => {
    setSelectedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      return [...prev, product];
    });
  };

  const handleClick = (product) => {
    if (!permissions.canSell) return;
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

  ///////////////////////////////////////
  // IMÁGENES
  ///////////////////////////////////////
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

  ///////////////////////////////////////
  // FILTROS DINÁMICOS
  ///////////////////////////////////////
  const lines = [
    ...new Map(
      products
        .filter((p) => p.line)
        .map((p) => [p.line.id, p.line])
    ).values(),
  ];

  const brands = selectedLine?.brands || [];

  const visibleProducts = products.filter((product) => {
    if (selectedLine && product.lineId !== selectedLine.id) return false;
    if (selectedBrand && product.brandName !== selectedBrand) return false;
    return true;
  });

  const lastErrorRef = useRef({ code: "", time: 0 });
  
  ///////////////////////////////////////
  // SCANNER
  ///////////////////////////////////////
const handleBarcodeDetected = (code) => {
  const cleanCode = code.trim();
  const now = Date.now();

  if (lastScanned.code === cleanCode && now - lastScanned.time < 1200) return;

  setLastScanned({ code: cleanCode, time: now });

  const found = products.find(
    (p) => p.barcode?.toLowerCase() === cleanCode.toLowerCase(),
  );

  if (!found) return;

  playBeep();

  // 🛒 MODO CARRITO
  if (scanCartMode) {
    const stock = getStock(found);

    // 🚨 VALIDACIÓN SOLO AQUÍ
    if (stock === 0) {
      const now = Date.now();

      if (
        lastErrorRef.current.code !== cleanCode ||
        now - lastErrorRef.current.time > 1500
      ) {
        lastErrorRef.current = { code: cleanCode, time: now };
      }

      setErrorProductId(found.id);
      setTimeout(() => setErrorProductId(null), 400);

      return;
    }

    setScannedProducts((prev) => {
      const exists = prev.find((p) => p.id === found.id);

      if (exists) {
        if ((exists.quantity || 1) >= stock) {
          return prev;
        }
        return prev.map((p) =>
          p.id === found.id
            ? { ...p, quantity: (p.quantity || 1) + 1 }
            : p,
        );
      }

      return [...prev, { ...found, quantity: 1 }];
    });

    return;
  }

  // 🔍 MODO BÚSQUEDA (SIN VALIDAR STOCK)
  setSearch(cleanCode);
  setScanning(false);
};

  const openSearchScanner = () => {
    setScanCartMode(false);
    setScanning(true);
  };

  const openCartScanner = () => {
    setScannedProducts([]); // limpia escaneos anteriores
    setScanCartMode(true);
    setScanning(true);
  };

  const closeScanner = () => {
    setScanning(false);
    setScanCartMode(false);
  };

  ///////////////////////////////////////
  // CONFIRMAR ESCANEO → CARRITO
  ///////////////////////////////////////
  const totalScannedUnits = scannedProducts.reduce(
    (sum, p) => sum + (p.quantity || 1),
    0,
  );

  const handleConfirmScanned = () => {
    scannedProducts.forEach((product) => {
      for (let i = 0; i < (product.quantity || 1); i++) {
        addToCart(product);
      }
    });
    setScannedProducts([]);
    closeScanner();
    navigate("/cart");
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
          style={{ cursor: canChangeLocation ? "pointer" : "default" }}
        >
          {selectedLocation?.name || "Inventario"}
        </Title>

        {permissions.canCreateProduct && (
          <AddProductButton onClick={() => navigate("/product")}>
            <Plus size={18} />
          </AddProductButton>
        )}
      </Header>

      {/* SUCURSALES */}
      {openLocations && canChangeLocation && (
        <div>
          {locations.map((loc) => (
            <div
              key={loc.id}
              onClick={() => {
                setSelectedLocation(loc);
                setOpenLocations(false);
              }}
            >
              {loc.name}
            </div>
          ))}
        </div>
      )}

      {/* SEARCH */}
      <SearchBar>
        <SearchInput
          placeholder="Buscar producto..."
          value={search}
          onChange={onFilterTextBoxChanged}
        />
        <ScanButton onClick={openSearchScanner}>
          <ScanLine size={18} />
        </ScanButton>
      </SearchBar>

      {/* FILTRO BREADCRUMB */}
      <FilterRow>
        {!selectedLine ? (
          lines.map((line, i) => (
            <FilterChip
              key={line.id}
              style={{ animationDelay: `${i * 45}ms` }}
              onClick={() => {
                setSelectedLine(line);
                setSelectedBrand(null);
                setSearch("");
              }}
            >
              {line.name}
            </FilterChip>
          ))
        ) : (
          <>
            <FilterChipActive
              onClick={() => {
                setSelectedLine(null);
                setSelectedBrand(null);
              }}
            >
              {selectedLine.name}
              <ChipX>✕</ChipX>
            </FilterChipActive>

            <ChevronSep>›</ChevronSep>

            {brands.map((brand, i) => (
              <FilterChip
                key={brand}
                $active={selectedBrand === brand}
                style={{ animationDelay: `${i * 45}ms` }}
                onClick={() =>
                  setSelectedBrand(selectedBrand === brand ? null : brand)
                }
              >
                {brand}
                {selectedBrand === brand && <ChipX>✕</ChipX>}
              </FilterChip>
            ))}
          </>
        )}
      </FilterRow>

      {/* PRODUCTOS */}
      <ScrollArea>
        <ProductsGrid>
          {visibleProducts.map((product) => {
            const stock = getStock(product);
            return (
              <Card
                key={product.id}
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

      {/* FOOTER */}
      <BottomActions>
        {permissions.canSell && (
          <>
            <ScannerButton onClick={openCartScanner}>
              <ScanLine size={22} />
            </ScannerButton>
            <AddToCartButton onClick={handleGoToCart}>
              Ir al carrito ({selectedProducts.length})
            </AddToCartButton>
          </>
        )}
      </BottomActions>

      {/* MODAL SCANNER */}
      {scanning && (
        <ScannerOverlay>
          {scanCartMode ? (
            <>
              <MultiBarCodeReader
                onDetected={handleBarcodeDetected}
                onClose={closeScanner}
              />
              {/* BOTÓN CONFIRMAR */}
              {scannedProducts.length > 0 && (
                <div
                  onClick={handleConfirmScanned}
                  style={{
                    position: "absolute",
                    bottom: "2rem",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: theme.colors.primary,
                    color: "white",
                    padding: "0.85rem 2rem",
                    borderRadius: "999px",
                    fontWeight: "600",
                    fontSize: "1rem",
                    cursor: "pointer",
                    zIndex: 999,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Añadir {totalScannedUnits} producto{totalScannedUnits !== 1 ? "s" : ""} al carrito
                </div>
              )}
            </>
          ) : (
            <BarcodeReader
              onDetected={handleBarcodeDetected}
              onClose={closeScanner}
            />
          )}
        </ScannerOverlay>
      )}
    </Wrapper>
  );
}

export default Inventory;