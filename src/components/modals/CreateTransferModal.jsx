import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  CloseButton,
  FormGroup,
  ModalContent,
  ModalOverlay,
  ModalTitle,
  SaveButton,
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
  const [searches, setSearches] = useState({});
  const [activeIndex, setActiveIndex] = useState(null);
  const [sending, setSending] = useState(false);
  const [showDestinations, setShowDestinations] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const [destDropdownPos, setDestDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  const inputRefs = useRef({});
  const destinationTriggerRef = useRef(null);
  const productDropdownRef = useRef(null);
  const destDropdownRef = useRef(null);

  // ── cerrar al click afuera ──────────────────────────────────────────
  useEffect(() => {
    const handle = (e) => {
      if (
        activeIndex !== null &&
        productDropdownRef.current &&
        !productDropdownRef.current.contains(e.target) &&
        inputRefs.current[activeIndex] &&
        !inputRefs.current[activeIndex].contains(e.target)
      ) {
        setActiveIndex(null);
      }
      if (
        showDestinations &&
        destDropdownRef.current &&
        !destDropdownRef.current.contains(e.target) &&
        destinationTriggerRef.current &&
        !destinationTriggerRef.current.contains(e.target)
      ) {
        setShowDestinations(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [activeIndex, showDestinations]);

  if (!open) return null;

  // ── stock ──────────────────────────────────────────────────────────
  const getStock = (product) => {
    if (!product?.inventories) return 0;
    const found = product.inventories.find((inv) => inv.locationId === location?.id);
    return found?.quantity || 0;
  };

  const getAvailableStock = (productId, currentIndex) => {
    const product = inventory.find((p) => p.id === productId);
    const base = getStock(product);
    const used = form.items.reduce((acc, item, idx) => {
      if (item.productId === productId && idx !== currentIndex)
        return acc + Number(item.quantity || 0);
      return acc;
    }, 0);
    return base - used;
  };

  // ── items ──────────────────────────────────────────────────────────
  const addItem = () => {
    setForm({ ...form, items: [...form.items, { productId: "", quantity: 1 }] });
  };

  const removeItem = (index) => {
    setForm({ ...form, items: form.items.filter((_, i) => i !== index) });
    if (activeIndex === index) setActiveIndex(null);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...form.items];
    if (field === "productId") newItems[index] = { productId: value, quantity: 1 };
    if (field === "quantity") newItems[index].quantity = value;
    setForm({ ...form, items: newItems });
  };

  const validateQuantity = (index) => {
    const newItems = [...form.items];
    const available = getAvailableStock(newItems[index].productId, index);
    let qty = Number(newItems[index].quantity);
    if (isNaN(qty) || qty < 1) qty = 1;
    if (qty > available) qty = available;
    newItems[index].quantity = qty;
    setForm({ ...form, items: newItems });
  };

  // ── open dropdown PRODUCT ──────────────────────────────────────────
  const openProductDropdown = (index) => {
    const el = inputRefs.current[index];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
    setActiveIndex(index);
    setSearches((prev) => ({ ...prev, [index]: "" }));
  };

  // ── open dropdown DESTINATION ──────────────────────────────────────
  const openDestDropdown = () => {
    const el = destinationTriggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setDestDropdownPos({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
    setShowDestinations(true);
  };

  // ── validación ─────────────────────────────────────────────────────
  const isValid =
    form.destinationId &&
    form.items.length > 0 &&
    form.items.every((i) => i.productId && i.quantity > 0);

  // ── submit ─────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (sending) return;
    try {
      setSending(true);
      await onSubmit({
        destinationId: form.destinationId,
        items: form.items.map((i) => ({
          productId: i.productId,
          quantity: Number(i.quantity),
        })),
      });
      successToast("Transferencia enviada con éxito");
      onClose();
    } catch {
      errorToast("Error al enviar la transferencia");
    } finally {
      setSending(false);
    }
  };

  // ── estilos inline ─────────────────────────────────────────────────
  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #e0e0e0",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    background: "#fafafa",
    cursor: "pointer",
  };

  const btnQty = {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    border: "1px solid #ddd",
    background: "#f5f5f5",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    padding: 0,
  };

  const dropdownStyle = {
    position: "fixed",
    background: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    zIndex: 9999,
    overflowY: "auto",
    maxHeight: "220px",
  };

  // ── render ─────────────────────────────────────────────────────────
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: 0,
          maxWidth: "520px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
          overflow: "hidden",
        }}
      >
        {/* ── HEADER ── */}
        <div style={{ padding: "20px 20px 12px 20px", flexShrink: 0 }}>
          <CloseButton onClick={onClose}>✖</CloseButton>
          <ModalTitle style={{ marginBottom: "14px" }}>Enviar productos</ModalTitle>

          {/* Origen → Destino */}
          <div
            style={{
              background: "#f8f8f8",
              borderRadius: "14px",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              border: "1px solid #eee",
            }}
          >
            {/* Origen */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "10px", color: "#aaa", fontWeight: 600, marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Desde
              </div>
              <div style={{ fontWeight: 600, fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {location?.name}
              </div>
            </div>

            <span style={{ fontSize: "16px", color: "#bbb", flexShrink: 0 }}>→</span>

            {/* Destino */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "10px", color: "#aaa", fontWeight: 600, marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Hacia
              </div>
              <div
                ref={destinationTriggerRef}
                onClick={openDestDropdown}
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                  color: form.destinationId ? "#1a1a1a" : "#999",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  userSelect: "none",
                }}
              >
                {form.destinationId
                  ? locations.find((l) => l.id === form.destinationId)?.name
                  : "Seleccionar destino..."}
              </div>
            </div>
          </div>
        </div>

        {/* ── SCROLL BODY ── */}
        <div
          style={{
            padding: "0 20px",
            overflowY: "auto",
            flexGrow: 1,
            // sin minHeight fijo: el contenido define el alto
          }}
        >
          <FormGroup>
            {form.items.map((item, index) => {
              const product = inventory.find((p) => p.id === item.productId);
              const available = item.productId ? getAvailableStock(item.productId, index) : null;

              const filteredProducts = inventory.filter((p) => {
                const q = (searches[index] || "").toLowerCase();
                if (!q) return true;
                return `${p.name} ${p.code || ""} ${p.barcode || ""}`.toLowerCase().includes(q);
              });

              return (
                <div key={index} style={{ marginBottom: "10px" }}>
                  {/* Fila principal */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {/* Input buscador */}
                    <div ref={(el) => (inputRefs.current[index] = el)} style={{ flex: 1, minWidth: 0 }}>
                      <input
                        style={{
                          ...inputStyle,
                          borderColor: activeIndex === index ? "#1a1a1a" : "#e0e0e0",
                          background: activeIndex === index ? "#fff" : "#fafafa",
                        }}
                        placeholder="Buscar por nombre o código..."
                        value={activeIndex === index ? searches[index] || "" : product?.name || ""}
                        onFocus={() => openProductDropdown(index)}
                        onChange={(e) =>
                          setSearches((prev) => ({ ...prev, [index]: e.target.value }))
                        }
                        readOnly={activeIndex !== index}
                      />
                    </div>

                    {/* Cantidad */}
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                      <button
                        style={btnQty}
                        onClick={() =>
                          updateItem(index, "quantity", Math.max(1, Number(item.quantity || 1) - 1))
                        }
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        min={1}
                        onChange={(e) => {
                          const max = item.productId ? getAvailableStock(item.productId, index) : 999;
                          let val = parseInt(e.target.value, 10);
                          if (isNaN(val) || val < 1) val = 1;
                          if (val > max) val = max;
                          updateItem(index, "quantity", val);
                        }}
                        style={{
                          width: "36px",
                          textAlign: "center",
                          border: "none",
                          fontSize: "14px",
                          fontWeight: 600,
                          // ocultar flechitas nativas
                          MozAppearance: "textfield",
                          WebkitAppearance: "none",
                          appearance: "textfield",
                        }}
                      />
                      <button
                        style={btnQty}
                        onClick={() => {
                          const max = item.productId ? getAvailableStock(item.productId, index) : 999;
                          updateItem(index, "quantity", Math.min(max, Number(item.quantity || 0) + 1));
                        }}
                      >
                        +
                      </button>
                    </div>

                    {/* Eliminar */}
                    <DeleteButton onClick={() => removeItem(index)} style={{ flexShrink: 0 }}>
                      <FaTrash />
                    </DeleteButton>
                  </div>

                  {/* Stock disponible */}
                  {product && available !== null && (
                    <div style={{
                      fontSize: "11px",
                      color: available <= 5 ? "#e53935" : "#888",
                      marginTop: "4px",
                      marginLeft: "2px",
                      fontWeight: available <= 5 ? 600 : 400,
                    }}>
                      {available <= 0
                        ? "⚠ Sin stock disponible"
                        : `Stock disponible: ${available} unidades`}
                    </div>
                  )}
                </div>
              );
            })}

            <AddItemButton onClick={addItem} style={{ marginTop: "4px" }}>
              + Agregar producto
            </AddItemButton>
          </FormGroup>
        </div>

        {/* ── FOOTER ── */}
        <div
          style={{
            padding: "10px 20px 16px 20px",
            borderTop: "1px solid #f3f3f3",
            flexShrink: 0,
          }}
        >
          <SaveButton disabled={!isValid || sending} onClick={handleSubmit}>
            {sending ? "Enviando..." : "Enviar productos"}
          </SaveButton>
        </div>
      </ModalContent>

      {/* ── PORTAL: dropdown productos ── */}
      {activeIndex !== null &&
        createPortal(
          <div
            ref={productDropdownRef}
            style={{
              ...dropdownStyle,
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width,
            }}
          >
            {(() => {
              const index = activeIndex;
              const filteredProducts = inventory.filter((p) => {
                const q = (searches[index] || "").toLowerCase();
                if (!q) return true;
                return `${p.name} ${p.code || ""} ${p.barcode || ""}`.toLowerCase().includes(q);
              });

              if (!filteredProducts.length)
                return (
                  <div style={{ padding: "12px 14px", fontSize: "13px", color: "#aaa" }}>
                    Sin resultados
                  </div>
                );

              return filteredProducts.map((p) => {
                const stock = getStock(p);
                return (
                  <div
                    key={p.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      updateItem(index, "productId", p.id);
                      setActiveIndex(null);
                    }}
                    style={{
                      padding: "10px 14px",
                      cursor: "pointer",
                      borderBottom: "1px solid #f5f5f5",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "8px",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f8f8f8")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "13px", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {p.name}
                      </div>
                      {(p.code || p.barcode) && (
                        <div style={{ fontSize: "11px", color: "#aaa", marginTop: "1px" }}>
                          {p.code || p.barcode}
                        </div>
                      )}
                    </div>
                    <span style={{
                      fontSize: "11px",
                      color: stock <= 5 ? "#e53935" : "#888",
                      flexShrink: 0,
                      fontWeight: stock <= 5 ? 600 : 400,
                    }}>
                      Stock: {stock}
                    </span>
                  </div>
                );
              });
            })()}
          </div>,
          document.body
        )}

      {/* ── PORTAL: dropdown destinos ── */}
      {showDestinations &&
        createPortal(
          <div
            ref={destDropdownRef}
            style={{
              ...dropdownStyle,
              top: destDropdownPos.top,
              left: destDropdownPos.left,
              width: Math.max(destDropdownPos.width, 180),
            }}
          >
            {locations
              .filter((l) => l.id !== location?.id)
              .map((l) => (
                <div
                  key={l.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setForm({ ...form, destinationId: l.id });
                    setShowDestinations(false);
                  }}
                  style={{
                    padding: "10px 14px",
                    cursor: "pointer",
                    fontSize: "14px",
                    borderBottom: "1px solid #f5f5f5",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8f8f8")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {l.name}
                </div>
              ))}
          </div>,
          document.body
        )}
    </ModalOverlay>
  );
}