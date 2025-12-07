import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";

function Home() {
  const API_URL = "https://gamershop-backend-1.onrender.com/productos";

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Datos de sesión
  const isAuth = !!localStorage.getItem("jwt_token");
  const username = localStorage.getItem("username");

  // 1. Cargar productos desde la Base de Datos al iniciar
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

  // 2. Agrupar productos por Categoría
  const productosPorCategoria = productos.reduce((acc, producto) => {
    const categoria = producto.categoria || "General";
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(producto);
    return acc;
  }, {});

  // --- LÓGICA DE AGREGAR AL CARRITO ---
  const handleAccionBoton = (prod) => {
    if (!isAuth) {
      if (
        window.confirm(
          "🔒 Necesitas iniciar sesión para comprar. ¿Ir al Login?"
        )
      ) {
        navigate("/login");
      }
    } else {
      // A. Definir clave única del usuario
      const storageKey = `carrito_${username}`;

      // B. Leer carrito actual
      const carritoActual = JSON.parse(localStorage.getItem(storageKey)) || [];

      // C. Verificar si ya existe para sumar cantidad
      const existe = carritoActual.find((item) => item.id === prod.id);

      let nuevoCarrito;
      if (existe) {
        // Si existe, aumentamos la cantidad
        nuevoCarrito = carritoActual.map((item) =>
          item.id === prod.id
            ? { ...item, cantidad: (item.cantidad || 1) + 1 }
            : item
        );
      } else {
        // Si no existe, lo agregamos con cantidad 1
        nuevoCarrito = [...carritoActual, { ...prod, cantidad: 1 }];
      }

      // D. Guardar en LocalStorage
      localStorage.setItem(storageKey, JSON.stringify(nuevoCarrito));
      alert(`✅ ¡"${prod.nombre}" agregado al carrito!`);
    }
  };

  return (
    <>
      <Hero />
      <div className="container py-5">
        {cargando && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Cargando catálogo...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center">⚠️ {error}</div>
        )}

        {!cargando &&
          !error &&
          Object.keys(productosPorCategoria).map((categoria) => (
            <div key={categoria} className="mb-5">
              <h2 className="border-bottom border-secondary pb-2 mb-4 text-white">
                <span className="text-warning">⚡</span> {categoria}
              </h2>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                {productosPorCategoria[categoria].map((prod) => (
                  <div className="col" key={prod.id}>
                    <div className="card h-100 bg-dark text-white border-secondary shadow-sm hover-effect">
                      <div
                        style={{ height: "200px", overflow: "hidden" }}
                        className="d-flex align-items-center justify-content-center bg-secondary bg-opacity-25 position-relative"
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
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "block";
                            }}
                          />
                        ) : null}
                        <span
                          style={{
                            fontSize: "3rem",
                            display: prod.imagen ? "none" : "block",
                          }}
                        >
                          🎮
                        </span>

                        {prod.stock <= 0 && (
                          <div className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 rounded small fw-bold">
                            AGOTADO
                          </div>
                        )}
                      </div>

                      <div className="card-body d-flex flex-column">
                        <h5
                          className="card-title text-truncate"
                          title={prod.nombre}
                        >
                          {prod.nombre}
                        </h5>

                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="fs-5 fw-bold text-warning">
                              ${prod.precio.toLocaleString()}
                            </span>
                            <span
                              className={`badge ${
                                prod.stock > 0 ? "bg-success" : "bg-secondary"
                              }`}
                            >
                              Stock: {prod.stock}
                            </span>
                          </div>

                          <button
                            className={`btn w-100 fw-bold ${
                              isAuth ? "btn-primary" : "btn-outline-light"
                            }`}
                            onClick={() => handleAccionBoton(prod)}
                            disabled={prod.stock <= 0}
                          >
                            {prod.stock > 0
                              ? isAuth
                                ? "Añadir al Carrito 🛒"
                                : "Inicia Sesión para Comprar"
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
      </div>
    </>
  );
}

export default Home;
