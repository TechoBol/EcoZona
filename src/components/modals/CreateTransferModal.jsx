import { useState, useEffect, useRef } from "react";
import {
  CloseButton,
  FormGroup,
  ModalContent,
  ModalOverlay,
  ModalTitle,
  SaveButton,
  ItemRow,
  DeleteButton,
  AddItemButton,
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
  locations = [],
}) {
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const dropdownRef = useRef(null);

  //////////////////////////////
  // CLICK AFUERA
  //////////////////////////////
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setActiveIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔥 IMPORTANTE: después de hooks
  if (!open) return null;

  //////////////////////////////
  // STOCK BASE
  //////////////////////////////
  const getStock = (product) => {
    if (!product?.inventories) return 0;
    const found = product.inventories.find(
      (inv) => inv.locationId === location?.id
    );
    return found?.quantity || 0;
  };

  //////////////////////////////
  // STOCK DINÁMICO (RESTA LO YA USADO)
  //////////////////////////////
  const getAvailableStock = (productId, currentIndex) => {
    const product = inventory.find((p) => p.id === productId);
    const baseStock = getStock(product);

    const used = form.items.reduce((acc, item, idx) => {
      if (item.productId === productId && idx !== currentIndex) {
        return acc + Number(item.quantity || 0);
      }
      return acc;
    }, 0);

    return baseStock - used;
  };

  //////////////////////////////
  // ITEMS
  //////////////////////////////
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
      newItems[index] = { productId: value, quantity: 1 };
    }

    if (field === "quantity") {
      const productId = newItems[index].productId;
      const available = getAvailableStock(productId, index);

      let qty = Number(value);

      if (isNaN(qty)) qty = 1;
      if (qty > available) qty = available;
      if (qty < 1) qty = 1;

      newItems[index].quantity = qty;
    }

    setForm({ ...form, items: newItems });
  };

  //////////////////////////////
  // BUSCADOR
  //////////////////////////////
  const filteredProducts = inventory.filter((p) =>
    `${p.name} ${p.code || ""} ${p.barcode || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  //////////////////////////////
  // VALIDACIÓN
  //////////////////////////////
  const isValid =
    form.destinationId &&
    form.items.length > 0 &&
    form.items.every((i) => i.productId && i.quantity > 0);

  //////////////////////////////
  // SUBMIT
  //////////////////////////////
  const handleSubmit = async () => {
    try {
      const cleanItems = form.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      }));

      await onSubmit({
        destinationId: form.destinationId,
        items: cleanItems,
      });

      successToast("Transferencia enviada con éxito");
      onClose();
    } catch {
      errorToast("Error al enviar la transferencia");
    }
  };

  //////////////////////////////
  // ESTILOS
  //////////////////////////////
  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #ddd",
  };

  const btnQty = {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    border: "1px solid #ddd",
    background: "#f5f5f5",
    cursor: "pointer",
  };

  //////////////////////////////
  // RENDER
  //////////////////////////////
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "20px",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <CloseButton onClick={onClose}>✖</CloseButton>

        <ModalTitle>Enviar productos</ModalTitle>

        {/* HEADER */}
        <div
          style={{
            background: "#f5f5f5",
            borderRadius: "12px",
            padding: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "15px 0",
          }}
        >
          <span>
            <strong>DESDE:</strong> {location?.name}
          </span>

          <select
            value={form.destinationId || ""}
            onChange={(e) =>
              setForm({
                ...form,
                destinationId: Number(e.target.value),
              })
            }
            style={{ border: "none", background: "transparent" }}
          >
            <option value="">Seleccionar destino...</option>
            {locations
              .filter((l) => l.id !== location?.id)
              .map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
          </select>
        </div>

        {/* ITEMS */}
        <FormGroup>
          {form.items.map((item, index) => {
            const product = inventory.find(
              (p) => p.id === item.productId
            );
            const available = getAvailableStock(item.productId, index);

            return (
              <ItemRow key={index} style={{ marginBottom: "10px" }}>
                {/* BUSCADOR */}
                <div ref={dropdownRef} style={{ flex: 1, position: "relative" }}>
                  <input
                    style={inputStyle}
                    placeholder="Seleccionar producto..."
                    value={
                      activeIndex === index
                        ? search
                        : product?.name || ""
                    }
                    onFocus={() => {
                      setActiveIndex(index);
                      setSearch("");
                    }}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  {activeIndex === index && (
                    <div
                      style={{
                        position: "absolute",
                        top: "110%",
                        left: 0,
                        right: 0,
                        background: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        maxHeight: "200px",
                        overflowY: "auto",
                        zIndex: 20,
                      }}
                    >
                      {filteredProducts.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            updateItem(index, "productId", p.id);
                            setActiveIndex(null);
                            setSearch("");
                          }}
                          style={{ padding: "10px", cursor: "pointer" }}
                        >
                          {p.name}
                          <br />
                          <small>
                            {p.code} • Stock: {getStock(p)}
                          </small>
                        </div>
                      ))}
                    </div>
                  )}

                  {product && (
                    <small style={{ color: "#888" }}>
                      Disponible: {available}
                    </small>
                  )}
                </div>

                {/* CANTIDAD */}
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <button
                    style={btnQty}
                    onClick={() =>
                      updateItem(index, "quantity", item.quantity - 1)
                    }
                  >
                    -
                  </button>

                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", e.target.value)
                    }
                    style={{
                      width: "50px",
                      textAlign: "center",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                    }}
                  />

                  <button
                    style={btnQty}
                    onClick={() =>
                      updateItem(index, "quantity", item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                {/* DELETE */}
                <DeleteButton onClick={() => removeItem(index)}>
                  <FaTrash />
                </DeleteButton>
              </ItemRow>
            );
          })}

          <AddItemButton onClick={addItem}>
            + Agregar producto
          </AddItemButton>
        </FormGroup>

        {/* BOTÓN */}
        <SaveButton disabled={!isValid} onClick={handleSubmit}>
          Enviar productos
        </SaveButton>
      </ModalContent>
    </ModalOverlay>
  );
}