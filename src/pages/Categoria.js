import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Cards from "../components/Cards";
import imagen1 from "../assets/imagen1.webp";
import imagen2 from "../assets/imagen2.jpg";
import imagen3 from "../assets/imagen3.webp";
import imagen4 from "../assets/imagen4.webp";
import imagen5 from "../assets/imagen5.jpg";

export default function Categoria() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [productosFiltrados, setProductosFiltrados] = useState([]);

  const productos = [
    {
      id: 1,
      nombre: "Mouse Gamer",
      categoria: "Mouse",
      precio: 25000,
      imagen: imagen1,
    },
    {
      id: 2,
      nombre: "Audifono gamer",
      categoria: "Audifonos",
      precio: 55000,
      imagen: imagen2,
    },
    {
      id: 3,
      nombre: "Teclado rgb",
      categoria: "Teclados",
      precio: 95000,
      imagen: imagen3,
    },
    {
      id: 4,
      nombre: "Monitor gamer",
      categoria: "Monitores",
      precio: 220000,
      imagen: imagen4,
    },
    {
      id: 5,
      nombre: "Aorus",
      categoria: "Tarjetas gráficas",
      precio: 1200000,
      imagen: imagen5,
    },
  ];

  const categorias = [
    "Todos",
    "Teclados",
    "Mouses",
    "Audifonos",
    "Tarjetas gráficas",
  ];

  useEffect(() => {
    if (categoriaSeleccionada === "Todos") {
      setProductosFiltrados(productos);
    } else {
      setProductosFiltrados(
        productos.filter((p) => p.categoria === categoriaSeleccionada)
      );
    }
  }, [categoriaSeleccionada]);

  // Esta función se usará para añadir productos al carrito
  const handleAddToCart = (producto) => {
    const saved = localStorage.getItem("cart");
    const currentCart = saved ? JSON.parse(saved) : [];
    const newCart = [...currentCart, producto];
    localStorage.setItem("cart", JSON.stringify(newCart));
    alert(`🛒 ${producto.nombre} añadido al carrito`);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Categorías de Productos</h2>

      {/* Botones de categoría */}
      <div className="d-flex justify-content-center mb-4 flex-wrap">
        {categorias.map((cat) => (
          <button
            key={cat}
            className={`btn m-2 ${
              categoriaSeleccionada === cat
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => setCategoriaSeleccionada(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Componente reutilizado de Cards */}
      <Cards productos={productosFiltrados} onAddToCart={handleAddToCart} />
    </div>
  );
}
