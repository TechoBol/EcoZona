const API = import.meta.env.VITE_API_DOMAIN;
const BASE = `${API}/importation`;

// GET /importation/get-importations
export const getImportationsService = async (token: string) => {
  const res = await fetch(`${BASE}/get-importations`, {
    headers: { "x-access-token": token },
  });
  return res.json();
};

// GET /importation/get-importation/:id
export const getImportationByIdService = async (id: number, token: string) => {
  const res = await fetch(`${BASE}/get-importation/${id}`, {
    headers: { "x-access-token": token },
  });
  return res.json();
};

// ─────────────────────────────────────────────
// CREATE — queda en DRAFT
// ─────────────────────────────────────────────

export const createImportationManualService = async (
  dto: { code: string; products: any[]; locationId: number },
  token: string,
) => {
  const formData = new FormData();
  formData.append("code", dto.code);
  formData.append("type", "MANUAL");
  formData.append("products", JSON.stringify(dto.products));
  formData.append("locationId", String(dto.locationId));

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
export const createImportationExcelService = async (
  dto: { code: string; file: File; locationId: number },
  token: string,
) => {
  const formData = new FormData();
  formData.append("code", dto.code);
  formData.append("type", "EXCEL");
  formData.append("file", dto.file);
   formData.append("locationId", String(dto.locationId));

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

// ─────────────────────────────────────────────
// UPDATE — solo DRAFT
// ─────────────────────────────────────────────

export const updateImportationManualService = async (
  id: number,
  dto: { products: any[] },
  token: string,
) => {
  const formData = new FormData();
  formData.append("type", "MANUAL");
  formData.append("products", JSON.stringify(dto.products));

  const res = await fetch(`${BASE}/update-importation/${id}`, {
    method: "PUT",
    headers: { "x-access-token": token },
    body: formData,
  });

  const data = res.headers.get("content-type")?.includes("application/json")
    ? await res.json()
    : null;

  if (!res.ok) throw new Error(data?.message || "No se pudo actualizar la importación");
  return data;
};

export const updateImportationExcelService = async (
  id: number,
  dto: { file: File },
  token: string,
) => {
  const formData = new FormData();
  formData.append("type", "EXCEL");
  formData.append("file", dto.file);

  const res = await fetch(`${BASE}/update-importation/${id}`, {
    method: "PUT",
    headers: { "x-access-token": token },
    body: formData,
  });

  const data = res.headers.get("content-type")?.includes("application/json")
    ? await res.json()
    : null;

  if (!res.ok) throw new Error(data?.message || "No se pudo actualizar la importación");
  return data;
};

// ─────────────────────────────────────────────
// CAMBIAR ESTADO — APPROVED | CANCELLED
// ─────────────────────────────────────────────

export const changeImportationStatusService = async (
  id: number,
  status: "APPROVED" | "CANCELLED",
  token: string,
) => {
  const res = await fetch(`${BASE}/importation/${id}/status`, {
    method: "PATCH",
    headers: {
      "x-access-token": token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  const data = res.headers.get("content-type")?.includes("application/json")
    ? await res.json()
    : null;

  if (!res.ok) throw new Error(data?.message || "No se pudo cambiar el estado");
  return data;
};