import { useEffect, useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import { getRolesService } from "../services/roleService";

export const useRoles = () => {
  const { token } = useLoginStore();
  const [roles, setRoles] = useState([]);

  const getRoles = async () => {
    const res = await getRolesService(token);
    setRoles(res);
  };

  useEffect(() => {
    getRoles();
  }, []);

  return { roles };
};