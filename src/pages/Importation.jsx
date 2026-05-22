import { useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useImportation } from "../hooks/useImportation";
import { useProductSearch } from "../hooks/useProductSearch";

import {
    Wrapper, Header, BackButton, Title,
    SearchWrapper, SearchInput, Dropdown, DropdownItem,
    DropdownBarcode, DropdownName, DropdownHint,
    TableWrapper, Table, Thead, Tbody,
    NumberInput, RemoveButton, EmptyHint,
    Footer, FeedbackRow, ErrorText, SubmitButton,
} from "../components/ui/Importation";

const Importation = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [rows, setRows] = useState([]);

    const { bulkUpdateProducts, loading, error, results } = useImportation();
    const { searchProducts, results: searchResults, searching, clearResults } = useProductSearch();

    const handleSearch = (value) => {
        setQuery(value);
        searchProducts(value);
    };

    const handleSelect = (product) => {
        if (!rows.some((r) => r.id === product.id)) {
            setRows((prev) => [
                ...prev,
                { id: product.id, barcode: product.barcode, name: product.name, purchasePrice: "0", stock: "0" },
            ]);
        }
        clearResults();
        setQuery("");
    };

    // ─── Guarda siempre como string ───────────────────────
    const handleChange = (id, field, value) => {
        setRows((prev) =>
            prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
        );
    };

    const handleRemove = (id) => setRows((prev) => prev.filter((r) => r.id !== id));

    // ─── Convierte a número solo al enviar ────────────────
    const handleSubmit = async () => {
        const valid = rows.filter(
            (r) => r.purchasePrice !== "" && r.stock !== ""
        );
        if (valid.length === 0) return;

        const payload = valid.map((r) => ({
            id: r.id,
            purchasePrice: Number(r.purchasePrice),
            stock: Number(r.stock),
        }));

        console.log("📦 Payload enviado:", payload); // ← aquí ves qué se envía

        await bulkUpdateProducts(payload);
    };

    return (
        <Wrapper>
            <Header>
                <BackButton onClick={() => navigate(-1)}>
                    <ArrowLeft size={22} />
                </BackButton>
                <Title>Nueva Importación</Title>
            </Header>

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
                            : searchResults.map((product) => (
                                <DropdownItem key={product.id} onClick={() => handleSelect(product)}>
                                    <DropdownBarcode>{product.barcode}</DropdownBarcode>
                                    <DropdownName>{product.name}</DropdownName>
                                </DropdownItem>
                            ))
                        }
                    </Dropdown>
                )}
            </SearchWrapper>

            <TableWrapper>
                <Table>
                    <Thead>
                        <tr>
                            <th>Codigo</th>
                            <th>Nombre</th>
                            <th>Precio Compra</th>
                            <th>Cantidad</th>
                            <th />
                        </tr>
                    </Thead>
                    <Tbody>
                        {rows.map((row) => (
                            <tr key={row.id}>
                                <td>{row.barcode}</td>
                                <td style={{ maxWidth: 70, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {row.name}
                                </td>
                                <td>
                                    <NumberInput
                                        type="number"
                                        value={row.purchasePrice}
                                        onChange={(e) => handleChange(row.id, "purchasePrice", e.target.value)}
                                        onFocus={() => { if (row.purchasePrice === "0") handleChange(row.id, "purchasePrice", "") }}
                                        onBlur={() => { if (row.purchasePrice === "") handleChange(row.id, "purchasePrice", "0") }}
                                        placeholder="0"
                                        $width="72px"
                                    />
                                </td>
                                <td>
                                    <NumberInput
                                        type="number"
                                        value={row.stock}
                                        onChange={(e) => handleChange(row.id, "stock", e.target.value)}
                                        onFocus={() => { if (row.stock === "0") handleChange(row.id, "stock", "") }}
                                        onBlur={() => { if (row.stock === "") handleChange(row.id, "stock", "0") }}
                                        placeholder="0"
                                        $width="56px"
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

            <Footer>
                {results.length > 0 && (
                    <FeedbackRow>
                        <span style={{ color: "#69d584" }}>
                            ✓ {results.filter((r) => r.status === "fulfilled").length} actualizados
                        </span>
                        {results.some((r) => r.status === "rejected") && (
                            <span style={{ color: "#dc655f" }}>
                                {" · "}✕ {results.filter((r) => r.status === "rejected").length} fallidos
                            </span>
                        )}
                    </FeedbackRow>
                )}

                {error && <ErrorText>{error}</ErrorText>}

                <SubmitButton onClick={handleSubmit} disabled={loading || rows.length === 0}>
                    {loading ? "Actualizando..." : "Actualizar"}
                </SubmitButton>
            </Footer>
        </Wrapper>
    );
};

export default Importation;