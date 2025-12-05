import React, { useState, useEffect } from "react";
import axios from "axios";
import Hero from "../components/Hero";

function Home() {
  const API_URL = "https://gamershop-backend-1.onrender.com/productos";

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // 1. Cargar productos al iniciar
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get(API_URL);
        setProductos(response.data);
      } catch (err) {
        console.error("Error cargando productos:", err);
        setError("Hubo un problema al cargar el catálogo.");
      } finally {
        setCargando(false);
      }
    };
    fetchProductos();
  }, []);

  // 2. Función para Agrupar productos por Categoría
  // Esto transforma una lista plana en un objeto: { "Consolas": [...], "Juegos": [...] }
  const productosPorCategoria = productos.reduce((acc, producto) => {
    const categoria = producto.categoria || "General"; // Si no tiene categoría, va a "General"
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(producto);
    return acc;
  }, {});

  // Función simple para agregar al carrito (Simulación)
  // Aquí luego conectarás tu lógica real de carrito
  const handleAgregar = (prod) => {
    alert(`¡Has agregado "${prod.nombre}" al carrito! 🛒`);
    // Tip: Aquí podrías guardar en localStorage o Context
  };

  return (
    <>
      {/* 1. Componente Hero al inicio */}
      <Hero />

      {/* 2. Contenedor principal de la tienda */}
      <div className="container py-5">
        {/* Estado de Carga */}
        {cargando && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Cargando las mejores ofertas...</p>
          </div>
        )}

        {/* Estado de Error */}
        {error && (
          <div className="alert alert-danger text-center">⚠️ {error}</div>
        )}

        {/* 3. Renderizado de Productos por Categoría */}
        {!cargando &&
          !error &&
          Object.keys(productosPorCategoria).map((categoria) => (
            <div key={categoria} className="mb-5">
              {/* Título de la Categoría */}
              <h2 className="border-bottom border-secondary pb-2 mb-4 text-white">
                <span className="text-warning">⚡</span> {categoria}
              </h2>

              {/* Grid de Productos */}
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                {productosPorCategoria[categoria].map((prod) => (
                  <div className="col" key={prod.id}>
                    <div className="card h-100 bg-dark text-white border-secondary shadow-sm hover-effect">
                      {/* Imagen del Producto */}
                      <div
                        style={{ height: "200px", overflow: "hidden" }}
                        className="d-flex align-items-center justify-content-center bg-secondary bg-opacity-25"
                      >
                        {prod.imagen ? (
                          <img
                            src={prod.imagen}
                            className="card-img-top"
                            alt={prod.nombre}
                            style={{
                              objectFit: "cover",
                              height: "100%",
                              width: "100%",
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: "3rem" }}>🎮</span>
                        )}
                      </div>

                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title text-truncate">
                          {prod.nombre}
                        </h5>
                        <p className="card-text text-muted small text-truncate">
                          ID: {prod.id}
                        </p>

                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="fs-5 fw-bold text-warning">
                              ${prod.precio.toLocaleString()}
                            </span>
                            {prod.stock > 0 ? (
                              <span className="badge bg-success">En Stock</span>
                            ) : (
                              <span className="badge bg-danger">Agotado</span>
                            )}
                          </div>

                          <button
                            className="btn btn-primary w-100 fw-bold"
                            onClick={() => handleAgregar(prod)}
                            disabled={prod.stock <= 0}
                          >
                            {prod.stock > 0
                              ? "Añadir al Carrito 🛒"
                              : "Sin Stock"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

        {/* Mensaje si no hay productos */}
        {!cargando && productos.length === 0 && (
          <div className="text-center py-5 text-muted">
            <h3>Aún no hay productos en la tienda.</h3>
            <p>Ve al Panel Admin para agregar el primero.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
