import { useEffect, useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { getProducts } from "../services/InventoryService";
import socket from "../services/SocketIOConnection";
import { useInventoryStore } from "../components/store/inventoryStore";

const useInventory = () => {
  const { token } = useLoginStore();

  // GLOBAL STORE
  const { products, setProducts } = useInventoryStore();

  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ESCANNER
  const [scannerBuffer, setScannerBuffer] = useState("");

  //////////////////////////////
  // FETCH
  //////////////////////////////
  const fetchProducts = async () => {
    setIsLoading(true);

    try {
      const data = await getProducts(token);
      setProducts(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //////////////////////////////
  // FILTRO
  //////////////////////////////
  useEffect(() => {
    if (!search) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(
      (product: any) =>
        (product.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (product.barcode || "").toLowerCase().includes(search.toLowerCase())
    );

    setFilteredProducts(filtered);
  }, [search, products]);

  //////////////////////////////
  // INPUT
  //////////////////////////////
  const onFilterTextBoxChanged = (e: any) => {
    setSearch(e.target.value);
  };

  //////////////////////////////
  // SCANNER GLOBAL
  //////////////////////////////
  useEffect(() => {
    let timeout: any;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift" || e.key === "Control" || e.key === "Alt") return;

      if (e.key === "Enter") {
        if (scannerBuffer) {
          setSearch(scannerBuffer);

          const found = products.find(
            (p: any) => p.barcode === scannerBuffer
          );

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

  //////////////////////////////
  // 🚀 INIT
  //////////////////////////////
  useEffect(() => {
    if (!products.length) {
      fetchProducts();
    }
  }, []);

  //////////////////////////////
  // 🔌 SOCKET
  //////////////////////////////
  useEffect(() => {
    socket.on("newProduct", (producto) => {
      fetchProducts();
    });

    socket.on("cartProduct", () => {
      fetchProducts();
    });

    return () => {
      socket.off("newProduct");
      socket.off("cartProduct");
    };
  }, []);

  //////////////////////////////
  // RETURN
  //////////////////////////////
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