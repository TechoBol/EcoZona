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
import InventoryFisico from "./pages/InventoryFisico";
import Kardex from "./pages/Kardex";
import NewImportation from "./pages/NewImportation";
import Importation from "./pages/Importation";
import PublicInventory from "./pages/PublicInventory";
import PublicCart from "./pages/PublicCart";
import CruceInventario from "./pages/CurceInventario";
import InventoryValorado from "./pages/InventoryValorado";
import ProductDetail from "./pages/ProductDetail";
import AddedToCart from "./pages/AddedToCart";
import EditImportation from "./pages/EditImportation";

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
        <Route path="/inventory/:token" element={<PublicInventory />} />
        <Route path="/cart/:token" element={<PublicCart />} />

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
            <Route
              path="/inventory-valorado"
              element={<InventoryValorado />}
            /><Route
              path="/inventory-fisico-valorado"
              element={<InventoryFisico />}
            />
            <Route path="/kardex" element={<Kardex />} />
            <Route path="/importation" element={<Importation />} />
            <Route path="/new-importation" element={<NewImportation />} />
            <Route path="/cross-inventory" element={<CruceInventario />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/added-to-cart" element={<AddedToCart />} />
            <Route path="/edit-importation/:id" element={<EditImportation />} />
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
