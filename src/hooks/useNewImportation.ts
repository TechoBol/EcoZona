import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginStore } from "../components/store/loginStore";
import { successToast, errorToast } from "../services/toasts";
import {
  createImportationManualService,
  createImportationExcelService,
} from "../services/importationService";
import socket from "../services/SocketIOConnection";
export const useNewImportation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useLoginStore();
  const navigate = useNavigate();

  const goToImportation = (newImportation: any) =>
    navigate("/importation", { state: { newImportation } });

  const createManualImportation = async (code: any, products: any) => {
    try {
      setLoading(true);
      setError(null);
      const data = await createImportationManualService(
        { code, type: "MANUAL", products },
        token,
      );
      socket.emit("newImportation", data);
      socket.emit("createProduct", data);
      successToast("Importación creada correctamente");
      goToImportation(data);
      return data;
    } catch (err) {
      const msg = err.message || "Error al crear la importación";
      setError(msg);
      errorToast(msg);
    } finally {
      setLoading(false);
    }
  };

  const createExcelImportation = async (code: any, file: any) => {
    try {
      setLoading(true);
      setError(null);
      const data = await createImportationExcelService(
        { code, type: "EXCEL", file },
        token,
      );
      socket.emit("newImportation", data);
      socket.emit("createProduct", data);
      successToast("Importación creada correctamente");
      goToImportation(data);
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