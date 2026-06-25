import { useState, useEffect } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useNewImportation } from "../hooks/useNewImportation";
import { useProductSearch } from "../hooks/useProductSearch";
import { getImportationByIdService } from "../services/importationService";
import { useLoginStore } from "../components/store/loginStore";
import { errorToast } from "../services/toasts";
import {
    Wrapper, Header, BackButton, Title,
    SearchWrapper, SearchInput, Dropdown, DropdownItem,
    DropdownBarcode, DropdownName, DropdownHint,
    TableWrapper, Table, Thead, Tbody,
    NumberInput, RemoveButton, EmptyHint,
    Footer, ErrorText, SubmitButton, SecondaryButton,
    DesktopLayout, LeftPanel, RightPanel, SectionLabel, CodeDisplay,
} from "../components/ui/NewImportation";

const EditImportation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useLoginStore();

    const { updateManualImportation, loading, error } = useNewImportation();
    const { searchProducts, results: searchResults, searching, clearResults } = useProductSearch();

    const [loadingDetail, setLoadingDetail] = useState(true);
    const [importation, setImportation] = useState(null);

    const [query, setQuery] = useState("");
    const [rows, setRows] = useState([]);

    // ─────────────────────────────────────────────
    // Cargar importación existente
    // ─────────────────────────────────────────────
    useEffect(() => {
        const fetchImportation = async () => {
            try {
                const data = await getImportationByIdService(Number(id), token);

                if (!data || data.status !== "DRAFT") {
                    errorToast("Esta importación no puede editarse");
                    navigate("/importation");
                    return;
                }

                setImportation(data);

                // Cargar items existentes como filas editables
                setRows(
                    data.items.map((item) => ({
                        id: item.product.id,
                        barcode: item.product.barcode,
                        name: item.product.name,
                        unitCost: String(item.unitCost),
                        quantity: String(item.quantity),
                    }))
                );
            } catch {
                errorToast("Error al cargar la importación");
                navigate("/importation");
            } finally {
                setLoadingDetail(false);
            }
        };

        fetchImportation();
    }, [id]);

    // ─────────────────────────────────────────────
    // Búsqueda y tabla
    // ─────────────────────────────────────────────
    const handleSearch = (value) => {
        setQuery(value);
        searchProducts(value);
    };

    const handleSelect = (product) => {
        if (!rows.some((r) => r.id === product.id)) {
            setRows((prev) => [...prev, {
                id: product.id,
                barcode: product.barcode,
                name: product.name,
                unitCost: "0",
                quantity: "0",
            }]);
        }
        clearResults();
        setQuery("");
    };

    const handleChange = (id, field, value) =>
        setRows((prev) => prev.map((r) => r.id === id ? { ...r, [field]: value } : r));

    const handleRemove = (id) =>
        setRows((prev) => prev.filter((r) => r.id !== id));

    // ─────────────────────────────────────────────
    // Guardar
    // ─────────────────────────────────────────────
    const handleSubmit = async () => {
        const valid = rows.filter((r) => r.unitCost !== "" && r.quantity !== "");
        if (!valid.length) return;

        await updateManualImportation(
            Number(id),
            valid.map((r) => ({
                barcode: r.barcode,
                unitCost: Number(r.unitCost),
                quantity: Number(r.quantity),
            }))
        );
    };

    const isDisabled = loading || rows.length === 0;

    // ─────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────
    if (loadingDetail) {
        return (
            <Wrapper>
                <Header>
                    <BackButton onClick={() => navigate(-1)}>
                        <ArrowLeft size={22} />
                    </BackButton>
                    <Title style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
                        Editar importación
                    </Title>
                </Header>
                <p style={{ textAlign: "center", color: "#aaa", marginTop: 60, fontSize: 14 }}>
                    Cargando...
                </p>
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            <Header>
                <BackButton onClick={() => navigate(-1)}>
                    <ArrowLeft size={22} />
                </BackButton>
                <Title style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
                    Editar importación
                </Title>
            </Header>

            <DesktopLayout>
                {/* ── Columna izquierda ── */}
                <LeftPanel>
                    <SectionLabel>Datos de la importación</SectionLabel>

                    <CodeDisplay>{importation?.code ?? ""}</CodeDisplay>

                    <SearchWrapper>
                        <SearchInput
                            type="text"
                            placeholder="Buscar por nombre o código"
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        {(searchResults.length > 0 || searching) && (
                            <Dropdown>
                                {searching
                                    ? <DropdownHint>Buscando...</DropdownHint>
                                    : searchResults.map((p) => (
                                        <DropdownItem key={p.id} onClick={() => handleSelect(p)}>
                                            <DropdownBarcode>{p.barcode}</DropdownBarcode>
                                            <DropdownName>{p.name}</DropdownName>
                                        </DropdownItem>
                                    ))}
                            </Dropdown>
                        )}
                    </SearchWrapper>
                </LeftPanel>

                {/* ── Columna derecha ── */}
                <RightPanel>
                    <TableWrapper>
                        <Table>
                            <Thead>
                                <tr>
                                    <th style={{ width: "110px" }}>Código</th>
                                    <th>Nombre</th>
                                    <th style={{ width: "120px" }}>Costo Unit.</th>
                                    <th style={{ width: "100px" }}>Cantidad</th>
                                    <th style={{ width: "40px" }} />
                                </tr>
                            </Thead>
                            <Tbody>
                                {rows.map((row) => (
                                    <tr key={row.id}>
                                        <td style={{ width: "110px", fontSize: 12, color: "#9ca3af" }}>
                                            {row.barcode}
                                        </td>
                                        <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {row.name}
                                        </td>
                                        <td>
                                            <NumberInput
                                                type="number" value={row.unitCost} $width="100px"
                                                onChange={(e) => handleChange(row.id, "unitCost", e.target.value)}
                                                onFocus={() => { if (row.unitCost === "0") handleChange(row.id, "unitCost", ""); }}
                                                onBlur={() => { if (row.unitCost === "") handleChange(row.id, "unitCost", "0"); }}
                                                placeholder="0"
                                            />
                                        </td>
                                        <td>
                                            <NumberInput
                                                type="number" value={row.quantity} $width="80px"
                                                onChange={(e) => handleChange(row.id, "quantity", e.target.value)}
                                                onFocus={() => { if (row.quantity === "0") handleChange(row.id, "quantity", ""); }}
                                                onBlur={() => { if (row.quantity === "") handleChange(row.id, "quantity", "0"); }}
                                                placeholder="0"
                                            />
                                        </td>
                                        <td>
                                            <RemoveButton onClick={() => handleRemove(row.id)}>
                                                <Trash2 size={15} />
                                            </RemoveButton>
                                        </td>
                                    </tr>
                                ))}
                            </Tbody>
                        </Table>
                        {rows.length === 0 && <EmptyHint>Busca productos para agregar</EmptyHint>}
                    </TableWrapper>
                </RightPanel>
            </DesktopLayout>

            <Footer>
                {error && <ErrorText>{error}</ErrorText>}
                <SubmitButton onClick={handleSubmit} disabled={isDisabled}>
                    {loading ? "Guardando..." : "Guardar cambios"}
                </SubmitButton>
            </Footer>
        </Wrapper>
    );
};

export default EditImportation;