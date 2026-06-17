import { useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { useNavigate } from "react-router-dom";
import { getInventoryValoradoService } from "../services/productService";
import { generarInventarioValoradoPDF } from "../components/pdf/generarInventarioValoradoPDF.jsx";

export const useInventoryValorado = () => {
  const { token } = useLoginStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const goToInventoryValorado = () => navigate("/inventory-valorado");

  const generarInventarioValorado = async (payload: any) => {
    setLoading(true);
    setError("");

    try {
      const inventory = await getInventoryValoradoService(payload, token);

      generarInventarioValoradoPDF({
        data: inventory,

        sucursal: payload.locationName || "TODAS",

        linea: payload.lineName || "TODAS",

        marca: payload.brand || "TODAS",

        producto: payload.productName || "TODOS",
      });
    } catch (err: any) {
      console.error(err);

      setError(err.message || "Error al generar inventario valorado");
    } finally {
      setLoading(false);
    }
  };

  return {
    generarInventarioValorado,
    goToInventoryValorado,
    loading,
    error,
  };
};
