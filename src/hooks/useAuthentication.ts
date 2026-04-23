import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { successToast, errorToast } from "../services/toasts";
import { useLoginStore } from "../components/store/loginStore";
import { logInAuth } from "../services/AuthenticationService";

const useAuthentication = () => {
  const navigate = useNavigate();

  const {
    setFullName,
    setRole,
    changeLogInState,
    setToken,
    setLocation,
  } = useLoginStore();

  const [isLoading, setIsLoading] = useState(false);

  /* LOGIN */
  const signIn = async (email: string, password: string) => {
    // VALIDACIÓN
    if (!email || !password) {
      errorToast("Completa todos los campos");
      return;
    }

    setIsLoading(true);

    try {
      const response = await logInAuth(email, password);

      // SI FALLA LOGIN
      if (!response) {
        return;
      }

      // GUARDAR DATOS
      setFullName(`${response.name} ${response.lastName}`);
      setToken(response.token);
      setRole(response.role);
      setLocation(response.location);
      console.log(response)
      changeLogInState();

      // TOAST
      successToast("Bienvenido");

      // REDIRECCIÓN
      navigate("/Inventory");

    } catch (error) {
      console.error("Error en login:", error);
      errorToast("Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  /* LOGOUT */
  const logOut = () => {
    setFullName("");
    setRole("");
    setToken("");
    setLocation("");

    changeLogInState();

    successToast("Sesión cerrada");

    navigate("/login");
  };

  return {
    signIn,
    logOut,
    isLoading,
  };
};

export default useAuthentication;