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

  // 🔥 NUEVO: selector de sucursal
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [openLocations, setOpenLocations] = useState(false);

  // 🔥 DEFAULT sucursal 1
  useEffect(() => {
    if (!locations.length) return;

    const defaultLoc = locations.find((l) => l.id === 1) || locations[0];

    setSelectedLocation(defaultLoc);
  }, [locations]);

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

  // 🔥 STOCK DINÁMICO
  const getStock = (product) => {
    if (product.stockBySucursal && selectedLocation) {
      const found = product.stockBySucursal.find(
        (s) => s.locationId === selectedLocation.id,
      );
      return found?.quantity || 0;
    }

    return product.inventories?.[0]?.quantity || 0;
  };

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

  // 🔥 IMÁGENES
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

  const allowedRoles = [
    "Gerente General",
    "Gerente Operativo",
  ];

  const canChangeLocation = allowedRoles.includes(role);

  return (
    <Wrapper>
      <Header>
        <UserMenu isOpen={menuOpen} setIsOpen={setMenuOpen} />

        {/* 🔥 CLICK PARA CAMBIAR SUCURSAL */}
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

      {/* 🔥 SELECTOR DE SUCURSAL */}
      {openLocations && (
        <div
          style={{
            position: "absolute",
            top: 70,
            left: 20,
            right: 20,
            background: "white",
            borderRadius: 12,
            padding: 10,
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          {locations.map((loc) => (
            <div
              key={loc.id}
              style={{
                padding: 10,
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
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

      <BottomActions>
        <AddToCartButton onClick={handleGoToCart}>
          Ir al carrito ({selectedProducts.length})
        </AddToCartButton>
      </BottomActions>
    </Wrapper>
  );
}

export default Inventory;
