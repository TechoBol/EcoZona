import { useEffect, useState } from "react";
import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  FormGroup,
  ModalInput,
  ModalSelect,
  SaveButton,
  CloseButton,
} from "../ui/Location";
import { X } from "lucide-react";

export default function CreateLocationModal({
  open,
  onClose,
  onSubmit,
  form,
  setForm,
  isEdit, // 🔥 nuevo
}) {
  const [errors, setErrors] = useState({
    name: "",
    abbreviation: "",
  });

  // 🔥 ESC para cerrar
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // 🔥 limpiar errores cuando se abre
  useEffect(() => {
    if (open) {
      setErrors({
        name: "",
        abbreviation: "",
      });
    }
  }, [open]);

  // 🔥 VALIDACIÓN
  const validate = () => {
    let valid = true;
    const newErrors = { name: "", abbreviation: "" };

    if (!form.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
      valid = false;
    }

    if (!form.abbreviation.trim()) {
      newErrors.abbreviation = "La abreviación es obligatoria";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form);
  };

  // 🔥 cerrar limpiando errores
  const handleClose = () => {
    setErrors({
      name: "",
      abbreviation: "",
    });
    onClose();
  };

  if (!open) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>
          <X size={18} />
        </CloseButton>

        <ModalTitle>
  {isEdit ? "Editar sucursal" : "Nueva sucursal"}
</ModalTitle>

        <FormGroup>
          <div>
            <ModalInput
              placeholder="Nombre"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setErrors({ ...errors, name: "" }); // 🔥 limpia error al escribir
              }}
            />
            {errors.name && (
              <span style={{ color: "red", fontSize: 12 }}>
                {errors.name}
              </span>
            )}
          </div>

          <div>
            <ModalInput
              placeholder="Abreviación"
              value={form.abbreviation}
              onChange={(e) => {
                setForm({
                  ...form,
                  abbreviation: e.target.value,
                });
                setErrors({ ...errors, abbreviation: "" }); // 🔥 limpia error
              }}
            />
            {errors.abbreviation && (
              <span style={{ color: "red", fontSize: 12 }}>
                {errors.abbreviation}
              </span>
            )}
          </div>

          <ModalSelect
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
          >
            <option value="BRANCH">Sucursal</option>
            <option value="WAREHOUSE">Almacén</option>
          </ModalSelect>
        </FormGroup>

       <SaveButton onClick={handleSubmit}>
  {isEdit ? "Actualizar" : "Guardar"}
</SaveButton>
      </ModalContent>
    </ModalOverlay>
  );
}