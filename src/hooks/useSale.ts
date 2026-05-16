import { useEffect, useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { cancelSaleService, getSalesService } from "../services/saleService";
import { useNavigate } from "react-router-dom";
import socket from "../services/SocketIOConnection";

export const useSales = () => {
  const { token } = useLoginStore();
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const goToSales = () => {
    navigate("/reports");
  };

  const getSales = async () => {
    const res = await getSalesService(token);
    setData(res);
  };

  useEffect(() => {
    socket.on("cartProduct", () => {
      getSales();
    });

    return () => {
      socket.off("cartProduct");
    };
  }, []);

  useEffect(() => {
    getSales();
  }, []);

  const cancelSale = async (id: number, reason: string) => {
    return await cancelSaleService(token, id, reason);
  };

  return {
    data,
    refresh: getSales,
    goToSales,
    cancelSale
  };
};
