import { useEffect, useState, useCallback } from "react";
import useSWR from "swr";
import { useLoginStore } from "../components/store/loginStore";
import { getProducts } from "../services/InventoryService";
import socket from "../services/SocketIOConnection";
import { useInventoryStore } from "../components/store/inventoryStore";
import { notificationToast } from "../services/toasts";
import { useNavigate } from "react-router-dom";
import { createPublicInventoryLinkService } from "../services/employeeService";

const fetcher = ([_, token]: [string, string]) => getProducts(token);

const FRONT_URL = import.meta.env.VITE_FRONT_URL;

const useInventory = () => {
  const { token } = useLoginStore();
  const { setProducts } = useInventoryStore();
  const navigate = useNavigate();

  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [scannerBuffer, setScannerBuffer] = useState("");

  //////////////////////////////
  // SWR
  //////////////////////////////
  const {
    data: products = [],
    isLoading,
    mutate,
  } = useSWR(
    token ? ["products", token] : null, // null = no fetches si no hay token
    fetcher,
    {
      revalidateOnFocus: false, // No refetch al cambiar de pestaña
      dedupingInterval: 5000, // Evita requests duplicados en 5s
      onSuccess: (data) => {
        setProducts(data); // Sincroniza tu store global igual que antes
      },
    },
  );

  const handleShare = async () => {
    try {
      const response = await createPublicInventoryLinkService(token);

      const shareUrl = `${FRONT_URL}/inventory/${response.token}`;
      console.log(shareUrl);
      await navigator.clipboard.writeText(shareUrl);

      notificationToast("Enlace copiado al portapapeles");
    } catch (error) {
      console.error(error);
      notificationToast("Error al generar el enlace");
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
        (product.barcode || "").toLowerCase().includes(search.toLowerCase()),
    );

    setFilteredProducts(filtered);
  }, [search, products]);

  //////////////////////////////
  // INPUT
  //////////////////////////////
  const onFilterTextBoxChanged = (e: any) => {
    setSearch(e.target.value);
  };

  const goToInventory = () => navigate("/inventory");
  const goToMargin = () => navigate("/margin-profit");

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
          const found = products.find((p: any) => p.barcode === scannerBuffer);
          if (found) console.log("Producto escaneado:", found);
        }
        setScannerBuffer("");
        return;
      }

      setScannerBuffer((prev) => prev + e.key);
      clearTimeout(timeout);
      timeout = setTimeout(() => setScannerBuffer(""), 100);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scannerBuffer, products]);

  //////////////////////////////
  // SOCKET — usa mutate en vez de fetchProducts
  //////////////////////////////
  useEffect(() => {
    const handleRefresh = () => mutate();

    const handleTransfer = (mensaje: string) => {
      notificationToast(mensaje);
      mutate();
    };

    socket.on("newProduct", handleRefresh);
    socket.on("cartProduct", handleRefresh);
    socket.on("transfer", handleTransfer);
    socket.on("updateProductMargin", (updatedProduct) => {
      mutate()
    });
    return () => {
      socket.off("newProduct", handleRefresh);
      socket.off("cartProduct", handleRefresh);
      socket.off("transfer", handleTransfer);
      socket.off("updateProductMargin");
    };
  }, [mutate]);

  return {
    products: filteredProducts,
    search,
    setSearch,
    isLoading,
    onFilterTextBoxChanged,
    refresh: mutate,
    goToInventory,
    goToMargin,
    handleShare,
  };
};

export default useInventory;
