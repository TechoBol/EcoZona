

import {
  CloseButton,
  FormGroup,
  ModalContent,
  ModalOverlay,
  ModalSelect,
  ModalTitle,
  SaveButton,
  ItemRow,
  DeleteButton,
  AddItemButton,
  SmallInput,
} from "../ui/Location";
import { FaTrash } from "react-icons/fa";
import { errorToast, successToast } from "../../services/toasts";

export default function CreateTransferModal({
  open,
  onClose,
  form,
  setForm,
  onSubmit,
  inventory = [],
  location,
}) {
  if (!open) return null;

  const getStock = (product) => {
    if (!product?.inventories) return 0;
    const found = product.inventories.find(
      (inv) => inv.locationId === location?.id,
    );
    return found?.quantity || 0;
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { productId: "", quantity: 1 }],
    });
  };

  const removeItem = (index) => {
    setForm({
      ...form,
      items: form.items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...form.items];

    if (field === "productId") {
      const exists = newItems.some(
        (i, idx) => i.productId === value && idx !== index,
      );
      if (exists) return;
      newItems[index] = { productId: value, quantity: 1 };
    }

    if (field === "quantity") {
      if (value === "") {
        newItems[index].quantity = "";
      } else {
        let qty = Number(value);
        if (qty < 1) qty = 1;
        newItems[index].quantity = qty;
      }
    }

    setForm({ ...form, items: newItems });
  };

  const isValid =
    form.items.length > 0 &&
    form.items.every((i) => i.productId && i.quantity > 0);

  const handleSubmit = async () => {
    try {
      const cleanItems = form.items
        .filter((i) => i.productId && i.quantity > 0)
        .map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        }));

      await onSubmit({ items: cleanItems });

      successToast("Solicitud creada con éxito");
      onClose();
    } catch (error) {
      errorToast("Error al crear la solicitud");
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>✖</CloseButton>
        <ModalTitle>Solicitar productos</ModalTitle>

        <FormGroup>
          {form.items.map((item, index) => {
            const product = inventory.find((p) => p.id === item.productId);
            const stock = getStock(product);

            return (
              <ItemRow key={index}>
                <ModalSelect
                  value={item.productId}
                  onChange={(e) =>
                    updateItem(index, "productId", Number(e.target.value))
                  }
                >
                  <option value="">Producto</option>
                  {inventory.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}{" "}
                      {getStock(p) === 0
                        ? "(Sin stock)"
                        : `(Stock: ${getStock(p)})`}
                    </option>
                  ))}
                </ModalSelect>

                <SmallInput
                  type="number"
                  value={item.quantity}
                  min={1}
                  onChange={(e) =>
                    updateItem(index, "quantity", e.target.value)
                  }
                />

                <DeleteButton onClick={() => removeItem(index)}>
                  <FaTrash />
                </DeleteButton>
              </ItemRow>
            );
          })}

          <AddItemButton onClick={addItem}>+ Agregar producto</AddItemButton>
        </FormGroup>

        <SaveButton disabled={!isValid} onClick={handleSubmit}>
          Solicitar
        </SaveButton>
      </ModalContent>
    </ModalOverlay>
  );
}