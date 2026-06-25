import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginStore } from "../components/store/loginStore";
import { successToast, errorToast } from "../services/toasts";
import {
  createImportationManualService,
  createImportationExcelService,
  updateImportationManualService,
  updateImportationExcelService,
} from "../services/importationService";
import socket from "../services/SocketIOConnection";

export const useNewImportation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token } = useLoginStore();
  const navigate = useNavigate();

  const goToImportation = (newImportation: any) =>
    navigate("/importation", { state: { newImportation } });

  // ─────────────────────────────────────────────
  // CREAR — queda en DRAFT, no toca inventario
  // ─────────────────────────────────────────────

  const createManualImportation = async (code: string, products: any[]) => {
    try {
      setLoading(true);
      setError(null);
      const data = await createImportationManualService({ code, products }, token);
      socket.emit("newImportation", data);
      successToast("Importación guardada como borrador");
      goToImportation(data);
      return data;
    } catch (err: any) {
      const msg = err.message || "Error al crear la importación";
      setError(msg);
      errorToast(msg);
    } finally {
      setLoading(false);
    }
  };

  const createExcelImportation = async (code: string, file: File) => {
    try {
      setLoading(true);
      setError(null);
      const data = await createImportationExcelService({ code, file }, token);
      socket.emit("newImportation", data);
      successToast("Importación guardada como borrador");
      goToImportation(data);
      return data;
    } catch (err: any) {
      const msg = err.message || "Error al crear la importación";
      setError(msg);
      errorToast(msg);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // EDITAR — solo si está en DRAFT
  // ─────────────────────────────────────────────

  const updateManualImportation = async (id: number, products: any[]) => {
    try {
      setLoading(true);
      setError(null);
      const data = await updateImportationManualService(id, { products }, token);
      successToast("Importación actualizada");
      goToImportation(data);
      return data;
    } catch (err: any) {
      const msg = err.message || "Error al actualizar la importación";
      setError(msg);
      errorToast(msg);
    } finally {
      setLoading(false);
    }
  };

  const updateExcelImportation = async (id: number, file: File) => {
    try {
      setLoading(true);
      setError(null);
      const data = await updateImportationExcelService(id, { file }, token);
      successToast("Importación actualizada");
      goToImportation(data);
      return data;
    } catch (err: any) {
      const msg = err.message || "Error al actualizar la importación";
      setError(msg);
      errorToast(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    createManualImportation,
    createExcelImportation,
    updateManualImportation,
    updateExcelImportation,
    loading,
    error,
  };
};