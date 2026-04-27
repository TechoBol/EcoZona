import { useEffect, useState } from "react";
import { useLoginStore } from "../components/store/loginStore";

import {
  getRolesService,
  createRoleService,
  updateRoleService,
  deleteRoleService,
} from "../services/roleService";
import { useNavigate } from "react-router-dom";

export const useRoles = () => {
  const { token } = useLoginStore();
  const [roles, setRoles] = useState<any[]>([]);
  const navigate = useNavigate();

  const goToRoles = () => {
    navigate("/roles");
  };
  const getRoles = async () => {
    const res = await getRolesService(token);
    setRoles(res);
  };

  const createRole = async (data: any) => {
    await createRoleService(data, token);
    getRoles();
  };

  const updateRole = async (id: number, data: any) => {
    await updateRoleService(id, data, token);
    getRoles();
  };

  const deleteRole = async (id: number) => {
    await deleteRoleService(id, token);
    getRoles();
  };

  useEffect(() => {
    getRoles();
  }, []);

  return {
    roles,
    createRole,
    updateRole,
    deleteRole,
    goToRoles,
  };
};
