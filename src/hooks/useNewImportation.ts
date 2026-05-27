import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginStore } from "../components/store/loginStore";
import { successToast, errorToast } from "../services/toasts";
import {
  createImportationManualService,
  createImportationExcelService,
} from "../services/importationService";

export const useNewImportation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useLoginStore();
  const navigate = useNavigate();

  const goToImportation = () => navigate("/importation");

  const createManualImportation = async (code, products) => {
    try {
      setLoading(true);
      setError(null);
      const data = await createImportationManualService(
        { code, type: "MANUAL", products },
        token,
      );
      successToast("Importación creada correctamente");
      goToImportation();
      return data;
    } catch (err) {
      const msg = err.message || "Error al crear la importación";
      setError(msg);
      errorToast(msg);
    } finally {
      setLoading(false);
    }
  };

  const createExcelImportation = async (code, file) => {
    try {
      setLoading(true);
      setError(null);
      const data = await createImportationExcelService(
        { code, type: "EXCEL", file },
        token,
      );
      successToast("Importación creada correctamente");
      goToImportation();
      return data;
    } catch (err) {
      const msg = err.message || "Error al crear la importación";
      setError(msg);
      errorToast(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    createManualImportation,
    createExcelImportation,
    loading,
    error,
  };
};