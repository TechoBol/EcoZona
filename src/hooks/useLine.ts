import { useEffect, useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { getLinesService, createLineService, updateLineService, deleteLineService} from "../services/lineService";
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
      successToast("Línea creada exitosamente");
      return newLine;
    } catch (error) {
      errorToast("Error al crear la línea");
    } finally {
      setIsLoading(false);
    }
  };

  const updateLine = async (id: number, data: any) => {
    setIsLoading(true);
    try {
      const updatedLine = await updateLineService(id, data, token);
      getLines();
      successToast("Línea actualizada");
      return updatedLine;
    } catch (error) {
      errorToast("Error al actualizar la línea");
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
      successToast("Línea eliminada");
    } catch (error) {
      errorToast("Error al eliminar la línea");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    socket.on("lineUpdated", (line) => {
      setLines((prev) => {
        const exists = prev.some((l) => l.id === line.id);
        if (exists) {
          return prev.map((l) => l.id === line.id ? line : l);
        }
        return [...prev, line];
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
    goToLines,
    isLoading,
  };
};