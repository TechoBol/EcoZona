import { useState, useRef } from "react";
import { ArrowLeft, Trash2, FileSpreadsheet, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNewImportation } from "../hooks/useNewImportation";
import { useProductSearch } from "../hooks/useProductSearch";

import {
    Wrapper, Header, BackButton, Title,
    SearchWrapper, SearchInput, Dropdown, DropdownItem,
    DropdownBarcode, DropdownName, DropdownHint,
    TableWrapper, Table, Thead, Tbody,
    NumberInput, RemoveButton, EmptyHint,
    Footer, ErrorText, SubmitButton, SecondaryButton,
} from "../components/ui/NewImportation";

// ── Drop zone ────────────────────────────────────────────────────────────────
const DropZone = ({ onFile, file, onClear }) => {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) onFile(f);
    };

    if (file) return (
        <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "12px 16px", borderRadius: 30,
            background: "rgba(49,155,52,0.06)",
            border: "1px solid rgba(49,155,52,0.25)",
            marginBottom: 14,
            transition: "all 0.2s ease",
        }}>
            <FileSpreadsheet size={18} color="#319B34" style={{ flexShrink: 0 }} />
            <span style={{
                flex: 1, fontSize: 13, color: "#319B34",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                fontWeight: 500,
            }}>
                {file.name}
            </span>
            <RemoveButton onClick={onClear} style={{ color: "#9ca3af" }}>
                <X size={15} />
            </RemoveButton>
        </div>
    );

    return (
        <div
            onClick={() => inputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
                border: `2px dashed ${isDragging ? "#319B34" : "#e5e7eb"}`,
                borderRadius: 16,
                padding: "40px 16px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                cursor: "pointer",
                background: isDragging ? "rgba(49,155,52,0.04)" : "#fafafa",
                transition: "all 0.2s ease",
                marginBottom: 14,
            }}
        >
            <input
                ref={inputRef} type="file" accept=".xlsx,.xls,.csv"
                style={{ display: "none" }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }}
            />
            <div style={{
                width: 52, height: 52, borderRadius: "50%",
                background: isDragging ? "rgba(49,155,52,0.1)" : "#F3F4F6",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s ease",
            }}>
                <FileSpreadsheet size={24} color={isDragging ? "#319B34" : "#9ca3af"} />
            </div>
            <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#0D0D0D", margin: "0 0 4px" }}>
                    {isDragging ? "Suelta el archivo aquí" : "Arrastra tu archivo aquí"}
                </p>
                <p style={{ fontSize: 12, color: "gray", margin: 0 }}>
                    .xlsx, .xls o .csv
                </p>
            </div>
        </div>
    );
};

const downloadTemplate = () => {
    const link = document.createElement("a");
    link.href = "/templates/importationTemplate.xlsx";
    link.download = "plantilla-importacion.xlsx";
    link.click();
};

// ── Toggle ───────────────────────────────────────────────────────────────────
const ModeToggle = ({ mode, onChange }) => (
    <div style={{
        display: "flex",
        gap: 0,
        marginBottom: 14,
        background: "#F3F4F6",
        borderRadius: 30,
        padding: 4,
        position: "relative",
    }}>
        {/* Pill deslizante */}
        <div style={{
            position: "absolute",
            top: 4, bottom: 4,
            left: mode === "MANUAL" ? 4 : "calc(50% + 2px)",
            width: "calc(50% - 6px)",
            borderRadius: 26,
            background: mode === "MANUAL" ? "#F20C1F" : "#319B34",
            boxShadow: mode === "MANUAL"
                ? "0 2px 8px rgba(242,12,31,0.25)"
                : "0 2px 8px rgba(49,155,52,0.25)",
            transition: "left 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
        }} />

        {["MANUAL", "EXCEL"].map((m) => (
            <button key={m} onClick={() => onChange(m)} style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: 26,
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                border: "none",
                background: "transparent",
                color: mode === m ? "#fff" : "gray",
                position: "relative", // para estar encima del pill
                zIndex: 1,
                transition: "color 0.3s ease",
            }}>
                {m === "MANUAL" ? "Manual" : "Excel / CSV"}
            </button>
        ))}
    </div>
);

