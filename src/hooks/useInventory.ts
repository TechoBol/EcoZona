import { useEffect, useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { getProducts } from "../services/InventoryService";

interface Product {
  id: string;
  name: string;
  barcode?: string; // 🔥 CORRECTO (no code)
  price: number;
  stock?: number;
  image?: string;
}

const useInventory = () => {
  const { token } = useLoginStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);

    try {
      const data = await getProducts(token);
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /* 🔍 FILTRO CORREGIDO */
  useEffect(() => {
    if (!search) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter((product) =>
      (product.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (product.barcode || "").toLowerCase().includes(search.toLowerCase())
    );

    setFilteredProducts(filtered);
  }, [search, products]);

  /* 🔥 ESTA ES LA FUNCIÓN QUE TE FALTABA USAR */
  const onFilterTextBoxChanged = (e: any) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products: filteredProducts,
    search,
    setSearch,
    isLoading,
    onFilterTextBoxChanged,
    refresh: fetchProducts,
  };
};

export default useInventory;