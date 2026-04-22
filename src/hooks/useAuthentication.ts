import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { successToast } from "../services/toasts";
import { useLoginStore } from "../components/store/loginStore";
import { logInAuth } from "../services/AuthenticationService";

const useAuthentication = () => {
  const navigate = useNavigate();

  const {
    setFullName,
    setRole,
    changeLogInState,
    setToken,
    setRegional,
  } = useLoginStore();

  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email, password) => {
    if (!email || !password) {
      console.warn("Email o contraseña vacíos");
      return;
    }

    setIsLoading(true);

    try {
      const response = await logInAuth(email, password);

      if (!response) {
        return;
      }

      // Guardar datos en store
      setFullName(`${response.name} ${response.lastName}`);
      setToken(response.token);
      setRole(response.role);
      setRegional(response.regionalOffice);

      changeLogInState();

      successToast("Bienvenido");

      navigate("/Inventory");
    } catch (error) {
      console.error("Error en login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logOut = () => {
    setFullName("");
    setRole("");
    setToken("");
    setRegional("");
    changeLogInState();

    navigate("/login");
  };

  return {
    signIn,
    logOut,
    isLoading,
  };
};

export default useAuthentication;