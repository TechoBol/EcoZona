import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getKardexService } from "../services/kardexService";
import { useLoginStore } from "../components/store/loginStore";

export const useKardex = () => {
  const navigate = useNavigate();

  const { token } = useLoginStore();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const goToKardex = () => {
    navigate("/kardex");
  };

  const generarKardex = async (filters: any) => {
    try {
      setLoading(true);

      const res = await getKardexService(filters, token);

      setData(res.data || []);

      return res.data;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    data,
    generarKardex,
    goToKardex,
  };
};