import { errorToast } from "../services/toasts";

export const getProducts = async (token?: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/product/get-products`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      }
    );

    if (!response.ok) {
      errorToast("Error al obtener productos");
      return [];
    }

    const data = await response.json();
    return data || [];

  } catch (error) {
    console.error("Error:", error);
    errorToast("Error de conexión");
    return [];
  }
};