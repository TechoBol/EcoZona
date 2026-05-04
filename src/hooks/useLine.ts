import { useEffect, useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import {
  getLinesService,
  createLineService,
  updateLineService,
  deleteLineService,
  addBrandService,
  updateBrandService,
  deleteBrandService,
} from "../services/lineService";
import { useNavigate } from "react-router-dom";
import socket from "../services/SocketIOConnection";
import { successToast, errorToast } from "../services/toasts";

export const useLines = () => {
  const { token } = useLoginStore();
  const [lines, setLines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const goToLines = () => navigate("/lines");

  const getLines = async () => {
    const res = await getLinesService(token);
    setLines(res);
  };

  const createLine = async (data: any) => {
    setIsLoading(true);
    try {
      const newLine = await createLineService(data, token);
      setLines((prev) => [...prev, newLine]);
      getLines();
      successToast("marca creada exitosamente");
      return newLine;
    } catch {
      errorToast("Error al crear la marca");
    } finally {
      setIsLoading(false);
    }
  };

  const updateLine = async (id: number, data: any) => {
    setIsLoading(true);
    try {
      const updatedLine = await updateLineService(id, data, token);
      getLines();
      successToast("marca actualizada");
      return updatedLine;
    } catch {
      errorToast("Error al actualizar la marca");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLine = async (id: number) => {
    setIsLoading(true);
    try {
      await deleteLineService(id, token);
      socket.emit("deleteLine", id);
      getLines();
      successToast("marca eliminada");
    } catch {
      errorToast("Error al eliminar la marca");
    } finally {
      setIsLoading(false);
    }
  };

  const addBrand = async (lineId: number, name: string) => {
    setIsLoading(true);
    try {
      const updated = await addBrandService(lineId, name, token);
      if (updated?.message) throw new Error(updated.message);
      setLines((prev) => prev.map((l) => (l.id === lineId ? updated : l)));
      successToast("línea agregada");
      return updated;
    } catch (error: any) {
      errorToast(error.message || "Error al agregar la línea");
    } finally {
      setIsLoading(false);
    }
  };

  const updateBrand = async (lineId: number, oldName: string, newName: string) => {
    setIsLoading(true);
    try {
      const updated = await updateBrandService(lineId, oldName, newName, token);
      if (updated?.message) throw new Error(updated.message);
      setLines((prev) => prev.map((l) => (l.id === lineId ? updated : l)));
      successToast("línea actualizada");
      return updated;
    } catch (error: any) {
      errorToast(error.message || "Error al actualizar la línea");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBrand = async (lineId: number, name: string) => {
    setIsLoading(true);
    try {
      const updated = await deleteBrandService(lineId, name, token);
      if (updated?.message) throw new Error(updated.message);
      setLines((prev) => prev.map((l) => (l.id === lineId ? updated : l)));
      successToast("línea eliminada");
      return updated;
    } catch (error: any) {
      errorToast(error.message || "Error al eliminar la línea");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    socket.on("lineUpdated", (line) => {
      setLines((prev) => {
        const exists = prev.some((l) => l.id === line.id);
        return exists
          ? prev.map((l) => (l.id === line.id ? line : l))
          : [...prev, line];
      });
    });

    socket.on("lineRemoved", (lineId) => {
      setLines((prev) => prev.filter((l) => l.id !== lineId));
    });

    return () => {
      socket.off("lineUpdated");
      socket.off("lineRemoved");
    };
  }, []);

  useEffect(() => {
    getLines();
  }, []);

  return {
    lines,
    createLine,
    updateLine,
    deleteLine,
    addBrand,
    updateBrand,
    deleteBrand,
    goToLines,
    isLoading,
  };
};