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
  isLoading,
}) {
  const [errors, setErrors] = useState({
    name: "",
    maxEmployeesAllowed: "",
  });

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setErrors({
        name: "",
        maxEmployeesAllowed: "",
      });
    }
  }, [open]);

  // VALIDACIÓN
  const validate = () => {
    let valid = true;

    const newErrors = {
      name: "",
      maxEmployeesAllowed: "",
    };

    // Nombre obligatorio
    if (!form.name?.trim()) {
      newErrors.name = "El nombre es obligatorio";
      valid = false;
    }

    // Máximo empleados
    if (
      form.maxEmployeesAllowed === "" ||
      form.maxEmployeesAllowed < 1 ||
      form.maxEmployeesAllowed > 4
    ) {
      newErrors.maxEmployeesAllowed = "Debe ser entre 1 y 4";

      valid = false;
    }

    setErrors(newErrors);

    return valid;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      ...form,
      maxEmployeesAllowed: Number(form.maxEmployeesAllowed),
    });
  };

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

        <ModalTitle>{isEdit ? "Editar rol" : "Nuevo rol"}</ModalTitle>

        <FormGroup>
          {/* NOMBRE */}
          <div>
            <ModalInput
              placeholder="Nombre del rol"
              value={form.name}
              onChange={(e) => {
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
              <span
                style={{
                  color: "red",
                  fontSize: 12,
                }}
              >
                {errors.name}
              </span>
            )}
          </div>

          {/* DESCRIPCIÓN */}
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

          {/* MAX EMPLEADOS */}
          <div>
            <ModalInput
              type="text"
              inputMode="numeric"
              placeholder="Nivel de permisos"
              value={form.maxEmployeesAllowed}
              onChange={(e) => {
                let value = e.target.value;
                // Permitir vacío
                if (value === "") {
                  setForm({
                    ...form,
                    maxEmployeesAllowed: "",
                  });

                  return;
                }
                // Solo permitir números
                if (!/^[1-4]$/.test(value)) {
                  return;
                }
                setForm({
                  ...form,
                  maxEmployeesAllowed: value,
                });

                setErrors({
                  ...errors,
                  maxEmployeesAllowed: "",
                });
              }}
            />
            {errors.maxEmployeesAllowed && (
              <span
                style={{
                  color: "red",
                  fontSize: 12,
                }}
              >
                {errors.maxEmployeesAllowed}
              </span>
            )}
          </div>
        </FormGroup>

        <SaveButton onClick={handleSubmit} disabled={isLoading}>
          {isLoading
            ? isEdit
              ? "Actualizando..."
              : "Guardando..."
            : isEdit
            ? "Actualizar"
            : "Guardar"}
        </SaveButton>
      </ModalContent>
    </ModalOverlay>
  );
}
