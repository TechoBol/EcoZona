import { useEffect, useState } from "react";
import { errorToast } from "../services/toasts";

interface Product {
  id: string;
  name: string;
  code: string;
  price: number;
  stock: number;
  image?: string;
}

const useInventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /* 🔥 Obtener productos */
  const fetchProducts = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_DOMAIN}/products`
      );

      if (!response.ok) {
        errorToast("Error al obtener productos");
        return;
      }

      const data = await response.json();

      setProducts(data);
      setFilteredProducts(data);

    } catch (error) {
      console.error("Error:", error);
      errorToast("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  /* 🔎 Filtrado por búsqueda */
  useEffect(() => {
    if (!search) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.code.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredProducts(filtered);
  }, [search, products]);

  /* 🚀 Inicial */
  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products: filteredProducts,
    search,
    setSearch,
    isLoading,
    refresh: fetchProducts
  };
};

export default useInventory;