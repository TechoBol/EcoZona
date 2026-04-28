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
} from "../../components/ui/Product";

import { ArrowLeft, ScanLine, X } from "lucide-react";
import { errorToast, successToast } from "../../services/toasts";
import BarcodeReader from "../Scanner/BarcodeReader";
import { useAmazonS3 } from "../../hooks/useAmazonS3";
import socket from "../../services/SocketIOConnection";

function ProductForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const product = location.state ?? null;
  const isEdit = !!product;

  const { createProduct, updateProduct, loading, setLoading, subirArchivo } =
    useProduct();

  const { getFileUrl } = useAmazonS3();

  const [scanning, setScanning] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  /* Sonido Beep al escanear*/
  const beepRef = useRef(null);

  useEffect(() => {
    beepRef.current = new Audio(Beep);
  }, []);

  // estado real de imagen S3
  const [s3Image, setS3Image] = useState(null);
  const [imageDeleted, setImageDeleted] = useState(false);

  // =========================
  // LOAD IMAGE FROM S3
  // =========================
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

  // =========================
  // FORM
  // =========================
  const form = useForm({
    initialValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      barcode: product?.barcode ?? "",
      imageFile: null,
      price: product?.price ?? "",
      finalPrice: product?.finalPrice ?? "",
      stock: product?.inventories?.[0]?.quantity ?? "",
    },

    validateInputOnChange: true,

    validate: {
      name: (v) => (!v.trim() ? "El nombre es obligatorio" : null),
      barcode: (v) => (!v.trim() ? "El código es obligatorio" : null),
      price: (v) => (!v || Number(v) <= 0 ? "Precio inválido" : null),
      finalPrice: (v, values) =>
        !v || Number(v) <= 0
          ? "Precio inválido"
          : Number(v) < Number(values.price)
          ? "No puede ser menor al precio base"
          : null,
      stock: (v) => (v === "" || Number(v) < 0 ? "Stock inválido" : null),
    },
  });

  // =========================
  // PREVIEW IMAGE LOGIC
  // =========================
  const previewUrl = useMemo(() => {
    if (form.values.imageFile) {
      return URL.createObjectURL(form.values.imageFile);
    }

    if (!imageDeleted && s3Image) {
      return s3Image;
    }

    return null;
  }, [form.values.imageFile, s3Image, imageDeleted]);

  // =========================
  // SUBMIT
  // =========================
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
        name: values.name,
        description: values.description,
        barcode: values.barcode,
        price: Number(values.price),
        finalPrice: Number(values.finalPrice),
        stock: Number(values.stock),
        imageUrl: imageKey,
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
      navigate("/inventory", { replace: true });
    } catch (err) {
      console.error(err);
      errorToast(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  });

  // =========================
  // UI
  // =========================
  return (
    <Wrapper>
      <Header>
        <BackButton onClick={() => navigate("/inventory", { replace: true })}>
          <ArrowLeft size={22} />
        </BackButton>
        <Title>{isEdit ? "Editar Producto" : "Crear Producto"}</Title>
      </Header>

      <Form onSubmit={handleSubmit}>
        <ContainerInput>
          <Input placeholder="Nombre" {...form.getInputProps("name")} />
          {form.errors.name && <ErrorText>{form.errors.name}</ErrorText>}
        </ContainerInput>

        <ContainerInput>
          <Input
            placeholder="Descripción"
            {...form.getInputProps("description")}
          />
        </ContainerInput>

        <ContainerInput>
          <BarcodeWrapper>
            <Input placeholder="Código" {...form.getInputProps("barcode")} />
            <ScanButton type="button" onClick={() => setScanning(true)}>
              <ScanLine size={18} />
            </ScanButton>
          </BarcodeWrapper>
        </ContainerInput>

        <ContainerInput>
          <Input
            type="number"
            placeholder="Precio"
            {...form.getInputProps("price")}
          />
        </ContainerInput>

        <ContainerInput>
          <Input
            type="number"
            placeholder="Precio venta"
            {...form.getInputProps("finalPrice")}
          />
        </ContainerInput>

        <ContainerInput>
          <Input
            type="number"
            placeholder="Stock"
            {...form.getInputProps("stock")}
          />
        </ContainerInput>

        {/* ================= IMAGE ================= */}
        <ContainerInput style={{ flexDirection: "column" }}>
          {!form.values.imageFile && (
            <div style={{ display: "flex", gap: "10px" }}>
              <UploadBox>
                🖼️ Elegir
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
                📸 Cámara
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
            </div>
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
        </ContainerInput>

        <Button type="submit" disabled={!form.isValid() || loading}>
          {loading
            ? "Guardando..."
            : isEdit
            ? "Actualizar Producto"
            : "Crear Producto"}
        </Button>
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
