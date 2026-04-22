import { Routes, Route, Navigate } from "react-router-dom";
import { GlobalStyle } from "./components/ui/GlobalStyle";
import { useLoginStore } from "./components/store/loginStore";
import { Toaster } from "react-hot-toast"; // 🔥 AÑADIDO

import Login from "./pages/Login";
import Inventory from "./pages/Inventory";
import Cart from "./pages/Cart";

function App() {
  const { isLoggedIn, role } = useLoginStore();

  return (
    <>
      <GlobalStyle />

      <Toaster /> {/* 🔥 ESTO HACE QUE FUNCIONEN LOS TOAST */}

      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/inventory" /> : <Login />
          }
        />

        {/* RUTAS SOLO SI ESTÁ LOGUEADO */}
        {isLoggedIn && (
          <>
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/cart" element={<Cart />} />
          </>
        )}

        {/* SI NO ESTÁ LOGUEADO Y TRATA DE ENTRAR A OTRA RUTA */}
        {!isLoggedIn && (
          <Route path="*" element={<Navigate to="/login" />} />
        )}

        {/* SI ESTÁ LOGUEADO Y PONE CUALQUIER COSA */}
        {isLoggedIn && (
          <Route path="*" element={<Navigate to="/inventory" />} />
        )}
      </Routes>
    </>
  );
}

export default App;