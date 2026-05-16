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

import { useSucursales } from "../../hooks/useSucursales";

import { useLines } from "../../hooks/useLine";

export default function KardexFiltersModal({
  open,
  onClose,
  onGenerate,
  groupBy,
}) {
  const {
    generarKardex,
    loading,
  } = useKardex();

  const { data = [] } =
    useSucursales();

  const { lines = [] } =
    useLines();

  const [form, setForm] =
    useState({
      sucursal: "",
      marca: "",
      linea: "",
    });

  const [desde, setDesde] =
    useState(
      dayjs("2026-04-01")
    );

  const [hasta, setHasta] =
    useState(dayjs());

  //////////////////////////////////////////
  // SELECTED LINE
  //////////////////////////////////////////

  const selectedLine = lines.find(
    (line) =>
      Number(line.id) ===
      Number(form.linea),
  );

  const brands =
    selectedLine?.brands || [];

  //////////////////////////////////////////
  // HANDLE GENERATE
  //////////////////////////////////////////

  const handleGenerate =
    async () => {
      const res =
        await generarKardex({
          ...form,

          groupBy,

          fromDate:
            desde.format(
              "YYYY-MM-DD",
            ),

          toDate:
            hasta.format(
              "YYYY-MM-DD",
            ),
        });

      onGenerate(res || []);
    };

  if (!open) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <>
          <ModalTitle>
            Filtros de Ventas
          </ModalTitle>

          <Section>
            <SectionTitle>
              Rango de fechas
            </SectionTitle>

            <DatesGrid>
              <div>
                <Label>
                  Desde
                </Label>

                <ModalInput
                  type="date"
                  value={desde.format(
                    "YYYY-MM-DD",
                  )}
                  onChange={(e) =>
                    setDesde(
                      dayjs(
                        e.target.value,
                      ),
                    )
                  }
                />
              </div>

              <div>
                <Label>
                  Hasta
                </Label>

                <ModalInput
                  type="date"
                  value={hasta.format(
                    "YYYY-MM-DD",
                  )}
                  onChange={(e) =>
                    setHasta(
                      dayjs(
                        e.target.value,
                      ),
                    )
                  }
                />
              </div>
            </DatesGrid>
          </Section>

          <Section>
            <SectionTitle>
              Filtros generales
            </SectionTitle>

            <Row>
              <Label>
                Sucursal
              </Label>

              <ModalSelect
                value={
                  form.sucursal
                }
                onChange={(e) =>
                  setForm(
                    (prev) => ({
                      ...prev,

                      sucursal:
                        e.target
                          .value,
                    }),
                  )
                }
              >
                <option value="">
                  Todas
                </option>

                {data.map(
                  (item) => (
                    <option
                      key={
                        item.id
                      }
                      value={
                        item.id
                      }
                    >
                      {item.name}
                    </option>
                  ),
                )}
              </ModalSelect>
            </Row>

            <Row>
              <Label>
                Línea
              </Label>

              <ModalSelect
                value={
                  form.linea
                }
                onChange={(e) =>
                  setForm(
                    (prev) => ({
                      ...prev,

                      linea:
                        e.target
                          .value,

                      marca: "",
                    }),
                  )
                }
              >
                <option value="">
                  Todas
                </option>

                {lines.map(
                  (line) => (
                    <option
                      key={
                        line.id
                      }
                      value={
                        line.id
                      }
                    >
                      {line.name}
                    </option>
                  ),
                )}
              </ModalSelect>
            </Row>

            <Row>
              <Label>
                Marca
              </Label>

              <ModalSelect
                value={
                  form.marca
                }
                onChange={(e) =>
                  setForm(
                    (prev) => ({
                      ...prev,

                      marca:
                        e.target
                          .value,
                    }),
                  )
                }
                disabled={
                  !form.linea
                }
              >
                <option value="">
                  Todas
                </option>

                {brands.map(
                  (
                    brand,
                    index,
                  ) => (
                    <option
                      key={index}
                      value={
                        brand
                      }
                    >
                      {brand}
                    </option>
                  ),
                )}
              </ModalSelect>
            </Row>
          </Section>

          <ActionsRow>
            <SaveButton
              onClick={
                handleGenerate
              }
            >
              {loading
                ? "Generando..."
                : "Generar"}
            </SaveButton>

            <CancelButton
              onClick={onClose}
            >
              Cancelar
            </CancelButton>
          </ActionsRow>
        </>
      </ModalContent>
    </ModalOverlay>
  );
}