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

export default function CreateEmployeeModal({
  open,
  onClose,
  onSubmit,
  form,
  setForm,
  isEdit,
  roles,
  locations,
}) {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) setErrors({});
  }, [open]);

  const validate = () => {
    let e = {};

    if (!form.name) e.name = "Ingresa el nombre";
    if (!form.lastName) e.lastName = "Ingresa el apellido";
    if (!form.email) e.email = "Ingresa el correo";
    if (!form.roleId) e.roleId = "Selecciona un rol";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form);
  };

  if (!open) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <X size={18} />
        </CloseButton>

        <ModalTitle>{isEdit ? "Editar empleado" : "Nuevo empleado"}</ModalTitle>

        <FormGroup>
          <ModalInput
            placeholder="Nombre"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && (
            <span style={{ color: "red", fontSize: 12 }}>{errors.name}</span>
          )}

          <ModalInput
            placeholder="Apellido"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
          {errors.lastName && (
            <span style={{ color: "red", fontSize: 12 }}>
              {errors.lastName}
            </span>
          )}

          <ModalInput
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && (
            <span style={{ color: "red", fontSize: 12 }}>{errors.email}</span>
          )}
          <ModalInput
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <ModalSelect
            value={form.roleId}
            onChange={(e) =>
              setForm({ ...form, roleId: Number(e.target.value) })
            }
          >
            <option value="">Seleccione rol</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </ModalSelect>

          <ModalSelect
            value={form.locationId || ""}
            onChange={(e) =>
              setForm({
                ...form,
                locationId: Number(e.target.value),
              })
            }
          >
            <option value="">Sin sucursal</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </ModalSelect>
        </FormGroup>

        <SaveButton onClick={handleSubmit}>Guardar</SaveButton>
      </ModalContent>
    </ModalOverlay>
  );
}
