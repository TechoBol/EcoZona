import { useEffect, useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import {
  getLocationsService,
  createLocationService,
  deleteLocationService,
  updateLocationService,
} from "../services/locationService";
import { useNavigate } from "react-router-dom";

export const useSucursales = () => {
  const { token } = useLoginStore();
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const goToSucursales = () => {
    navigate("/sucursales");
  };

  const getLocations = async () => {
    setLoading(true);
    const res = await getLocationsService(token);
    setData(res);
    setLoading(false);
  };

  const createLocation = async (values: any) => {
    await createLocationService(values, token);
    getLocations();
  };

  const updateLocation = async (id: number, values: any) => {
    try {
      setLoading(true);

      await updateLocationService(id, values, token); // 🔥 ahora sí con id

      await getLocations(); // 🔄 refresca tabla
    } catch (error) {
      console.error("Error updating location", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteLocation = async (id: number) => {
    await deleteLocationService(id, token);
    getLocations();
  };

  useEffect(() => {
    getLocations();
  }, []);

  return {
    goToSucursales,
    data,
    loading,
    createLocation,
    deleteLocation,
    updateLocation,
  };
};
