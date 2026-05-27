const API = import.meta.env.VITE_API_DOMAIN;
const BASE = `${API}/importation`;

// GET /importation/get-importations
export const getImportationsService = async (token) => {
  const res = await fetch(`${BASE}/get-importations`, {
    headers: { "x-access-token": token },
  });
  return res.json();
};

// GET /importation/get-importation/:id
export const getImportationByIdService = async (id, token) => {
  const res = await fetch(`${BASE}/get-importation/${id}`, {
    headers: { "x-access-token": token },
  });
  return res.json();
};

// POST /importation/create-importation (MANUAL)
export const createImportationManualService = async (dto, token) => {
  const formData = new FormData();
  formData.append("code", dto.code);
  formData.append("type", "MANUAL");
  formData.append("products", JSON.stringify(dto.products));

  const res = await fetch(`${BASE}/create-importation`, {
    method: "POST",
    headers: { "x-access-token": token },
    body: formData,
  });

  const data = res.headers.get("content-type")?.includes("application/json")
    ? await res.json()
    : null;

  if (!res.ok) throw new Error(data?.message || "No se pudo crear la importación");
  return data;
};

// POST /importation/create-importation (EXCEL)
export const createImportationExcelService = async (dto, token) => {
  const formData = new FormData();
  formData.append("code", dto.code);
  formData.append("type", "EXCEL");
  formData.append("file", dto.file);

  const res = await fetch(`${BASE}/create-importation`, {
    method: "POST",
    headers: { "x-access-token": token },
    body: formData,
  });

  const data = res.headers.get("content-type")?.includes("application/json")
    ? await res.json()
    : null;

  if (!res.ok) throw new Error(data?.message || "No se pudo crear la importación");
  return data;
};