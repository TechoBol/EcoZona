import { useEffect, useState } from "react";
import { theme } from "../ui/Theme";
import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  FormGroup,
  ModalInput,
  SaveButton,
  CloseButton,
} from "../ui/Location";

import { X, Plus, Pencil, Trash2, Check } from "lucide-react";
import { usePermissions } from "../../hooks/usePermissions";

export default function CreateLineModal({
  open,
  onClose,
  onSubmit,
  form,
  setForm,
  isEdit,
  isLoading,
}) {
  const [errors, setErrors] = useState({ name: "" });

  const [newBrand, setNewBrand] = useState("");
  const [brands, setBrands] = useState([]);

  const [editingBrand, setEditingBrand] = useState(null);
  const [editValue, setEditValue] = useState("");

  const permissions = usePermissions();
  const canManage = permissions.canManageLinesAdmin;

  useEffect(() => {
    if (open) {
      setErrors({ name: "" });
      setNewBrand("");
      setBrands(form.brands || []);
      setEditingBrand(null);
      setEditValue("");
    }
  }, [open]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const validate = () => {
    let valid = true;

    const newErrors = {
      name: "",
    };

    if (!form.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleAddBrand = () => {
    if (!canManage) return;

    const trimmed = newBrand.trim();
    if (!trimmed) return;
    if (brands.includes(trimmed)) return;

    setBrands((prev) => [...prev, trimmed]);
    setNewBrand("");
  };

  const handleDeleteBrand = (brand) => {
    if (!canManage) return;
    setBrands((prev) => prev.filter((b) => b !== brand));
  };

  const handleEditBrand = (oldBrand) => {
    if (!canManage) return;

    const trimmed = editValue.trim();
    if (!trimmed) return;

    setBrands(brands.map((b) => (b === oldBrand ? trimmed : b)));

    setEditingBrand(null);
    setEditValue("");
  };

  const handleSubmit = () => {
    if (!canManage) return;
    if (!validate()) return;

    onSubmit({
      ...form,
      brands,
    });
  };

  const handleClose = () => {
    setErrors({ name: "" });
    onClose();
  };

  if (!open) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 520,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <CloseButton onClick={handleClose}>
          <X size={18} />
        </CloseButton>

        <ModalTitle>{isEdit ? "Editar línea" : "Nueva línea"}</ModalTitle>

        {/* Nombre */}
        <FormGroup>
          <div>
            <ModalInput
              placeholder="Nombre de la línea"
              value={form.name}
              disabled={!canManage}
              onChange={(e) => {
                if (!canManage) return;

                setForm({
                  ...form,
                  name: e.target.value,
                });

                setErrors({
                  ...errors,
                  name: "",
                });
              }}
            />

            {errors.name && (
              <span style={{ color: "red", fontSize: 12 }}>
                {errors.name}
              </span>
            )}
          </div>
        </FormGroup>

        {/* Marcas */}
        <div style={{ marginTop: 20 }}>
          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            Marcas asociadas
          </p>

          {/* Agregar marca */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 14,
              alignItems: "stretch",
            }}
          >
            <ModalInput
              placeholder="Agregar marca"
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddBrand();
              }}
              style={{
                flex: 1,
                marginBottom: 0,
                height: 48,
                boxSizing: "border-box",
              }}
            />

            <button
              type="button"
              onClick={handleAddBrand}
              disabled={!canManage}
              style={{
                width: 48,
                height: 48,
                minWidth: 48,
                border: "none",
                borderRadius: 14,
                background: theme.colors.background,
                color: theme.colors.primary,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                flexShrink: 0,
                boxShadow: theme.colors.secondary,
                transition: "all 0.2s ease",
              }}
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Lista */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              maxHeight: 260,
              overflowY: "auto",
            }}
          >
            {brands.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: "#999",
                  fontSize: 13,
                  padding: "20px 0",
                }}
              >
                No hay marcas agregadas
              </div>
            ) : (
              brands.map((brand) => (
                <div
                  key={brand}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 12px",
                    border: "1px solid #eee",
                    borderRadius: 12,
                    background: "#f8f9ff",
                  }}
                >
                  {editingBrand === brand ? (
                    <>
                      <ModalInput
                        autoFocus
                        value={editValue}
                        disabled={!canManage}
                        onChange={(e) => setEditValue(e.target.value)}
                        style={{ flex: 1, marginBottom: 0 }}
                        onKeyDown={(e) => {
                          if (!canManage) return;
                          if (e.key === "Enter") {
                            handleEditBrand(brand);
                          }
                        }}
                      />

                      <Check
                        size={18}
                        style={{
                          cursor: canManage ? "pointer" : "default",
                          color: "#22c55e",
                          opacity: !canManage ? 0.5 : 1,
                        }}
                        onClick={() => {
                          if (!canManage) return;
                          handleEditBrand(brand);
                        }}
                      />

                      <X
                        size={18}
                        style={{ cursor: "pointer", color: "#999" }}
                        onClick={() => setEditingBrand(null)}
                      />
                    </>
                  ) : (
                    <>
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>
                        {brand}
                      </span>

                      <Pencil
                        size={16}
                        style={{
                          cursor: canManage ? "pointer" : "default",
                          color: "#22c55e",
                          opacity: !canManage ? 0.5 : 1,
                        }}
                        onClick={() => {
                          if (!canManage) return;
                          setEditingBrand(brand);
                          setEditValue(brand);
                        }}
                      />

                      <Trash2
                        size={16}
                        style={{
                          cursor: canManage ? "pointer" : "default",
                          color: "#e53935",
                          opacity: !canManage ? 0.5 : 1,
                        }}
                        onClick={() => handleDeleteBrand(brand)}
                      />
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Guardar */}
        {canManage && (
          <SaveButton
            onClick={handleSubmit}
            disabled={isLoading}
            style={{ marginTop: 22 }}
          >
            {isLoading
              ? isEdit
                ? "Actualizando..."
                : "Guardando..."
              : isEdit
              ? "Actualizar"
              : "Guardar"}
          </SaveButton>
        )}
      </ModalContent>
    </ModalOverlay>
  );
}