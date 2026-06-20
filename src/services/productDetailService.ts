export const getProductDetailService = async (id: number, token: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_DOMAIN}/productDetail/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    },
  );

  const resData = await response.json();

  if (!response.ok) {
    throw new Error(resData.message || "No se pudo cargar el producto");
  }

  return resData;
};