const API = import.meta.env.VITE_API_DOMAIN;

export const getRolesService = async (token: string) => {
  const res = await fetch(`${API}/role/get-roles`, {
    method: "GET",
    headers: {
      "x-access-token": token,
    },
  });

  if (!res.ok) throw new Error("Error getting roles");

  return res.json();
};