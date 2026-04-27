
export const createSaleService = async (data: any, token: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_DOMAIN}/sale/create-sale`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error("Error creating product");
  }

  return response.json();
};
