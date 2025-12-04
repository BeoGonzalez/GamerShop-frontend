import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Páginas
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Categoria from "./pages/Categoria";
import Carrito from "./pages/Carrito"; // Asumimos que esta es la Tienda/Carrito visual
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel"; // El panel nuevo que creamos
import Registro from "./pages/Registro";

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categoria" element={<Categoria />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
