export const bulkUpdateProductsService = async (
  products: { id: number; purchasePrice: number; stock: number }[],
  token: string
): Promise<any> => {
  const res = await fetch(
    `${import.meta.env.VITE_API_DOMAIN}/product/bulk-update`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify({ products }),
    }
  );

  const contentType = res.headers.get("content-type");
  const data = contentType?.includes("application/json") ? await res.json() : null;

  if (!res.ok) {
    throw new Error(data?.message || "No se pudieron importar los productos");
  }

  return data;
};