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

  // 1. Cargar productos
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

  // 2. Agrupar productos
  const productosPorCategoria = productos.reduce((acc, producto) => {
    const categoria = producto.categoria?.nombre || "Productos";
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
      const storageKey = `carrito_${username}`;
      const carritoActual = JSON.parse(localStorage.getItem(storageKey)) || [];
      const existe = carritoActual.find((item) => item.id === prod.id);

      // Validación de Stock
      const cantidadEnCarrito = existe ? existe.cantidad || 1 : 0;
      if (cantidadEnCarrito + 1 > prod.stock) {
        alert(
          `⚠️ No puedes agregar más items. Stock disponible: ${prod.stock}`
        );
        return;
      }

      let nuevoCarrito;
      if (existe) {
        nuevoCarrito = carritoActual.map((item) =>
          item.id === prod.id
            ? { ...item, cantidad: (item.cantidad || 1) + 1 }
            : item
        );
      } else {
        nuevoCarrito = [...carritoActual, { ...prod, cantidad: 1 }];
      }

      localStorage.setItem(storageKey, JSON.stringify(nuevoCarrito));
      window.dispatchEvent(new Event("cartUpdated"));
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
              {/* TÍTULO CON ICONO BOXICON */}
              <h2 className="border-bottom border-secondary pb-2 mb-4 text-center text-body d-flex align-items-center justify-content-center gap-2">
                <i className="bx bxs-zap text-warning"></i> {categoria}
              </h2>

              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                {productosPorCategoria[categoria].map((prod) => (
                  <div className="col" key={prod.id}>
                    <div className="card h-100 shadow-sm hover-effect border-secondary-subtle">
                      {/* Imagen */}
                      <div
                        style={{ height: "200px", overflow: "hidden" }}
                        className="d-flex align-items-center justify-content-center bg-secondary bg-opacity-10 position-relative"
                      >
                        {prod.imagen ? (
                          <img
                            src={prod.imagen}
                            className="card-img-top"
                            alt={prod.nombre}
                            style={{
                              objectFit: "contain",
                              height: "100%",
                              width: "100%",
                              padding: "10px",
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                              // Mostramos el icono hermano si falla la imagen
                              e.target.nextSibling.style.display = "block";
                            }}
                          />
                        ) : null}

                        {/* ICONO DE JOYSTICK EN VEZ DE EMOJI */}
                        <i
                          className="bx bx-joystick text-secondary opacity-25"
                          style={{
                            fontSize: "5rem",
                            display: prod.imagen ? "none" : "block",
                          }}
                        ></i>

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
                            className={`btn w-100 fw-bold d-flex align-items-center justify-content-center gap-2 ${
                              isAuth ? "btn-primary" : "btn-outline-primary"
                            }`}
                            onClick={() => handleAccionBoton(prod)}
                            disabled={prod.stock <= 0}
                          >
                            {prod.stock > 0 ? (
                              isAuth ? (
                                <>
                                  Añadir <i className="bx bx-cart-add fs-5"></i>
                                </>
                              ) : (
                                "Inicia Sesión"
                              )
                            ) : (
                              "Sin Stock"
                            )}
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
