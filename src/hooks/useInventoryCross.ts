import { useEffect, useState } from "react";
import { useLoginStore } from "../components/store/loginStore";

import socket from "../services/SocketIOConnection";

import { successToast, errorToast } from "../services/toasts";
import { useNavigate } from "react-router-dom";

import {
  inventoryCrossService,
  getInventoryCrossesService,
} from "../services/InventoryService";
import { generarPDFCruce } from "../components/pdf/generarPDFCruce.jsx";
import { useAmazonS3 } from "./useAmazonS3";

export const useInventoryCross = () => {
  const { token } = useLoginStore();
  const { uploadPDFCruce } = useAmazonS3();

  const [loading, setLoading] = useState(false);

  const [crosses, setCrosses] = useState<any[]>([]);
  const navigate = useNavigate();

  /////////////////////////////////////////////////////
  // OBTENER
  /////////////////////////////////////////////////////
  const goToCrosses = () => navigate("/cross-inventory");

  const getCrosses = async () => {
    try {
      const response = await getInventoryCrossesService(token);

      setCrosses(response);
    } catch (error) {
      console.error(error);
    }
  };

  /////////////////////////////////////////////////////
  // CREAR
  /////////////////////////////////////////////////////

  const createCross = async (payload: {
    originProductCode: number;
    destinationProductCode: number;
    quantity: number;
    locationId: number;
    observacion: string;
    originStockBefore: number;
    destinationStockBefore: number;
  }) => {
    try {
      setLoading(true);
      const { originStockBefore, destinationStockBefore, ...servicePayload } =
        payload;

      const response = await inventoryCrossService(servicePayload, token);

      setCrosses((prev: any[]) => [response, ...prev]);

      const pdfBlob = generarPDFCruce({
        ...response,
        originStockBefore,
        destinationStockBefore,
      });

      const file = new File([pdfBlob], `ajuste_${response.code}.pdf`, {
        type: "application/pdf",
      });

      const pdfKey = await uploadPDFCruce(file, response.code);

      successToast("Ajuste de inventario realizado");
      return response;
    } catch (error: any) {
      errorToast(error.message || "Error al realizar el cruce");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /////////////////////////////////////////////////////
  // SOCKETS
  /////////////////////////////////////////////////////

  useEffect(() => {
    socket.on("newProduct", (cross) => {
      setCrosses((prev: any) => {
        const exists = prev.some((c: any) => c.id === cross.id);

        if (exists) {
          return prev.map((c: any) => (c.id === cross.id ? cross : c));
        }

        return [cross, ...prev];
      });
    });

    return () => {
      socket.off("newProduct");
    };
  }, []);

  /////////////////////////////////////////////////////
  // INIT
  /////////////////////////////////////////////////////

  useEffect(() => {
    getCrosses();
  }, []);

  return {
    goToCrosses,
    crosses,
    createCross,
    getCrosses,
    loading,
  };
};
