const API = import.meta.env.VITE_API_DOMAIN;

export const getLinesService = async (token: string) => {
  const res = await fetch(`${API}/line/get-lines`, {
    method: "GET",
    headers: { "x-access-token": token },
  });
  return res.json();
};

export const createLineService = async (data: any, token: string) => {
  const res = await fetch(`${API}/line/create-line`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateLineService = async (id: number, data: any, token: string) => {
  const res = await fetch(`${API}/line/update-line/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteLineService = async (id: number, token: string) => {
  await fetch(`${API}/line/delete-line/${id}`, {
    method: "DELETE",
    headers: { "x-access-token": token },
  });
};

export const addBrandService = async (lineId: number, name: string, token: string) => {
  const res = await fetch(`${API}/line/add-brand/${lineId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({ name }),
  });
  return res.json();
};

export const updateBrandService = async (
  lineId: number,
  oldName: string,
  newName: string,
  token: string
) => {
  const res = await fetch(`${API}/line/update-brand/${lineId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({ oldName, newName }),
  });
  return res.json();
};

export const deleteBrandService = async (lineId: number, name: string, token: string) => {
  const res = await fetch(`${API}/line/delete-brand/${lineId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({ name }),
  });
  return res.json();
};