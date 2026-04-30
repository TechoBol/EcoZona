import { useEffect, useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import socket from "../services/SocketIOConnection";
import { successToast, errorToast } from "../services/toasts";
import { useNavigate } from "react-router-dom";
import {
  getEmployeesService,
  createEmployeeService,
  updateEmployeeService,
  deleteEmployeeService,
} from "../services/employeeService";

export const useEmployees = () => {
  const { token } = useLoginStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

   const goToTrabajadores = () => {
    navigate("/trabajadores");
  };
  const getEmployees = async () => {
    const res = await getEmployeesService(token);
    setData(res);
  };

  const createEmployee = async (values: any) => {
    setIsLoading(true);
    try {
      const newEmployee = await createEmployeeService(values, token);
      setData((prev) => [...prev, newEmployee]);
      getEmployees();
      successToast("Trabajador creado");
      return newEmployee;
    } catch (error) {
      errorToast("Error al crear el trabajador");
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmployee = async (id: number, values: any) => {
    setIsLoading(true);
    try{
      const updateEmployee = await updateEmployeeService(id, values, token);
      getEmployees();
      successToast("Trabajador actualizado");
      return updateEmployee;
    } catch (error) {
      errorToast("Error al actualizar el trabajador");
    } finally {
      setIsLoading(false);  
    }
    
  };

  const deleteEmployee = async (id: number) => {
    setIsLoading(true);
    try {
      await deleteEmployeeService(id, token);
      socket.emit("deleteEmployee", id);
      successToast("Trabajador eliminado");
      socket.emit("deleteLocation", id);
      getEmployees();
    } catch (error) {
      errorToast("Error al eliminar el trabajador");
    } finally {
      setIsLoading(false);
    }
  };

useEffect(() => {
    socket.on("employeeUpdated", (employee) => {
      setData((prev) => {
        const exists = prev.some((emp) => emp.id === employee.id);
        if (exists) {
          return prev.map((emp) =>
            emp.id === employee.id ? employee : emp
          );
        }
        return [...prev, employee];
      });
    });

    socket.on("employeeRemoved", (employeeId) => {
      setData((prev) =>
        prev.filter((emp) => emp.id !== employeeId)
      );
    });

    return () => {
      socket.off("employeeUpdated");
      socket.off("employeeRemoved");
    };
  }, []);

  useEffect(() => {
    getEmployees();
  }, []);

  return {
    data,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    goToTrabajadores,
    isLoading
  };
};