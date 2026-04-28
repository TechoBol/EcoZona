import { useEffect, useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { getProducts } from "../services/InventoryService";
import socket from "../services/SocketIOConnection";
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

  // ESCANNER
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

  /* FILTRO */
  useEffect(() => {
    if (!search) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(
      (product) =>
        (product.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (product.barcode || "").toLowerCase().includes(search.toLowerCase()),
    );

    setFilteredProducts(filtered);
  }, [search, products]);

  /* INPUT NORMAL */
  const onFilterTextBoxChanged = (e: any) => {
    setSearch(e.target.value);
  };

  /* ESCÁNER GLOBAL */
  useEffect(() => {
    let timeout: any;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift" || e.key === "Control" || e.key === "Alt") return;

      if (e.key === "Enter") {
        if (scannerBuffer) {
          setSearch(scannerBuffer);
          const found = products.find((p) => p.barcode === scannerBuffer);

          if (found) {
            console.log("Producto escaneado:", found);
          }
        }

        setScannerBuffer("");
        return;
      }
      setScannerBuffer((prev) => prev + e.key);
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

  useEffect(() => {
    socket.on("newProduct", (producto) => {
      setProducts((prev) => {
        const exists = prev.some((p) => p.id === producto.id);
        if (exists)
          return prev.map((p) => (p.id === producto.id ? producto : p));
        return [...prev, producto];
      });
    });

    socket.on("cartProduct", () => {
      fetchProducts();
    });

    return () => {
      socket.off("newProduct");
      socket.off("cartProduct");
    };
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
