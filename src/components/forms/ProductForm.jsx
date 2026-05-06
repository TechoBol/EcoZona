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
  const [s3Image, setS3Image] = useState(null);
  const [imageDeleted, setImageDeleted] = useState(false);

  const beepRef = useRef(null);

  ///////////////////////////////////////
  // BEEP
  ///////////////////////////////////////
  useEffect(() => {
    beepRef.current = new Audio(Beep);
  }, []);

  ///////////////////////////////////////
  // LOAD IMAGE
  ///////////////////////////////////////
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

  ///////////////////////////////////////
  // STOCK POR SUCURSAL
  ///////////////////////////////////////
  const getStockByLocation = (product, locationId) => {
    if (!product || !locationId) return "";

    const found = product.inventories?.find(
      (inv) => inv.locationId === locationId
    );

    return found?.quantity ?? 0;
  };

  ///////////////////////////////////////
  // FORM
  ///////////////////////////////////////
  const form = useForm({
    initialValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      barcode: product?.barcode ?? "",
      imageFile: null,
      price: product?.price ?? "",
      finalPrice: product?.finalPrice ?? "",
      stock: isEdit ? getStockByLocation(product, locationId) : "",
      lineId: product?.lineId ?? "",
      brandName: product?.brandName ?? "",
    },

    validateInputOnChange: true,

    validate: {
      name: (v) => (!v.trim() ? "Ingresa el nombre" : null),
      barcode: (v) => (!v.trim() ? "Ingresa el código" : null),
      price: (v) => (!v || Number(v) <= 0 ? "Precio inválido" : null),
      finalPrice: (v, values) =>
        !v || Number(v) <= 0
          ? "Precio inválido"
          : Number(v) < Number(values.price)
          ? "No puede ser menor al precio base"
          : null,
      stock: (v) =>
        v === "" || Number(v) < 0 ? "Cantidad inválida" : null,
    },
  });

  ///////////////////////////////////////
  // PREVIEW IMAGE
  ///////////////////////////////////////
  const previewUrl = useMemo(() => {
    if (form.values.imageFile) {
      return URL.createObjectURL(form.values.imageFile);
    }

    if (!imageDeleted && s3Image) {
      return s3Image;
    }

    return null;
  }, [form.values.imageFile, s3Image, imageDeleted]);

  ///////////////////////////////////////
  // SUBMIT
  ///////////////////////////////////////
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
        locationId, // 🔥 IMPORTANTE
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

  ///////////////////////////////////////
  // LINES / BRANDS
  ///////////////////////////////////////
  const { lines } = useLines();
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const selectedLine = lines?.find(
      (l) => l.id === Number(form.values.lineId)
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

  ///////////////////////////////////////
  // UI
  ///////////////////////////////////////
  return (
    <Wrapper>
      <Header>
        <BackButton onClick={() => navigate("/inventory", { replace: true })}>
          <ArrowLeft size={20} />
        </BackButton>

        <Title>{isEdit ? "Editar Producto" : "Crear Producto"}</Title>
      </Header>

      <Form onSubmit={handleSubmit}>
        <LeftColumn>
          <Section>
            <SectionTitle>Información general</SectionTitle>

            <Grid2>
              <ContainerInput>
                <Input {...form.getInputProps("name")} placeholder="Nombre" />
                {form.errors.name && <ErrorText>{form.errors.name}</ErrorText>}
              </ContainerInput>

              <ContainerInput>
                <Input {...form.getInputProps("description")} placeholder="Descripción" />
              </ContainerInput>
            </Grid2>

            <ContainerInput>
              <BarcodeWrapper>
                <Input {...form.getInputProps("barcode")} placeholder="Código" />
                <ScanButton onClick={() => setScanning(true)}>
                  <ScanLine size={18} />
                </ScanButton>
              </BarcodeWrapper>
            </ContainerInput>
          </Section>

          <Section>
            <SectionTitle>Costos e inventario</SectionTitle>

            <Grid3>
              <Input type="number" {...form.getInputProps("price")} placeholder="Compra" />
              <Input type="number" {...form.getInputProps("finalPrice")} placeholder="Venta" />
              <Input type="number" {...form.getInputProps("stock")} placeholder="Stock" />
            </Grid3>
          </Section>
        </LeftColumn>

        <RightColumn>
          <Section>
            <SectionTitle>Clasificación</SectionTitle>

            <Grid2>
              <Select {...form.getInputProps("lineId")}>
                <option value="">Línea</option>
                {lines?.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </Select>

              <Select {...form.getInputProps("brandName")} disabled={!form.values.lineId}>
                <option value="">Marca</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </Select>
            </Grid2>
          </Section>

          <Section>
            <SectionTitle>Imagen</SectionTitle>

            {!previewUrl && (
              <UploadBox>
                Subir imagen
                <HiddenInput
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) form.setFieldValue("imageFile", file);
                  }}
                />
              </UploadBox>
            )}

            {previewUrl && (
              <PreviewContainer>
                <PreviewImage src={previewUrl} />
                <RemoveButton onClick={() => setImageDeleted(true)}>
                  <X size={18} />
                </RemoveButton>
              </PreviewContainer>
            )}
          </Section>
        </RightColumn>

        <ButtonRow>
          <Button type="submit">
            {loading ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
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