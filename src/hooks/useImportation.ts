import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginStore } from "../components/store/loginStore";
import { bulkUpdateProductsService } from "../services/importationService";

interface ImportProduct {
  id: number;
  purchasePrice: number;
  stock: number;
}

interface ImportResult {
  id: number;
  status: "fulfilled" | "rejected";
  error?: string;
}

export const useImportation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ImportResult[]>([]);

  const { token, location } = useLoginStore();
  const navigate = useNavigate();

  const goToImportation = () => navigate("/importation");

  const bulkUpdateProducts = async (products: ImportProduct[]) => {
    try {
      setLoading(true);
      setError(null);
      setResults([]);

      const payload = products.map((p) => ({
        id: p.id,
        purchasePrice: p.purchasePrice,
        stock: p.stock,
      }));

      const data = await bulkUpdateProductsService(payload, token);
      return data;

    } catch (err: any) {
      setError(err.message || "Error en la importación");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    bulkUpdateProducts,
    loading,
    error,
    results,
    goToImportation,
  };
};