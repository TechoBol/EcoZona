import { useEffect, useState } from "react";
import { useLoginStore } from "../components/store/loginStore";

import {
  getRolesService,
  createRoleService,
  updateRoleService,
  deleteRoleService,
} from "../services/roleService";
import { useNavigate } from "react-router-dom";
import socket from "../services/SocketIOConnection";

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
    const newRole = await createRoleService(data, token);
    setRoles((prev) => [...prev, newRole]);
    getRoles();
    return newRole;
  };

  const updateRole = async (id: number, data: any) => {
    const updatedRole = await updateRoleService(id, data, token);
    getRoles();
    return updatedRole;
  };

  const deleteRole = async (id: number) => {
    await deleteRoleService(id, token);
    socket.emit("deleteRole", id);
    getRoles();
  };

  useEffect(() => {
    socket.on("roleUpdated", (role) => {
      setRoles((prev) => {
        const exists = prev.some((rol) => rol.id === role.id);

        if (exists) {
          return prev.map((rol) =>
            rol.id === role.id ? role : rol
          );
        }
        return [...prev, role];
      });
    });

    socket.on("roleRemoved", (roleId) => {
      setRoles((prev) =>
        prev.filter((rol) => rol.id !== roleId)
      );
    });

    return () => {
      socket.off("roleUpdated");
      socket.off("roleRemoved");
    };
  }, []);

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
