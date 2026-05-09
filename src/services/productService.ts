import { Product } from "../components/models/Product";

export const createProductService = async (data: Product, token: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_DOMAIN}/product/create-product`,
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
    throw new Error(resData.message || "No se pudo crear el producto");
  }

  return resData;
};

export const updateProductService = async (id: any, data: any, token: any) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_DOMAIN}/product/update-product/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify(data),
    },
  );

 const resData = await res.json(); 

  if (!res.ok) {
    throw new Error(resData.message || "No se pudo actualizar el producto");
  }

  return resData;
};

export const getKardexService = async (data: any, token: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_DOMAIN}/product/kardex`,
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
    throw new Error(resData.message || "No se pudo generar el kardex");
  }

  return resData;
};