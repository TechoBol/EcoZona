import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginStore } from "../components/store/loginStore";
import { bulkUpdateProductsService } from "../services/importationService";
import { successToast, errorToast } from "../services/toasts";

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

  const { token } = useLoginStore();
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

      const mapped: ImportResult[] = products.map((p) => ({
        id: p.id,
        status: "fulfilled",
      }));
      setResults(mapped);
      return mapped;

    } catch (err: any) {
      errorToast(err.message || "Error al actualizar productos");

      const failed: ImportResult[] = products.map((p) => ({
        id: p.id,
        status: "rejected",
        error: err.message,
      }));
      setResults(failed);
      return failed;

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