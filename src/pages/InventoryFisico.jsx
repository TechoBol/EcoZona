import React, { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import dayjs from "dayjs";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import {
  Container,
  Section,
  Row,
  Label,
  Input,
  Select,
  DateRow,
  Button,
  Wrapper,
  Header,
  Title,
} from "../components/ui/InventoryFisico";

import { useSucursales } from "../hooks/useSucursales";
import { useLines } from "../hooks/useLine";
import { useInventoryFisico } from "../hooks/useInventoryFisico";
import useInventory from "../hooks/useInventory";
import UserMenu from "../components/menus/UserMenu";

export default function InventoryFisico() {
  const { data: sucursales } = useSucursales();
  const { lines } = useLines();
  const { generarKardex, loading } = useInventoryFisico();
  const { products } = useInventory();

  const [filters, setFilters] = useState({
    sucursal: "",
    producto: null,
    marca: "",
    linea: "",
    auxiliar: "",
  });

  const [desde, setDesde] = useState(dayjs("2026-05-01"));
  const [hasta, setHasta] = useState(dayjs());

  /* 🔥 PRODUCT SEARCH */
  const [productSearch, setProductSearch] = useState("");
  const [showProducts, setShowProducts] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const openProductDropdown = () => {
    if (!inputRef.current) return;

    const rect = inputRef.current.getBoundingClientRect();

    setDropdownPos({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });

    setShowProducts(true);
  };

  const filteredProducts = useMemo(() => {
    const q = productSearch.toLowerCase();
    if (!q) return products;

    return products.filter((p) =>
      `${p.name} ${p.code || ""} ${p.barcode || ""}`.toLowerCase().includes(q),
    );
  }, [productSearch, products]);

  /* 🔥 MARCAS POR LÍNEA */
  const marcasFiltradas = useMemo(() => {
    const linea = lines.find((l) => l.id === Number(filters.linea));
    return linea?.brands || [];
  }, [filters.linea, lines]);

  const handleChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLineaChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      linea: value,
      marca: "",
    }));
  };

  const handleBuscar = () => {
    const sucursalSeleccionada = sucursales.find(
    (s) => s.id === Number(filters.sucursal),
  );
    generarKardex({
      producto: filters.producto,
      productoId: filters.producto?.id || null,
      locationId: Number(filters.sucursal) || null,
      locationName: sucursalSeleccionada?.name || "TODAS",
      linea: Number(filters.linea),
      marca: filters.marca,
      auxiliar: filters.auxiliar,
      fromDate: desde.format("YYYY-MM-DD"),
      toDate: hasta.format("YYYY-MM-DD"),
    });
  };

  /* 🔥 cerrar dropdown */
  useEffect(() => {
    const handleClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setShowProducts(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Wrapper>
      <Header>
        <UserMenu isOpen={menuOpen} setIsOpen={setMenuOpen} />
        <Title>Inventario Fisico Valorado</Title>
      </Header>
      <Container>
        <Section>
          {/* Sucursal */}
          <Row>
            <Label>Sucursal</Label>
            <Select onChange={(e) => handleChange("sucursal", e.target.value)}>
              <option value="">TODAS</option>
              {sucursales.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </Row>

          {/* 🔥 PRODUCTO BUSCADOR PRO */}
          <Row>
            <Label>Producto</Label>

            <div ref={inputRef}>
              <Input
                placeholder="Buscar producto..."
                value={
                  showProducts ? productSearch : filters.producto?.name || ""
                }
                onFocus={openProductDropdown}
                onChange={(e) => setProductSearch(e.target.value)}
                readOnly={!showProducts}
              />
            </div>
          </Row>

          {/* Línea */}
          <Row>
            <Label>Línea</Label>
            <Select onChange={(e) => handleLineaChange(e.target.value)}>
              <option value="">TODAS</option>
              {lines.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </Select>
          </Row>

          {/* Marca */}
          <Row>
            <Label>Marca</Label>
            <Select
              value={filters.marca}
              disabled={!filters.linea}
              onChange={(e) => handleChange("marca", e.target.value)}
            >
              <option value="">TODAS</option>
              {marcasFiltradas.map((m, i) => (
                <option key={i} value={m}>
                  {m}
                </option>
              ))}
            </Select>
          </Row>

          {/* Auxiliar */}
          <Row>
            <Label>Auxiliar</Label>
            <Input onChange={(e) => handleChange("auxiliar", e.target.value)} />
          </Row>
        </Section>

        {/* 📅 Fechas */}
        <Section>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRow>
              <DatePicker
                label="Desde"
                value={desde}
                onChange={(v) => v && setDesde(v)}
                slotProps={{ textField: { fullWidth: true } }}
              />
              <DatePicker
                label="Hasta"
                value={hasta}
                onChange={(v) => v && setHasta(v)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </DateRow>
          </LocalizationProvider>
        </Section>

        <Section>
          <Button onClick={handleBuscar} disabled={loading}>
            {loading ? "Generando PDF..." : "Generar Kardex"}
          </Button>
        </Section>

        {/* 🔥 DROPDOWN PRODUCTOS */}
        {showProducts &&
          createPortal(
            <div
              ref={dropdownRef}
              style={{
                position: "fixed",
                top: dropdownPos.top,
                left: dropdownPos.left,
                width: dropdownPos.width,
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                zIndex: 9999,
                maxHeight: "250px",
                overflowY: "auto",
              }}
            >
              {!filteredProducts.length && (
                <div style={{ padding: 12, color: "#aaa" }}>Sin resultados</div>
              )}

              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleChange("producto", p);
                    setShowProducts(false);
                    setProductSearch("");
                  }}
                  style={{
                    padding: "10px 14px",
                    cursor: "pointer",
                    borderBottom: "1px solid #f5f5f5",
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>

                  {(p.code || p.barcode) && (
                    <div style={{ fontSize: 11, color: "#aaa" }}>
                      {p.code || p.barcode}
                    </div>
                  )}
                </div>
              ))}
            </div>,
            document.body,
          )}
      </Container>
    </Wrapper>
  );
}
