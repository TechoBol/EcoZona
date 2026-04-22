import { errorToast } from "./toasts";

/* 🔐 LOGIN */
export const logInAuth = async (username: string, password: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/authentication/signIn`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      }
    );

    if (!response.ok) {
      errorToast("Usuario o contraseña incorrectos");
      return null;
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error en login:", error);
    errorToast("Error de conexión");
    return null;
  }
};