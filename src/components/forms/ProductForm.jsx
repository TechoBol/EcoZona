import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProduct } from "../../hooks/useProduct";
import { useForm } from "@mantine/form";
import Beep from "../../assets/sounds/Beep.mp3";

import {
  Wrapper,
  Header,
  Title,
  Form,
  Input,
  Button,
  ContainerInput,
  ErrorText,
  UploadBox,
  HiddenInput,
  PreviewImage,
  PreviewContainer,
  RemoveButton,
  ScannerOverlay,
  BackButton,
  BarcodeWrapper,
  ScanButton,
  Select,
  Section,
  SectionTitle,
  Grid2,
  Grid3,
  ImageActions,
  LeftColumn,
  RightColumn,
  ButtonRow,
} from "../../components/ui/Product";

import { ArrowLeft, ScanLine, X } from "lucide-react";
import { errorToast, successToast } from "../../services/toasts";
import BarcodeReader from "../Scanner/BarcodeReader";
import { useAmazonS3 } from "../../hooks/useAmazonS3";
import socket from "../../services/SocketIOConnection";
import { useLines } from "../../hooks/useLine";
import useInventory from "../../hooks/useInventory";

function ProductForm() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { refresh } = useInventory();

  const product = state?.product ?? null;
  const locationId = state?.locationId ?? null;
  const isEdit = !!product;

  const { createProduct, updateProduct, loading, setLoading, subirArchivo } =
    useProduct();

  const { getFileUrl } = useAmazonS3();

  const [scanning, setScanning] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [inventoryEditEnabled, setInventoryEditEnabled] = useState(false);

  const beepRef = useRef(null);

  useEffect(() => {
    beepRef.current = new Audio(Beep);
  }, []);

  const [s3Image, setS3Image] = useState(null);
  const [imageDeleted, setImageDeleted] = useState(false);

  useEffect(() => {
    if (!product?.imageUrl) return;

    const loadImage = async () => {
      try {
        const url = await getFileUrl(product.imageUrl);
        setS3Image(url);
      } catch {
        setS3Image(null);
      }
    };

    loadImage();
  }, [product]);

  const getStockByLocation = (product, locationId) => {
    if (!product || !locationId) return "";
    const found = product.inventories?.find(
      (inv) => inv.locationId === locationId,
    );
    return found?.quantity ?? 0;
  };

  const originalStock = getStockByLocation(product, locationId);

  const form = useForm({
    initialValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      barcode: product?.barcode ?? "",
      imageFile: null,
      price: product?.price ?? "",
      finalPrice: product?.finalPrice ?? "",
      stock: originalStock,
      lineId: product?.lineId ?? "",
      brandName: product?.brandName ?? "",
    },

    validateInputOnChange: true,

    validate: {
      name: (v) => (!v.trim() ? "Ingresa el nombre" : null),
      barcode: (v) => (!v.trim() ? "Ingresa el código" : null),
      price: (v) => (!v || Number(v) <= 0 ? "Ingresa un precio válido" : null),
      finalPrice: (v, values) =>
        !v || Number(v) <= 0
          ? "Ingresa un precio válido"
          : Number(v) < Number(values.price)
          ? "El precio final no puede ser menor que el precio base."
          : null,
      stock: (v) =>
        v === "" || Number(v) < 0 ? "Ingresa una cantidad válida" : null,
    },
  });

  const previewUrl = useMemo(() => {
    if (form.values.imageFile) {
      return URL.createObjectURL(form.values.imageFile);
    }
    if (!imageDeleted && s3Image) {
      return s3Image;
    }
    return null;
  }, [form.values.imageFile, s3Image, imageDeleted]);

  // En edición: botón activo si cualquier campo libre cambió,
  // o si el switch está on y price/stock cambiaron
  const hasChanges = useMemo(() => {
    if (!isEdit) return form.isValid();

    const generalChanged =
      form.values.name !== (product?.name ?? "") ||
      form.values.description !== (product?.description ?? "") ||
      form.values.barcode !== (product?.barcode ?? "") ||
      form.values.lineId !== (product?.lineId ?? "") ||
      form.values.brandName !== (product?.brandName ?? "") ||
      Number(form.values.finalPrice) !== Number(product?.finalPrice) ||
      !!form.values.imageFile;

    const inventoryChanged =
      inventoryEditEnabled &&
      (Number(form.values.price) !== Number(product?.price) ||
        Number(form.values.stock) !== Number(originalStock));

    return generalChanged || inventoryChanged;
  }, [
    isEdit,
    inventoryEditEnabled,
    form.values.name,
    form.values.description,
    form.values.barcode,
    form.values.lineId,
    form.values.brandName,
    form.values.finalPrice,
    form.values.price,
    form.values.stock,
    form.values.imageFile,
    product,
    originalStock,
  ]);

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      setLoading(true);

      let imageKey = product?.imageUrl || null;

      if (values.imageFile) {
        imageKey = await subirArchivo(values.imageFile, values.barcode);
      }

      if (imageDeleted && !values.imageFile) {
        imageKey = null;
      }

      const payload = {
        name: values.name.toUpperCase(),
        description: values.description,
        barcode: values.barcode,
        price: Number(values.price),
        finalPrice: Number(values.finalPrice),
        stock: Number(values.stock),
        locationId,
        imageUrl: imageKey,
        lineId: Number(values.lineId),
        brandName: values.brandName,
        inventoryEdited: isEdit ? inventoryEditEnabled : false,
      };

      let result;

      if (isEdit) {
        result = await updateProduct(product.id, payload);
        successToast("Producto actualizado");
      } else {
        result = await createProduct(payload);
        successToast("Producto creado");
      }

      form.reset();
      socket.emit("createProduct", result);
      refresh();
      navigate("/inventory", { replace: true });
    } catch (err) {
      errorToast(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  });

  const { lines } = useLines();
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const selectedLine = lines?.find(
      (l) => l.id === Number(form.values.lineId),
    );

    if (selectedLine) {
      setBrands(selectedLine.brands || []);
      if (!selectedLine.brands?.includes(form.values.brandName)) {
        form.setFieldValue("brandName", "");
      }
    } else {
      setBrands([]);
    }
  }, [form.values.lineId, lines]);

  return (
    <Wrapper>
      <Header>
        <BackButton onClick={() => navigate("/inventory", { replace: true })}>
          <ArrowLeft size={20} />
        </BackButton>
        <Title>{isEdit ? "Editar Producto" : "Crear Producto"}</Title>
      </Header>

      <Form onSubmit={handleSubmit}>
        {/* ================= COLUMNA IZQUIERDA ================= */}
        <LeftColumn>
          {/* INFORMACIÓN GENERAL — siempre editable */}
          <Section>
            <SectionTitle>Información general</SectionTitle>

            <Grid2>
              <ContainerInput>
                <Input
                  placeholder="Nombre del producto"
                  {...form.getInputProps("name")}
                />
                {form.errors.name && <ErrorText>{form.errors.name}</ErrorText>}
              </ContainerInput>

              <ContainerInput>
                <Input
                  placeholder="Descripción"
                  {...form.getInputProps("description")}
                />
              </ContainerInput>
            </Grid2>

            <Grid2>
              <ContainerInput>
                <BarcodeWrapper>
                  <Input
                    placeholder="Código de barras"
                    {...form.getInputProps("barcode")}
                  />
                  <ScanButton type="button" onClick={() => setScanning(true)}>
                    <ScanLine size={18} />
                  </ScanButton>
                </BarcodeWrapper>
                {form.errors.barcode && (
                  <ErrorText>{form.errors.barcode}</ErrorText>
                )}
              </ContainerInput>
            </Grid2>
          </Section>

          {/* COSTOS E INVENTARIO */}
          <Section>
            <SectionTitle
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              Costos e inventario
              {isEdit && (
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 12,
                    fontWeight: 400,
                    cursor: "pointer",
                    color: "var(--color-text-secondary)",
                    userSelect: "none",
                  }}
                >
                  <span
                    onClick={() => {
                      const enabled = !inventoryEditEnabled;
                      setInventoryEditEnabled(enabled);
                      if (!enabled) {
                        form.setFieldValue("price", product?.price ?? "");
                        form.setFieldValue("stock", originalStock);
                      } else {
                        form.setFieldValue("stock", 0);
                      }
                    }}
                    style={{
                      position: "relative",
                      display: "inline-block",
                      width: 36,
                      height: 20,
                      borderRadius: 20,
                      background: inventoryEditEnabled ? "#e53e3e" : "#ccc",
                      transition: "background 0.2s",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: 3,
                        left: inventoryEditEnabled ? 19 : 3,
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: "white",
                        transition: "left 0.2s",
                      }}
                    />
                  </span>
                </label>
              )}
            </SectionTitle>

            <Grid3>
              {/* Precio compra — restringido por switch */}
              <ContainerInput
                style={
                  isEdit && !inventoryEditEnabled
                    ? { opacity: 0.45, pointerEvents: "none" }
                    : {}
                }
              >
                <Input
                  type="number"
                  placeholder="Precio compra"
                  {...form.getInputProps("price")}
                  disabled={isEdit && !inventoryEditEnabled}
                />
                {form.errors.price && (
                  <ErrorText>{form.errors.price}</ErrorText>
                )}
              </ContainerInput>

              {/* Precio venta — siempre editable */}
              <ContainerInput>
                <Input
                  type="number"
                  placeholder="Precio venta"
                  {...form.getInputProps("finalPrice")}
                />
                {form.errors.finalPrice && (
                  <ErrorText>{form.errors.finalPrice}</ErrorText>
                )}
              </ContainerInput>

              {/* Stock — restringido por switch */}
              <ContainerInput
                style={
                  isEdit && !inventoryEditEnabled
                    ? { opacity: 0.45, pointerEvents: "none" }
                    : {}
                }
              >
                <Input
                  type="number"
                  placeholder={
                    isEdit && inventoryEditEnabled ? "Nuevo stock" : "Stock"
                  }
                  {...form.getInputProps("stock")}
                  disabled={isEdit && !inventoryEditEnabled}
                />
                {isEdit && inventoryEditEnabled && (
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--color-text-secondary)",
                      marginTop: 4,
                      display: "block",
                      paddingLeft: 2,
                    }}
                  >
                    Stock actual:{" "}
                    <strong style={{ color: "var(--color-text-primary)" }}>
                      {originalStock} unidades
                    </strong>
                  </span>
                )}
                {form.errors.stock && (
                  <ErrorText>{form.errors.stock}</ErrorText>
                )}
              </ContainerInput>
            </Grid3>
          </Section>
        </LeftColumn>

        {/* ================= COLUMNA DERECHA ================= */}
        <RightColumn>
          {/* CLASIFICACIÓN — siempre editable */}
          <Section>
            <SectionTitle>Clasificación del producto</SectionTitle>

            <Grid2>
              <ContainerInput>
                <Select {...form.getInputProps("lineId")}>
                  <option value="">Selecciona una marca</option>
                  {lines?.map((line) => (
                    <option key={line.id} value={line.id}>
                      {line.name}
                    </option>
                  ))}
                </Select>
              </ContainerInput>

              <ContainerInput>
                <Select
                  {...form.getInputProps("brandName")}
                  disabled={!form.values.lineId}
                >
                  <option value="">Selecciona una línea</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </Select>
              </ContainerInput>
            </Grid2>
          </Section>

          {/* IMAGEN — siempre editable, en edición sin botón eliminar */}
          <Section>
            <SectionTitle>Imagen del producto</SectionTitle>

            {!form.values.imageFile && !previewUrl && (
              <ImageActions>
                <UploadBox>
                  🖼️ Elegir imagen
                  <HiddenInput
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        form.setFieldValue("imageFile", file);
                        setImageDeleted(false);
                      }
                    }}
                  />
                </UploadBox>

                <UploadBox>
                  📸 Tomar foto
                  <HiddenInput
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        form.setFieldValue("imageFile", file);
                        setImageDeleted(false);
                      }
                    }}
                  />
                </UploadBox>
              </ImageActions>
            )}

            {previewUrl && (
              <PreviewContainer className={isClosing ? "closing" : ""}>
                <PreviewImage src={previewUrl} alt="Preview del producto" />

                {isEdit ? (
                  // Edición: solo cambiar imagen, sin eliminar
                  <>
                    <HiddenInput
                      type="file"
                      accept="image/*"
                      id="edit-image-input"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          form.setFieldValue("imageFile", file);
                          setImageDeleted(false);
                        }
                      }}
                    />
                    <RemoveButton
                      type="button"
                      title="Cambiar imagen"
                      onClick={() =>
                        document.getElementById("edit-image-input").click()
                      }
                      style={{ background: "rgba(0,0,0,0.55)" }}
                    >
                      📷
                    </RemoveButton>
                  </>
                ) : (
                  // Creación: eliminar imagen
                  <RemoveButton
                    type="button"
                    onClick={() => {
                      setIsClosing(true);
                      setTimeout(() => {
                        form.setFieldValue("imageFile", null);
                        setImageDeleted(true);
                        setIsClosing(false);
                      }, 200);
                    }}
                  >
                    <X size={18} />
                  </RemoveButton>
                )}
              </PreviewContainer>
            )}
          </Section>
        </RightColumn>

        {/* ================= BOTÓN ================= */}
        <ButtonRow>
          <Button
            type="submit"
            disabled={
              isEdit
                ? !hasChanges || !form.isValid() || loading
                : !form.isValid() || loading
            }
          >
            {loading
              ? "Guardando..."
              : isEdit
              ? "Actualizar Producto"
              : "Crear Producto"}
          </Button>
        </ButtonRow>
      </Form>

      {scanning && (
        <ScannerOverlay>
          <BarcodeReader
            onDetected={(code) => {
              beepRef.current.currentTime = 0;
              beepRef.current.play().catch(() => {});
              form.setFieldValue("barcode", code);
              setScanning(false);
            }}
            onClose={() => setScanning(false)}
          />
        </ScannerOverlay>
      )}
    </Wrapper>
  );
}

export default ProductForm;