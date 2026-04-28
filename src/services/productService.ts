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
    throw new Error(resData.message || "Error creating product");
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
    throw new Error(resData.message || "Error acutalizar producto");
  }

  return resData;
};
