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
  Section,
  SectionTitle,
  DatesGrid,
  CancelButton,
} from "../ui/Kardex";

import { useKardex } from "../../hooks/useKardex";

import dayjs from "dayjs";

export default function KardexFiltersModal({ open, onClose, onGenerate }) {
  const { generarKardex, loading } = useKardex();

  const [form, setForm] = useState({
    sucursal: "",
    item: "",
    marca: "",
    linea: "",
    cliente: "",
    vendedor: "",
    documento: "",
  });

  const [desde, setDesde] = useState(dayjs().startOf("month"));

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
      <ModalContent>
        <>
          <ModalTitle>Filtros de Ventas</ModalTitle>

          <Section>
            <SectionTitle>Rango de fechas</SectionTitle>

            <DatesGrid>
              <div>
                <Label>Desde</Label>

                <ModalInput
                  type="date"
                  value={desde.format("YYYY-MM-DD")}
                  onChange={(e) => setDesde(dayjs(e.target.value))}
                />
              </div>

              <div>
                <Label>Hasta</Label>

                <ModalInput
                  type="date"
                  value={hasta.format("YYYY-MM-DD")}
                  onChange={(e) => setHasta(dayjs(e.target.value))}
                />
              </div>
            </DatesGrid>
          </Section>

          <Section>
            <SectionTitle>Filtros generales</SectionTitle>

            <Row>
              <Label>Sucursal</Label>

              <ModalSelect
                value={form.sucursal}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    sucursal: e.target.value,
                  }))
                }
              >
                <option value="">Todas</option>
              </ModalSelect>
            </Row>

            <Row>
              <Label>Línea</Label>

              <ModalInput
                placeholder="Buscar línea..."
                value={form.linea}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    linea: e.target.value,
                  }))
                }
              />
            </Row>

            <Row>
              <Label>Marca</Label>

              <ModalInput
                placeholder="Buscar marca..."
                value={form.marca}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    marca: e.target.value,
                  }))
                }
              />
            </Row>
          </Section>

          <ActionsRow>
            <SaveButton onClick={handleGenerate}>
              {loading ? "Generando..." : "Generar"}
            </SaveButton>

            <CancelButton onClick={onClose}>Cancelar</CancelButton>
          </ActionsRow>
        </>
      </ModalContent>
    </ModalOverlay>
  );
}
