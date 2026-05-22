import { useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { getProducts } from "../services/InventoryService";

export const useProductSearch = () => {
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const { token } = useLoginStore();

  const searchProducts = async (query: string) => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    try {
      setSearching(true);
      const all = await getProducts(token);
      const q = query.toLowerCase();
      const filtered = all.filter(
        (p: any) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.barcode || "").toLowerCase().includes(q)
      );
      setResults(filtered);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const clearResults = () => setResults([]);

  return { searchProducts, results, searching, clearResults };
};