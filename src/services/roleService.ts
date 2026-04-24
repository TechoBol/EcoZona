const API = import.meta.env.VITE_API_DOMAIN;

export const getRolesService = async (token: string) => {
  const res = await fetch(`${API}/role/get-roles`, {
    method: "GET",
    headers: { "x-access-token": token },
  });
  return res.json();
};

export const createRoleService = async (data: any, token: string) => {
  const res = await fetch(`${API}/role/create-role`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateRoleService = async (
  id: number,
  data: any,
  token: string,
) => {
  const res = await fetch(`${API}/role/update-role/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteRoleService = async (id: number, token: string) => {
  await fetch(`${API}/role/delete-role/${id}`, {
    method: "DELETE",
    headers: { "x-access-token": token },
  });
};
