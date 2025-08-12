import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Login from "./pages/Login";
import CreateProduct from "./pages/CreateProduct";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/create-product" element={<CreateProduct />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
