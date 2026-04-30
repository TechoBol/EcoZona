import { errorToast } from "./toasts";

/* LOGIN */
export const logInAuth = async (email: string, password: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/authentication/signIn`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      }
    );

    if (!response.ok) {
      errorToast("Correo o contraseña incorrectos.");
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