import { Routes, Route, Navigate } from "react-router-dom";
import { GlobalStyle } from "./components/ui/GlobalStyle";
import { useLoginStore } from "./components/store/loginStore";

import Login from "./pages/Login";
import Inventory from "./pages/Inventory";
import Cart from "./pages/Cart";
import Product from "./pages/Product";
import Sucursales from "./pages/Sucursales";
import Trabajadores from "./pages/Trabajadores";
import Roles from "./pages/Roles";
import Sales from "./pages/Sale";
import Transfers from "./pages/Transferencias";
import Lines from "./pages/Lines";

function App() {
  const { isLoggedIn } = useLoginStore();

  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/inventory" /> : <Login />}
        />

        {isLoggedIn && (
          <>
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/edit" element={<Product />} />
            <Route path="/product" element={<Product />} />
            <Route path="/sucursales" element={<Sucursales />} />
            <Route path="/trabajadores" element={<Trabajadores />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/reports" element={<Sales />} />
            <Route path="/transfer" element={<Transfers />} />
            <Route path="/lines" element={<Lines />} />
          </>
        )}

        {!isLoggedIn && <Route path="*" element={<Navigate to="/login" />} />}

        {isLoggedIn && (
          <Route path="*" element={<Navigate to="/inventory" />} />
        )}
      </Routes>
    </>
  );
}

export default App;
