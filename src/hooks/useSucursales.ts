import { useEffect, useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import socket from "../services/SocketIOConnection";
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
    const newLocation = await createLocationService(values, token);
    setData((prev) => [...prev, newLocation]);
    getLocations();
    return newLocation;
  };

  const updateLocation = async (id: number, values: any) => {
    try {
      setLoading(true);

      const updatedLocation = await updateLocationService(id, values, token);

      await getLocations();
      return updatedLocation;
    } catch (error) {
      console.error("Error updating location", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteLocation = async (id: number) => {
    await deleteLocationService(id, token);

    socket.emit("deleteLocation", id);

    getLocations();
  };

  useEffect(() => {
    socket.on("locationUpdated", (location) => {
      setData((prev) => {
        const exists = prev.some((loc) => loc.id === location.id);

        if (exists) {
          return prev.map((loc) =>
            loc.id === location.id ? location : loc
          );
        }

        return [...prev, location];
      });
    });

    socket.on("locationRemoved", (locationId) => {
      setData((prev) =>
        prev.filter((loc) => loc.id !== locationId)
      );
    });

    return () => {
      socket.off("locationUpdated");
      socket.off("locationRemoved");
    };
  }, []);

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