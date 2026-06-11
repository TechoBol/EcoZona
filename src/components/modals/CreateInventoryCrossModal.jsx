import { useState } from "react";
import { X } from "lucide-react";

import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  CloseButton,
} from "../ui/Location";

import {
  Content,
  FormContainer,
  Field,
  Label,
  ProductInput,
  SearchWrapper,
  Dropdown,
  DropdownItem,
  DropdownName,
  DropdownBarcode,
  DropdownHint,
  StockCard,
  StockText,
  NumberInput,
  PreviewCard,
  AddToCartButton,
  SelectInput,
} from "../ui/Cruce";

import { useProductSearch } from "../../hooks/useProductSearch";
import { useLoginStore } from "../store/loginStore";
import { useSucursales } from "../../hooks/useSucursales";
import Swal from "sweetalert2";

export default function CreateInventoryCrossModal({
  open,
  onClose,
  onSubmit,
  loading,
}) {
  const { location, level } = useLoginStore();

  const { data: locations = [] } = useSucursales();

  const [selectedLocationId, setSelectedLocationId] = useState(
    location?.id || "",
  );

  const [product1, setProduct1] = useState(null);
  const [product2, setProduct2] = useState(null);

  const [query1, setQuery1] = useState("");
  const [query2, setQuery2] = useState("");

  const [activeSearch, setActiveSearch] = useState(null);

  const [quantity, setQuantity] = useState("");

  const { searchProducts, results, searching, clearResults } =
    useProductSearch();

  if (!open) return null;

  /////////////////////////////////////////////////////
  // SUCURSAL
  /////////////////////////////////////////////////////

  const locationIdToUse =
    level === 1 ? Number(selectedLocationId) : location?.id;

  /////////////////////////////////////////////////////
  // STOCKS
  /////////////////////////////////////////////////////

  const getStockByLocation = (product) => {
    if (!product || !locationIdToUse) return 0;

    const inventory = product.inventories?.find(
      (inv) => inv.locationId === locationIdToUse,
    );

    return inventory?.quantity || 0;
  };

  const stock1 = getStockByLocation(product1);
  const stock2 = getStockByLocation(product2);

  /////////////////////////////////////////////////////
  // PREVIEW
  /////////////////////////////////////////////////////

  const qty = Number(quantity || 0);

  const finalStock1 = Math.max(0, stock1 - qty);

  const finalStock2 = stock2 + qty;

  /////////////////////////////////////////////////////
  // BUSQUEDA ORIGEN
  /////////////////////////////////////////////////////

  const handleSearch1 = (value) => {
    setQuery1(value);
    setActiveSearch(1);

    if (!value.trim()) {
      clearResults();
      return;
    }

    searchProducts(value);
  };

  /////////////////////////////////////////////////////
  // BUSQUEDA DESTINO
  /////////////////////////////////////////////////////

  const handleSearch2 = (value) => {
    setQuery2(value);
    setActiveSearch(2);

    if (!value.trim()) {
      clearResults();
      return;
    }

    searchProducts(value);
  };

  /////////////////////////////////////////////////////
  // SELECCIONAR PRODUCTOS
  /////////////////////////////////////////////////////

  const selectProduct1 = (product) => {
    setProduct1(product);
    setQuery1(product.name);

    clearResults();
    setActiveSearch(null);
  };

  const selectProduct2 = (product) => {
    setProduct2(product);
    setQuery2(product.name);

    clearResults();
    setActiveSearch(null);
  };

  /////////////////////////////////////////////////////
  // CANTIDAD
  /////////////////////////////////////////////////////

  const handleQuantityChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setQuantity("");
      return;
    }

    let qty = Number(value);

    if (qty > stock1) qty = stock1;

    if (qty < 0) qty = 0;

    setQuantity(qty);
  };

  /////////////////////////////////////////////////////
  // SUBMIT
  /////////////////////////////////////////////////////
  const resetForm = () => {
    setProduct1(null);
    setProduct2(null);
    setQuery1("");
    setQuery2("");
    setQuantity("");
    setActiveSearch(null);
    clearResults();
  };
  const handleSubmit = async () => {
    if (!product1) return;
    if (!product2) return;
    if (!qty) return;
    const glosaResult = await Swal.fire({
      title: "Ingrese una observación",
      input: "text",
      inputLabel: "Observación",
      inputPlaceholder: "Ej: Observación",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#28a745",
      inputValidator: (value) => {
        if (!value) {
          return "Debes ingresar una observación";
        }
      },
    });

    // canceló modal → NO envía
    if (!glosaResult.isConfirmed) return;
    onSubmit({
      originProductCode: product1.id,

      destinationProductCode: product2.id,

      quantity: qty,

      locationId: locationIdToUse,
      observacion: glosaResult.value,
      originStockBefore: stock1,
      destinationStockBefore: stock2,
    });
    onClose();
    resetForm();
  };

  return (
    <ModalOverlay>
      <ModalContent
        style={{
          width: "700px",
          maxWidth: "95vw",
          maxHeight: "90vh",
          borderRadius: "12px",
          background: "#fff",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton onClick={onClose}>
          <X size={18} />
        </CloseButton>

        <ModalTitle>Nuevo Ajuste de Inventario</ModalTitle>

        <Content>
          <FormContainer>
            <Field>
              <Label>Sucursal</Label>

              {level === 1 ? (
                <SelectInput
                  value={selectedLocationId}
                  onChange={(e) =>
                    setSelectedLocationId(Number(e.target.value))
                  }
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </SelectInput>
              ) : (
                <SelectInput value={location?.id || ""} disabled>
                  <option value={location?.id}>{location?.name}</option>
                </SelectInput>
              )}
            </Field>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                alignItems: "start",
              }}
            >
              <Field>
                <Label>Producto origen</Label>

                <SearchWrapper>
                  <ProductInput
                    placeholder="Buscar producto..."
                    value={query1}
                    onFocus={() => setActiveSearch(1)}
                    onChange={(e) => handleSearch1(e.target.value)}
                  />

                  {activeSearch === 1 && (results.length > 0 || searching) && (
                    <Dropdown>
                      {searching ? (
                        <DropdownHint>Buscando...</DropdownHint>
                      ) : (
                        results.map((product) => (
                          <DropdownItem
                            key={product.id}
                            onClick={() => selectProduct1(product)}
                          >
                            <DropdownName>{product.name}</DropdownName>

                            <DropdownBarcode>{product.barcode}</DropdownBarcode>
                          </DropdownItem>
                        ))
                      )}
                    </Dropdown>
                  )}
                </SearchWrapper>
              </Field>

              <Field>
                <Label>Producto destino</Label>

                <SearchWrapper>
                  <ProductInput
                    placeholder="Buscar producto..."
                    value={query2}
                    onFocus={() => setActiveSearch(2)}
                    onChange={(e) => handleSearch2(e.target.value)}
                  />

                  {activeSearch === 2 && (results.length > 0 || searching) && (
                    <Dropdown>
                      {searching ? (
                        <DropdownHint>Buscando...</DropdownHint>
                      ) : (
                        results.map((product) => (
                          <DropdownItem
                            key={product.id}
                            onClick={() => selectProduct2(product)}
                          >
                            <DropdownName>{product.name}</DropdownName>

                            <DropdownBarcode>{product.barcode}</DropdownBarcode>
                          </DropdownItem>
                        ))
                      )}
                    </Dropdown>
                  )}
                </SearchWrapper>
              </Field>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <StockCard>
                <StockText>Stock actual: {stock1}</StockText>
              </StockCard>

              <StockCard>
                <StockText>Stock actual: {stock2}</StockText>
              </StockCard>
            </div>

            <Field>
              <Label
                style={{
                  textAlign: "center",
                }}
              >
                Cantidad a cruzar
              </Label>

              <NumberInput
                type="number"
                min={0}
                max={stock1}
                value={quantity}
                onChange={handleQuantityChange}
                style={{
                  maxWidth: 180,
                  margin: "0 auto",
                  textAlign: "center",
                }}
              />
            </Field>

            {product1 && product2 && qty > 0 && (
              <PreviewCard>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  <div>
                    <strong>{product1.name}</strong>
                    <div>
                      <strong>{product1.barcode}</strong>
                    </div>

                    <div>Stock actual: {stock1}</div>

                    <div>Stock final: {finalStock1}</div>
                  </div>

                  <div>
                    <strong>{product2.name}</strong>
                    <div>
                      <strong>{product1.barcode}</strong>
                    </div>

                    <div>Stock actual: {stock2}</div>

                    <div>Stock final: {finalStock2}</div>
                  </div>
                </div>
              </PreviewCard>
            )}

            <AddToCartButton
              onClick={handleSubmit}
              disabled={!product1 || !product2 || qty <= 0 || loading}
            >
              {loading ? "Procesando..." : "Realizar Ajuste"}
            </AddToCartButton>
          </FormContainer>
        </Content>
      </ModalContent>
    </ModalOverlay>
  );
}
