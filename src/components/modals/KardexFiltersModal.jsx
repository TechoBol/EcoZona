import { useState } from "react";

import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  Row,
  Label,
  ModalInput,
  ModalSelect,
  SaveButton,
  ActionsRow,
} from "../ui/Kardex";

import { useKardex } from "../../hooks/useKardex";

import dayjs from "dayjs";


export default function KardexFiltersModal({
  open,
  onClose,
  onGenerate,
}) {
  const { generarKardex, loading } =
    useKardex();

  const [form, setForm] = useState({
    sucursal: "",
    item: "",
    marca: "",
    linea: "",
    cliente: "",
    vendedor: "",
    documento: "",
  });

  const [desde, setDesde] = useState(
    dayjs().startOf("month"),
  );

  const [hasta, setHasta] = useState(dayjs());

  if (!open) return null;

  const handleGenerate = async () => {
    const res = await generarKardex({
      ...form,
      fromDate: desde.format("YYYY-MM-DD"),
      toDate: hasta.format("YYYY-MM-DD"),
    });

    onGenerate(res || []);
  };

  return (
    <ModalOverlay>
      <ModalContent
        style={{
          width: 900,
          maxWidth: "95vw",
        }}
      >
        <ModalTitle>
          Matriz de Ventas
        </ModalTitle>

        {/* SUCURSAL */}
        <Row>
          <Label>Suc. - Almacén</Label>

          <ModalSelect
            value={form.sucursal}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                sucursal: e.target.value,
              }))
            }
          >
            <option value="">
              *** TODAS ***
            </option>
          </ModalSelect>
        </Row>

        {/* ITEM */}
        <Row>
          <Label>Item</Label>

          <ModalInput
            value={form.item}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                item: e.target.value,
              }))
            }
          />
        </Row>

        {/* MARCA */}
        <Row>
          <Label>Marca</Label>

          <ModalInput
            value={form.marca}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                marca: e.target.value,
              }))
            }
          />
        </Row>

        {/* LINEA */}
        <Row>
          <Label>Línea</Label>

          <ModalInput
            value={form.linea}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                linea: e.target.value,
              }))
            }
          />
        </Row>

        {/* CLIENTE */}
        <Row>
          <Label>Cliente</Label>

          <ModalInput
            value={form.cliente}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                cliente: e.target.value,
              }))
            }
          />
        </Row>

        {/* VENDEDOR */}
        <Row>
          <Label>Vendedor</Label>

          <ModalSelect
            value={form.vendedor}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                vendedor: e.target.value,
              }))
            }
          >
            <option value="">
              *** TODOS ***
            </option>
          </ModalSelect>
        </Row>

        {/* DOCUMENTO */}
        <Row>
          <Label>Documento</Label>

          <ModalSelect
            value={form.documento}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                documento: e.target.value,
              }))
            }
          >
            <option value="">
              **Todos**
            </option>
          </ModalSelect>
        </Row>

        {/* FECHAS */}
        <Row>
          <Label>Desde</Label>

          <ModalInput
            type="date"
            value={desde.format("YYYY-MM-DD")}
            onChange={(e) =>
              setDesde(dayjs(e.target.value))
            }
          />
        </Row>

        <Row>
          <Label>Hasta</Label>

          <ModalInput
            type="date"
            value={hasta.format("YYYY-MM-DD")}
            onChange={(e) =>
              setHasta(dayjs(e.target.value))
            }
          />
        </Row>

        <ActionsRow>
          <SaveButton
            onClick={handleGenerate}
          >
            {loading
              ? "Generando..."
              : "OK"}
          </SaveButton>

          <SaveButton onClick={onClose}>
            Cancelar
          </SaveButton>
        </ActionsRow>
      </ModalContent>
    </ModalOverlay>
  );
}