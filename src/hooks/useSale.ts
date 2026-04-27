import { useEffect, useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { getSalesService } from "../services/saleService";
import { useNavigate } from "react-router-dom";

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
    getSales();
  }, []);

  return {
    data,
    refresh: getSales,
    goToSales
  };
};