// ── Main page ────────────────────────────────────────────────────────────────
const Importation = () => {
    const navigate = useNavigate();

    const [code, setCode] = useState("");
    const [mode, setMode] = useState("MANUAL");

    // Manual
    const [query, setQuery] = useState("");
    const [rows, setRows] = useState([]);

    // Excel
    const [excelFile, setExcelFile] = useState(null);

    const { createManualImportation, createExcelImportation, loading, error } = useNewImportation();
    const { searchProducts, results: searchResults, searching, clearResults } = useProductSearch();

    const handleSearch = (value) => { setQuery(value); searchProducts(value); };

    const handleSelect = (product) => {
        if (!rows.some((r) => r.id === product.id)) {
            setRows((prev) => [...prev, {
                id: product.id, barcode: product.barcode,
                name: product.name, unitCost: "0", quantity: "0",
            }]);
        }
        clearResults();
        setQuery("");
    };

    const handleChange = (id, field, value) =>
        setRows((prev) => prev.map((r) => r.id === id ? { ...r, [field]: value } : r));

    const handleRemove = (id) => setRows((prev) => prev.filter((r) => r.id !== id));

    const handleModeChange = (m) => {
        setMode(m);
        setRows([]);
        setExcelFile(null);
        setQuery("");
        clearResults();
    };

    const handleSubmit = async () => {
        if (!code.trim()) return;
        if (mode === "EXCEL") {
            if (!excelFile) return;
            await createExcelImportation(code.trim(), excelFile);
        } else {
            const valid = rows.filter((r) => r.unitCost !== "" && r.quantity !== "");
            if (!valid.length) return;
            await createManualImportation(code.trim(), valid.map((r) => ({
                barcode: r.barcode,
                unitCost: Number(r.unitCost),
                quantity: Number(r.quantity),
            })));
        }
    };

    const isDisabled = loading || !code.trim() ||
        (mode === "MANUAL" ? rows.length === 0 : !excelFile);

    return (
        <Wrapper>
            <Header style={{ position: "relative" }}>
                <BackButton onClick={() => navigate(-1)}>
                    <ArrowLeft size={22} />
                </BackButton>

                <Title style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
                    Importar
                </Title>

                <SecondaryButton onClick={downloadTemplate} style={{ marginLeft: "auto" }}>
                    <FileSpreadsheet size={16} />
                </SecondaryButton>
            </Header>

            <SearchWrapper>
                <SearchInput
                    type="text"
                    placeholder="Código de importación (ej. IMP-001)"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
            </SearchWrapper>

            <ModeToggle mode={mode} onChange={handleModeChange} />

            {mode === "EXCEL" ? (
                <DropZone file={excelFile} onFile={setExcelFile} onClear={() => setExcelFile(null)} />
            ) : (
                <>
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

                    <TableWrapper>
                        <Table>
                            <Thead>
                                <tr>
                                    <th>Codigo</th>
                                    <th>Nombre</th>
                                    <th>Costo Unit.</th>
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
                                            <NumberInput type="number" value={row.unitCost} $width="72px"
                                                onChange={(e) => handleChange(row.id, "unitCost", e.target.value)}
                                                onFocus={() => { if (row.unitCost === "0") handleChange(row.id, "unitCost", "") }}
                                                onBlur={() => { if (row.unitCost === "") handleChange(row.id, "unitCost", "0") }}
                                                placeholder="0"
                                            />
                                        </td>
                                        <td>
                                            <NumberInput type="number" value={row.quantity} $width="56px"
                                                onChange={(e) => handleChange(row.id, "quantity", e.target.value)}
                                                onFocus={() => { if (row.quantity === "0") handleChange(row.id, "quantity", "") }}
                                                onBlur={() => { if (row.quantity === "") handleChange(row.id, "quantity", "0") }}
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
                </>
            )}

            <Footer>
                {error && <ErrorText>{error}</ErrorText>}
                <SubmitButton onClick={handleSubmit} disabled={isDisabled}>
                    {loading ? "Enviando..." : "Crear Importación"}
                </SubmitButton>
            </Footer>
        </Wrapper>
    );
};

export default Importation;