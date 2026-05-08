const API = import.meta.env.VITE_API_DOMAIN;

export const getSalesService = async (token: string) => {
  const res = await fetch(`${API}/sale/get-sales`, {
    headers: {
      "x-access-token": token,
    },
  });
  return res.json();
};

export const updateSaleService = async (token: string, id: number, typeSale: string) => {
  const res = await fetch(`${API}/sale/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({ typeSale }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al actualizar");
  return data;
};

export const updateDateSaleService = async (token: string, id: number, date: string) => {
  const res = await fetch(`${API}/sale/date/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({ date }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al actualizar fecha");
  return data;
};