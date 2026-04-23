import { useEffect, useState } from "react";
import { getProducts } from "../services/InventoryService";

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

  /*Cargar productos */
  const fetchProducts = async () => {
    setIsLoading(true);

    const data = await getProducts();

    setProducts(data);
    setFilteredProducts(data);

    setIsLoading(false);
  };

  /*Filtro de búsqueda */
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

  /*carga inicial */
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