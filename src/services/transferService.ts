const API = import.meta.env.VITE_API_DOMAIN;

export const createTransferService = async (data: any, token: string) => {
  const res = await fetch(`${API}/transfer/create-transfer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify(data),
  });

  const resData = await res.json();

  if (!res.ok) {
    throw new Error(resData.message || "Error creando transferencia");
  }

  return resData;
};

export const getMyTransfersService = async (token: string) => {
  const res = await fetch(`${API}/transfer/my-transfers`, {
    headers: {
      "x-access-token": token,
    },
  });

  const resData = await res.json();

  if (!res.ok) {
    throw new Error(resData.message || "Error obteniendo transferencias");
  }

  return resData;
};

export const approveTransferService = async (
  id: number,
  fromLocationId: number,
  token: string
) => {
  const res = await fetch(`${API}/transfer/transfer-approve/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify({ fromLocationId }),
  });

  const resData = await res.json();

  if (!res.ok) {
    throw new Error(resData.message || "Error aprobando transferencia");
  }

  return resData;
};

export const rejectTransferService = async (
  id: number,
  token: string
) => {
  const res = await fetch(`${API}/transfer/transfer-reject/${id}`, {
    method: "PUT",
    headers: {
      "x-access-token": token,
    },
  });

  const resData = await res.json();

  if (!res.ok) {
    throw new Error(resData.message || "Error rechazando transferencia");
  }

  return resData;
};