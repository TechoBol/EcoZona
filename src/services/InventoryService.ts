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
      errorToast("Iniciar sesion de nuevo");
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

export const getPublicProducts = async (token?: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/product/get-public-products`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      }
    );

    if (!response.ok) {
      errorToast("Iniciar sesion de nuevo");
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

export const inventoryCrossService = async (
  payload: {
    originProductCode: number;
    destinationProductCode: number;
    quantity: number;
    locationId: number;
    observacion : string;
  },
  token?: string
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/product/cross-inventory`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token || "",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message || "Error al realizar el cruce"
      );
    }

    return data;
  } catch (error: any) {
    throw new Error(
      error?.message || "Error de conexión"
    );
  }
};

export const getInventoryCrossesService =
  async (token: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/product/inventory-cross`,
      {
        method: "GET",
        headers: {
          "Content-Type":
            "application/json",
          "x-access-token": token,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "Error obteniendo cruces"
      );
    }

    return response.json();
  };