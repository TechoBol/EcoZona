import { useEffect, useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { successToast, errorToast } from "../services/toasts";
import socket from "../services/SocketIOConnection";
import { useNavigate } from "react-router-dom";

import {
  getRolesService,
  createRoleService,
  updateRoleService,
  deleteRoleService,
} from "../services/roleService";

export const useRoles = () => {
  const { token } = useLoginStore();
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const goToRoles = () => {
    navigate("/roles");
  };
  const getRoles = async () => {
    const res = await getRolesService(token);
    setRoles(res);
  };

  const createRole = async (data: any) => {
    setIsLoading(true);
    try {
      const newRole = await createRoleService(data, token);
      setRoles((prev) => [...prev, newRole]);
      getRoles();
      successToast("Rol creado exitosamente");
      return newRole;
    } catch (error) {
      errorToast("Error al crear el rol");
    } finally {
      setIsLoading(false);
    }
  };

  const updateRole = async (id: number, data: any) => {
    setIsLoading(true);
    try {
      const updatedRole = await updateRoleService(id, data, token);
      getRoles();
      successToast("Rol actualizado");
      return updatedRole;
    } catch (error) {
      errorToast("Error al actualizar el rol");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRole = async (id: number) => {
    setIsLoading(true);
    try {
      await deleteRoleService(id, token);
      socket.emit("deleteRole", id);
      getRoles();
      successToast("Rol eliminado");
    } catch (error) {
      errorToast("Error al eliminar el rol");
    } finally {
      setIsLoading(false);
    }
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
    isLoading,
  };
};
