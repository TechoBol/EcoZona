const API = import.meta.env.VITE_API_DOMAIN;

export const getSalesService = async (token: string) => {
  const res = await fetch(`${API}/sale/get-sales`, {
    headers: {
      "x-access-token": token,
    },
  });

  return res.json();
};