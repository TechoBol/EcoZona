import { useEffect, useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { getProducts } from "../services/InventoryService";

interface Product {
  id: string;
  name: string;
  barcode?: string;
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

  // 🔥 Para escáner
  const [scannerBuffer, setScannerBuffer] = useState("");

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

  /* 🔍 FILTRO */
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

  /* 🔥 INPUT NORMAL */
  const onFilterTextBoxChanged = (e: any) => {
    setSearch(e.target.value);
  };

  /* 🔥 ESCÁNER GLOBAL */
  useEffect(() => {
    let timeout: any;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar teclas especiales
      if (e.key === "Shift" || e.key === "Control" || e.key === "Alt") return;

      if (e.key === "Enter") {
        if (scannerBuffer) {
          setSearch(scannerBuffer);

          // 👉 AQUÍ puedes hacer acción automática
          const found = products.find(
            (p) => p.barcode === scannerBuffer
          );

          if (found) {
            console.log("Producto escaneado:", found);

            // 🔥 OPCIONAL: aquí luego puedes hacer:
            // addToCart(found);
          }
        }

        setScannerBuffer("");
        return;
      }

      // Acumular caracteres
      setScannerBuffer((prev) => prev + e.key);

      // Resetear buffer si pasa mucho tiempo (para evitar mezcla)
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setScannerBuffer("");
      }, 100);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [scannerBuffer, products]);

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