import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../../hooks/useProduct";
import { useForm } from "@mantine/form";

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

function ProductForm() {
  const navigate = useNavigate();
  const { createProduct, loading, setLoading, subirArchivo } = useProduct();
  const [isClosing, setIsClosing] = useState(false);
  const [scanning, setScanning] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      barcode: "",
      imageFile: null,
      price: "",
      finalPrice: "",
      stock: "",
    },

    validateInputOnChange: true,

    validate: {
      name: (value) => (!value.trim() ? "El nombre es obligatorio" : null),

      barcode: (value) =>
        !value.trim() ? "El código de barras es obligatorio" : null,

      price: (value) =>
        !value || Number(value) <= 0 ? "El precio debe ser mayor a 0" : null,

      finalPrice: (value, values) =>
        !value || Number(value) <= 0
          ? "El precio final debe ser mayor a 0"
          : Number(value) < Number(values.price)
            ? "No puede ser menor al precio base"
            : null,

      stock: (value) =>
        value === "" || Number(value) < 0 ? "Stock inválido" : null,
    },
  });

  const previewUrl = useMemo(() => {
    if (!form.values.imageFile) return null;
    return URL.createObjectURL(form.values.imageFile);
  }, [form.values.imageFile]);

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      setLoading(true);
      let imageUrl = null;

      if (values.imageFile) {
        imageUrl = await subirArchivo(values.imageFile, values.barcode);
      }

      const payload = {
        name: values.name,
        description: values.description,
        barcode: values.barcode,
        price: Number(values.price),
        finalPrice: Number(values.finalPrice),
        stock: Number(values.stock),
        imageUrl: imageUrl,
      };

      await createProduct(payload);

      successToast("Producto creado");
      form.reset();
      navigate("/inventory");
    } catch (err) {
      console.error(err);
      errorToast("Error creando producto");
    }
  });

  return (
    <Wrapper>
      <Header>
        <BackButton onClick={() => navigate("/inventory")}>
          <ArrowLeft size={22} />
        </BackButton>
        <Title>Crear Producto</Title>
      </Header>

      <Form onSubmit={handleSubmit}>
        {/* NAME */}
        <ContainerInput>
          <Input
            hasError={!!form.errors.name}
            placeholder="Nombre de producto"
            {...form.getInputProps("name")}
          />
          {form.errors.name && <ErrorText>{form.errors.name}</ErrorText>}
        </ContainerInput>

        {/* DESCRIPTION */}
        <ContainerInput>
          <Input
            placeholder="Descripción"
            {...form.getInputProps("description")}
          />
        </ContainerInput>

        {/* BARCODE */}
        <ContainerInput>
          <BarcodeWrapper>
            <Input
              className="with-icon"
              hasError={!!form.errors.barcode}
              placeholder="Código de barras"
              {...form.getInputProps("barcode")}
            />

            <ScanButton type="button" onClick={() => setScanning(true)}>
              <ScanLine size={18} />
            </ScanButton>
          </BarcodeWrapper>

          {form.errors.barcode && <ErrorText>{form.errors.barcode}</ErrorText>}
        </ContainerInput>

        {/* PRICE */}
        <ContainerInput>
          <Input
            hasError={!!form.errors.price}
            type="number"
            placeholder="Precio unitario"
            {...form.getInputProps("price")}
          />
          {form.errors.price && <ErrorText>{form.errors.price}</ErrorText>}
        </ContainerInput>

        {/* FINAL PRICE */}
        <ContainerInput>
          <Input
            hasError={!!form.errors.finalPrice}
            type="number"
            placeholder="Precio venta"
            {...form.getInputProps("finalPrice")}
          />
          {form.errors.finalPrice && (
            <ErrorText>{form.errors.finalPrice}</ErrorText>
          )}
        </ContainerInput>

        {/* STOCK */}
        <ContainerInput>
          <Input
            hasError={!!form.errors.stock}
            type="number"
            placeholder="Stock inicial"
            {...form.getInputProps("stock")}
          />
          {form.errors.stock && <ErrorText>{form.errors.stock}</ErrorText>}
        </ContainerInput>
        <ContainerInput style={{ flexDirection: "column" }}>
          {!form.values.imageFile && (
            <div style={{ display: "flex", gap: "10px" }}>
              <UploadBox>
                🖼️ Elegir
                <HiddenInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) form.setFieldValue("imageFile", file);
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
                    const file = e.target.files[0];
                    if (file) form.setFieldValue("imageFile", file);
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
                    setIsClosing(false);
                  }, 200); // duración animación
                }}
              >
                <X size={18} />
              </RemoveButton>
            </PreviewContainer>
          )}
        </ContainerInput>
        <Button type="submit" disabled={!form.isValid() || loading}>
          {loading ? "Creando..." : "Crear Producto"}
        </Button>
      </Form>
      {scanning && (
        <ScannerOverlay>
          <BarcodeReader
            onDetected={(code) => {
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
