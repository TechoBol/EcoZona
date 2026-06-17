import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Wrapper,
  Header,
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
  FilterRow,
  FilterChip,
  FilterChipActive,
  ChevronSep,
  ChipX,
  TitleText,
  BottomActions,
  AddToCartButton,
} from "../components/ui/Inventory";

import { ScanLine } from "lucide-react";

import { usePublicInventoryStore } from "../components/store/publicInventoryStore";

import { useAmazonS3 } from "../hooks/useAmazonS3";

import BarcodeReader from "../components/Scanner/BarcodeReader";

import { getPublicProducts } from "../services/InventoryService";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../components/store/cartStore";

function PublicInventory() {
  const { token } = useParams();
  const navigate = useNavigate();
  const setPublicToken = usePublicInventoryStore(
    (state) => state.setPublicToken,
  );

  const publicToken = usePublicInventoryStore((state) => state.publicToken);

  ///////////////////////////////////////
  // TOKEN
  ///////////////////////////////////////
  useEffect(() => {
    if (token) {
      setPublicToken(token);
    }
  }, [token]);

  ///////////////////////////////////////
  // STATE
  ///////////////////////////////////////
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const [scanning, setScanning] = useState(false);

  ///////////////////////////////////////
  // FETCH
  ///////////////////////////////////////
  useEffect(() => {
    if (!publicToken) return;

    const loadProducts = async () => {
      const data = await getPublicProducts(publicToken);
      setProducts(data || []);
    };

    loadProducts();
  }, [publicToken]);

  ///////////////////////////////////////
  // IMAGES
  ///////////////////////////////////////
  const [imageUrls, setImageUrls] = useState({});

  const { getFileUrl } = useAmazonS3();

  useEffect(() => {
    if (!products.length) return;

    const loadImages = async () => {
      const results = await Promise.all(
        products.map(async (product) => {
          try {
            if (!product.imageUrl) {
              return [product.id, null];
            }

            const url = await getFileUrl(product.imageUrl);

            return [product.id, url];
          } catch {
            return [product.id, null];
          }
        }),
      );

      setImageUrls(Object.fromEntries(results));
    };

    loadImages();
  }, [products]);

  ///////////////////////////////////////
  // SEARCH
  ///////////////////////////////////////
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        (product.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (product.barcode || "").toLowerCase().includes(search.toLowerCase());

      const matchesLine = selectedLine
        ? product.line?.id === selectedLine.id
        : true;

      const matchesBrand = selectedBrand
        ? product.brandName === selectedBrand
        : true;

      return matchesSearch && matchesLine && matchesBrand;
    });
  }, [products, search, selectedLine, selectedBrand]);

  const brands = [
    ...new Set(
      products
        .filter(
          (p) => selectedLine && p.line?.id === selectedLine.id && p.brandName,
        )
        .map((p) => p.brandName),
    ),
  ];

  ///////////////////////////////////////
  // LINES
  ///////////////////////////////////////
  const lines = [
    ...new Map(
      products.filter((p) => p.line).map((p) => [p.line.id, p.line]),
    ).values(),
  ];

  ///////////////////////////////////////
  // SCANNER
  ///////////////////////////////////////
  const handleBarcodeDetected = (code) => {
    setSearch(code.trim());
    setScanning(false);
  };
  // STATE
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [errorProductId, setErrorProductId] = useState(null);

  const isSelected = (id) => selectedProducts.some((p) => p.id === id);

  const toggleSelect = (product) => {
    setSelectedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      return [...prev, product];
    });
  };
  const handleClick = (product) => {
    const stock = product.stock;
    if (stock === 0) {
      setErrorProductId(product.id);
      setTimeout(() => setErrorProductId(null), 400);
      return;
    }
    toggleSelect(product);
  };
  const addToCart = useCartStore((state) => state.addToCart);
  const handleGoToCart = () => {
    selectedProducts.forEach((product) => addToCart(product));
    console.log(selectedProducts);
    navigate("/cart/" + token);
  };
  ///////////////////////////////////////
  // RENDER
  ///////////////////////////////////////
  return (
    <Wrapper>
      <Header>
        <TitleText>Ecozona</TitleText>
      </Header>

      {/* SEARCH */}
      <SearchBar>
        <SearchInput
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <ScanButton onClick={() => setScanning(true)}>
          <ScanLine size={18} />
        </ScanButton>
      </SearchBar>

      {/* FILTROS */}
      <FilterRow>
        {!selectedLine ? (
          lines.map((line, i) => (
            <FilterChip
              key={line.id}
              style={{ animationDelay: `${i * 45}ms` }}
              onClick={() => {
                setSelectedLine(line);
                setSelectedBrand(null);
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

      {/* PRODUCTS */}
      {/* PRODUCTS */}
      <ScrollArea>
        <ProductsGrid>
          {filteredProducts.map((product) => {
            const stock = product.stock;

            return (
              <Card
                key={product.id}
                $selected={isSelected(product.id)}
                $error={errorProductId === product.id}
                $outOfStock={stock === 0}
                onClick={() => handleClick(product)}
              >
                <ProductImage
                  key={imageUrls[product.id]}
                  src={
                    imageUrls[product.id] || "https://via.placeholder.com/150"
                  }
                  loading="lazy"
                  decoding="async"
                />

                <ProductInfo>
                  <ProductName>{product.name}</ProductName>

                  <ProductCode>{product.barcode}</ProductCode>

                  <ProductFooter>
                    <Price>Bs {product.finalPrice}</Price>
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
      {/* SCANNER */}
      {scanning && (
        <BarcodeReader
          onDetected={handleBarcodeDetected}
          onClose={() => setScanning(false)}
        />
      )}
    </Wrapper>
  );
}

export default PublicInventory;
