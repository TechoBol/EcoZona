import { useEffect, useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import socket from "../services/SocketIOConnection";

import {
  getEmployeesService,
  createEmployeeService,
  updateEmployeeService,
  deleteEmployeeService,
} from "../services/employeeService";
import { useNavigate } from "react-router-dom";

export const useEmployees = () => {
  const { token } = useLoginStore();
  const navigate = useNavigate();

  const [data, setData] = useState([]);

   const goToTrabajadores = () => {
    navigate("/trabajadores");
  };
  const getEmployees = async () => {
    const res = await getEmployeesService(token);
    setData(res);
  };

  const createEmployee = async (values: any) => {
    const newEmployee = await createEmployeeService(values, token);
    setData((prev) => [...prev, newEmployee]);
    getEmployees();
    return newEmployee;
  };

  const updateEmployee = async (id: number, values: any) => {
    const updateEmployee = await updateEmployeeService(id, values, token);
    getEmployees();
    return updateEmployee;
  };

  const deleteEmployee = async (id: number) => {
    await deleteEmployeeService(id, token);
    socket.emit("deleteEmployee", id);
    getEmployees();
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
    goToTrabajadores
  };
};