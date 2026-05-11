export const getKardexService = async (
  data: any,
  token: string,
) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_DOMAIN}/product/kardex-pro`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify(data),
    },
  );

  const resData = await response.json();

  if (!response.ok) {
    throw new Error(
      resData.message || "No se pudo obtener el kardex",
    );
  }

  return resData;
};