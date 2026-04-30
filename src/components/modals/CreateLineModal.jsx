import { useEffect, useState } from "react";
import {
  ModalOverlay, ModalContent, ModalTitle,
  FormGroup, ModalInput, SaveButton, CloseButton,
} from "../ui/Location";
import { X } from "lucide-react";

export default function CreateLineModal({ open, onClose, onSubmit, form, setForm, isEdit, isLoading }) {
  const [errors, setErrors] = useState({ name: "" });

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    if (open) setErrors({ name: "" });
  }, [open]);

  const validate = () => {
    let valid = true;
    const newErrors = { name: "" };
    if (!form.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form);
  };

  const handleClose = () => {
    setErrors({ name: "" });
    onClose();
  };

  if (!open) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>
          <X size={18} />
        </CloseButton>

        <ModalTitle>{isEdit ? "Editar línea" : "Nueva línea"}</ModalTitle>

        <FormGroup>
          <div>
            <ModalInput
              placeholder="Nombre"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setErrors({ ...errors, name: "" });
              }}
            />
            {errors.name && (
              <span style={{ color: "red", fontSize: 12 }}>{errors.name}</span>
            )}
          </div>
        </FormGroup>

        <SaveButton onClick={handleSubmit} disabled={isLoading}>
          {isLoading
            ? isEdit ? "Actualizando..." : "Guardando..."
            : isEdit ? "Actualizar" : "Guardar"}
        </SaveButton>
      </ModalContent>
    </ModalOverlay>
  );
}