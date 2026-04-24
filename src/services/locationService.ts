export const getLocationsService = async (token: string) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_DOMAIN}/location/get-location`,
    {
      method: "GET",
      headers: { "x-access-token": token },
    },
  );

  return res.json();
};

export const createLocationService = async (data: any, token: string) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_DOMAIN}/location/create-location`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify(data),
    },
  );

  return res.json();
};

export const deleteLocationService = async (id: number, token: string) => {
  await fetch(
    `${import.meta.env.VITE_API_DOMAIN}/location/delete-location/${id}`,
    {
      method: "DELETE",
      headers: { "x-access-token": token },
    },
  );
};
export const updateLocationService = async (id: any, data: any, token: any) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_DOMAIN}/location/update-location/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Error updating location");
  }

  return response.json();
};