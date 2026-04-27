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

  if (!response.ok) {
    throw new Error("Error creating product");
  }

  return response.json();
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

  if (!res.ok) throw new Error("Error actualizando producto");

  return res.json();
};
