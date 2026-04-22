import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { GlobalStyle } from "./components/ui/GlobalStyle";
import Inventory from "./pages/Inventory";
import Cart from "./pages/Cart";


function App() {
  return (
    <>
      <GlobalStyle />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  );
}

export default App;