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

  const beepRef = useRef(null);

  useEffect(() => {
    beepRef.current = new Audio(Beep);
  }, []);

  const [s3Image, setS3Image] = useState(null);
  const [imageDeleted, setImageDeleted] = useState(false);

  useEffect(() => {
    console.log(product);
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
  const form = useForm({
    initialValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      barcode: product?.barcode ?? "",
      imageFile: null,
      price: product?.price ?? "",
      finalPrice: product?.finalPrice ?? "",
      stock: getStockByLocation(product, locationId) ?? "",
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
          {/* INFORMACIÓN GENERAL */}
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
            <SectionTitle>Costos e inventario</SectionTitle>

            <Grid3>
              <ContainerInput>
                <Input
                  type="number"
                  placeholder="Precio compra"
                  {...form.getInputProps("price")}
                />
                {form.errors.price && (
                  <ErrorText>{form.errors.price}</ErrorText>
                )}
              </ContainerInput>

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

              <ContainerInput>
                <Input
                  type="number"
                  placeholder="Stock inicial"
                  {...form.getInputProps("stock")}
                />
                {form.errors.stock && (
                  <ErrorText>{form.errors.stock}</ErrorText>
                )}
              </ContainerInput>
            </Grid3>
          </Section>
        </LeftColumn>

        {/* ================= COLUMNA DERECHA ================= */}
        <RightColumn>
          {/* CLASIFICACIÓN */}
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

          {/* IMAGEN */}
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
                <PreviewImage src={previewUrl} />

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
              </PreviewContainer>
            )}
          </Section>
        </RightColumn>

        {/* ================= BOTÓN ================= */}
        <ButtonRow>
          <Button type="submit" disabled={!form.isValid() || loading}>
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
