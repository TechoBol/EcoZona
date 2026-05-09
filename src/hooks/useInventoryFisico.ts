import {  useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { useNavigate } from "react-router-dom";
import { getKardexService } from "../services/productService.js";
import {generarKardexPDF} from "../components/pdf/generarKardexPDF"
export const useInventoryFisico = () => {
  const { token } = useLoginStore();
  const [inventoryFisico, setInventoryFisico] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")
  const navigate = useNavigate();

  const goToInventoryFisico = () => navigate("/inventory-fisico-valorado");

  const generarKardex = async (payload: any) => {
    setLoading(true);
    setError("");

    try {
      const kardex = await getKardexService(payload, token);
      generarKardexPDF({
        data: kardex,
        producto: payload.producto,
        desde: payload.fromDate,
        hasta: payload.toDate,
        sucursal: payload.locationName,
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al generar kardex");
    } finally {
      setLoading(false);
    }
  };

  return {
    inventoryFisico,
    generarKardex,
    goToInventoryFisico,
    loading,
  };
};