const API = import.meta.env.VITE_API_DOMAIN;

export const getEmployeesService = async (token: string) => {
  const res = await fetch(`${API}/employee/get-employees`, {
    method: "GET",
    headers: {
      "x-access-token": token,
    },
  });

  if (!res.ok) throw new Error("Error getting employees");
  return res.json();
};

export const createEmployeeService = async (data: any, token: string) => {
  const res = await fetch(`${API}/employee/create-employee`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error creating employee");
  return res.json();
};

export const updateEmployeeService = async (
  id: number,
  data: any,
  token: string
) => {
  const res = await fetch(`${API}/employee/update-employee/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error updating employee");
  return res.json();
};

export const deleteEmployeeService = async (id: number, token: string) => {
  const res = await fetch(`${API}/employee/delete-employee/${id}`, {
    method: "DELETE",
    headers: {
      "x-access-token": token,
    },
  });

  if (!res.ok) throw new Error("Error deleting employee");
  return res.json();
};