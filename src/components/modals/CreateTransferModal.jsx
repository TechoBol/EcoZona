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

  //////////////////////////////////////////
  // 🧠 STOCK POR SUCURSAL (solo informativo)
  //////////////////////////////////////////
  const getStock = (product) => {
    if (!product?.inventories) return 0;

    const found = product.inventories.find(
      (inv) => inv.locationId === location?.id,
    );

    return found?.quantity || 0;
  };

  //////////////////////////////////////////
  // ➕ AGREGAR ITEM
  //////////////////////////////////////////
  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { productId: "", quantity: 1 }],
    });
  };

  //////////////////////////////////////////
  // ❌ ELIMINAR
  //////////////////////////////////////////
  const removeItem = (index) => {
    setForm({
      ...form,
      items: form.items.filter((_, i) => i !== index),
    });
  };

  //////////////////////////////////////////
  // 🔄 UPDATE
  //////////////////////////////////////////
  const updateItem = (index, field, value) => {
    const newItems = [...form.items];

    if (field === "productId") {
      // 🚫 evitar duplicados
      const exists = newItems.some(
        (i, idx) => i.productId === value && idx !== index,
      );
      if (exists) return;

      newItems[index] = {
        productId: value,
        quantity: 1,
      };
    }

    if (field === "quantity") {
      let qty = value;

      // permitir vacío mientras escribe
      if (value === "") {
        newItems[index].quantity = "";
      } else {
        qty = Number(value);
        if (qty < 1) qty = 1;

        newItems[index].quantity = qty;
      }
    }

    setForm({ ...form, items: newItems });
  };

  //////////////////////////////////////////
  // ✅ VALIDACIÓN (YA NO DEPENDE DEL STOCK)
  //////////////////////////////////////////
  const isValid =
    form.items.length > 0 &&
    form.items.every((i) => {
      return i.productId && i.quantity > 0;
    });

  //////////////////////////////////////////
  // 🚀 SUBMIT
  //////////////////////////////////////////
  const handleSubmit = () => {
    const cleanItems = form.items
      .filter((i) => i.productId && i.quantity > 0)
      .map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      }));

    onSubmit({
      items: cleanItems,
    });
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
                {/* PRODUCTO */}
                <ModalSelect
                  value={item.productId}
                  onChange={(e) =>
                    updateItem(index, "productId", Number(e.target.value))
                  }
                >
                  <option value="">Producto</option>

                  {/* 🔥 YA NO FILTRA POR STOCK */}
                  {inventory.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}{" "}
                      {getStock(p) === 0
                        ? "(Sin stock)"
                        : `(Stock: ${getStock(p)})`}
                    </option>
                  ))}
                </ModalSelect>

                {/* CANTIDAD */}
                <SmallInput
                  type="number"
                  value={item.quantity}
                  min={1}
                  onChange={(e) =>
                    updateItem(index, "quantity", e.target.value)
                  }
                />

                {/* DELETE */}
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
