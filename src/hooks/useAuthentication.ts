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

  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async () => {
    setIsLoading(true);

    try {
      const response = await logInAuth(email, password);

      if (!response) {
        setIsLoading(false);
        return null;
      }

      // guardar datos en store (cache)
      setFullName(`${response.name} ${response.lastName}`);
      setToken(response.token);
      setRole(response.role);
      setRegional(email.regionalOffice);
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
    email,
    password,
    setUsername,
    setPassword,
    isLoading
  };
};

export default useAuthentication;