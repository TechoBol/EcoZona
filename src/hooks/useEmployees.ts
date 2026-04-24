import { useEffect, useState } from "react";
import { useLoginStore } from "../components/store/loginStore";

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
    await createEmployeeService(values, token);
    getEmployees();
  };

  const updateEmployee = async (id: number, values: any) => {
    await updateEmployeeService(id, values, token);
    getEmployees();
  };

  const deleteEmployee = async (id: number) => {
    await deleteEmployeeService(id, token);
    getEmployees();
  };

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