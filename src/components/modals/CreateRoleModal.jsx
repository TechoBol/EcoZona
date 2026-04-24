import { useEffect, useState } from "react";
import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  FormGroup,
  ModalInput,
  SaveButton,
  CloseButton,
} from "../ui/Location";
import { X } from "lucide-react";

export default function CreateRoleModal({
  open,
  onClose,
  onSubmit,
  form,
  setForm,
  isEdit,
}) {
  const [errors, setErrors] = useState({
    name: "",
    maxEmployeesAllowed: "",
  });

  // 🔥 ESC para cerrar
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // 🔥 limpiar errores al abrir
  useEffect(() => {
    if (open) {
      setErrors({
        name: "",
        maxEmployeesAllowed: "",
      });
    }
  }, [open]);

  // 🔥 VALIDACIÓN
  const validate = () => {
    let valid = true;
    const newErrors = {
      name: "",
      maxEmployeesAllowed: "",
    };

    if (!form.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
      valid = false;
    }

    if (
      form.maxEmployeesAllowed === "" ||
      form.maxEmployeesAllowed <= 0
    ) {
      newErrors.maxEmployeesAllowed =
        "Debe ser mayor a 0";
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
      maxEmployeesAllowed: "",
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
          {isEdit ? "Editar rol" : "Nuevo rol"}
        </ModalTitle>

        <FormGroup>
          {/* 🔥 NAME */}
          <div>
            <ModalInput
              placeholder="Nombre del rol"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setErrors({ ...errors, name: "" });
              }}
            />
            {errors.name && (
              <span style={{ color: "red", fontSize: 12 }}>
                {errors.name}
              </span>
            )}
          </div>

          {/* 🔥 DESCRIPCIÓN */}
          <ModalInput
            placeholder="Descripción (opcional)"
            value={form.description || ""}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          {/* 🔥 MAX EMPLEADOS */}
          <div>
            <ModalInput
              type="number"
              placeholder="Máx empleados"
              value={form.maxEmployeesAllowed}
              onChange={(e) => {
                setForm({
                  ...form,
                  maxEmployeesAllowed: Number(e.target.value),
                });
                setErrors({
                  ...errors,
                  maxEmployeesAllowed: "",
                });
              }}
            />
            {errors.maxEmployeesAllowed && (
              <span style={{ color: "red", fontSize: 12 }}>
                {errors.maxEmployeesAllowed}
              </span>
            )}
          </div>
        </FormGroup>

        <SaveButton onClick={handleSubmit}>
          {isEdit ? "Actualizar" : "Guardar"}
        </SaveButton>
      </ModalContent>
    </ModalOverlay>
  );
}