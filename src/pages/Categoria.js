import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Categoria() {
  const API_URL = "https://gamershop-backend-1.onrender.com/productos";

  // Estados
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [cargando, setCargando] = useState(true);

  const navigate = useNavigate();

  // Datos de sesión
  const isAuth = !!localStorage.getItem("jwt_token");
  const username = localStorage.getItem("username");

  // 1. Cargar productos y extraer categorías
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get(API_URL);
        const data = response.data;
        setProductos(data);

        // Extraer categorías únicas
        const uniqueCats = [
          "Todos",
          ...new Set(data.map((p) => p.categoria?.nombre || "General")),
        ];
        setCategorias(uniqueCats);
      } catch (err) {
        console.error("Error cargando productos:", err);
      } finally {
        setCargando(false);
      }
    };
    fetchProductos();
  }, []);

  // 2. Filtrar productos
  const productosFiltrados =
    categoriaSeleccionada === "Todos"
      ? productos
      : productos.filter(
          (p) => (p.categoria?.nombre || "General") === categoriaSeleccionada
        );

  // 3. Lógica de Carrito (Conectada al Navbar)
  const handleAddToCart = (prod) => {
    if (!isAuth) {
      if (
        window.confirm(
          "🔒 Necesitas iniciar sesión para comprar. ¿Ir al Login?"
        )
      ) {
        navigate("/login");
      }
      return;
    }

    const storageKey = `carrito_${username}`;
    const carritoActual = JSON.parse(localStorage.getItem(storageKey)) || [];
    const existe = carritoActual.find((item) => item.id === prod.id);

    const cantidadEnCarrito = existe ? existe.cantidad || 1 : 0;
    if (cantidadEnCarrito + 1 > prod.stock) {
      alert(`⚠️ Stock insuficiente. Solo quedan: ${prod.stock}`);
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
    window.dispatchEvent(new Event("cartUpdated")); // Actualiza el Navbar
    alert(`✅ ¡"${prod.nombre}" agregado al carrito!`);
  };

  return (
    <div className="container py-5 mt-4">
      {/* Título Principal */}
      <div className="mb-5 border-bottom pb-3">
        <h1 className="fw-bold text-body">
          Catálogo <span className="text-primary">Gamer</span>
        </h1>
        <p className="text-muted">Selecciona una categoría para filtrar.</p>
      </div>

      <div className="row">
        {/* --- COLUMNA IZQUIERDA: MENÚ DE CATEGORÍAS --- */}
        <div className="col-lg-3 mb-4">
          <div className="sticky-top" style={{ top: "100px", zIndex: 10 }}>
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
              <div className="card-header bg-primary text-white fw-bold py-3">
                Categorías
              </div>
              <div className="list-group list-group-flush">
                {cargando ? (
                  <div className="p-4 text-center">
                    <div className="spinner-border spinner-border-sm text-primary"></div>
                  </div>
                ) : (
                  categorias.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoriaSeleccionada(cat)}
                      className={`list-group-item list-group-item-action py-3 d-flex justify-content-between align-items-center ${
                        categoriaSeleccionada === cat ? "active fw-bold" : ""
                      }`}
                      style={{ cursor: "pointer", transition: "all 0.2s" }}
                    >
                      {cat}
                      {/* Badge con la cantidad (Opcional) */}
                      {categoriaSeleccionada === cat && <span>✨</span>}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- COLUMNA DERECHA: PRODUCTOS --- */}
        <div className="col-lg-9">
          {/* Encabezado de la Sección */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="m-0 fw-bold text-body">
              {categoriaSeleccionada === "Todos"
                ? "Todos los Productos"
                : categoriaSeleccionada}
            </h3>
            <span className="badge bg-secondary rounded-pill">
              {productosFiltrados.length} Resultados
            </span>
          </div>

          <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
            {!cargando && productosFiltrados.length === 0 && (
              <div className="col-12 py-5 text-center">
                <div className="py-5 bg-body-tertiary rounded-4">
                  <h4>Sin resultados</h4>
                  <p className="text-muted">
                    No encontramos productos en esta categoría.
                  </p>
                </div>
              </div>
            )}

            {productosFiltrados.map((prod) => (
              <div className="col" key={prod.id}>
                <div className="card h-100 shadow-sm hover-effect border-secondary-subtle">
                  {/* Imagen */}
                  <div
                    style={{ height: "200px", overflow: "hidden" }}
                    className="d-flex align-items-center justify-content-center bg-secondary bg-opacity-10 position-relative p-3"
                  >
                    {prod.imagen ? (
                      <img
                        src={prod.imagen}
                        alt={prod.nombre}
                        className="img-fluid"
                        style={{
                          maxHeight: "100%",
                          maxWidth: "100%",
                          objectFit: "contain",
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

                  {/* Cuerpo */}
                  <div className="card-body d-flex flex-column">
                    <small className="text-muted mb-1">
                      {prod.categoria?.nombre || "General"}
                    </small>
                    <h5
                      className="card-title text-truncate"
                      title={prod.nombre}
                    >
                      {prod.nombre}
                    </h5>

                    <div className="mt-auto pt-3">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="fs-5 fw-bold text-success">
                          ${prod.precio.toLocaleString()}
                        </span>
                        <span
                          className={`badge ${
                            prod.stock > 0
                              ? "bg-light text-dark border"
                              : "bg-secondary"
                          }`}
                        >
                          Stock: {prod.stock}
                        </span>
                      </div>

                      <button
                        className={`btn w-100 fw-bold rounded-3 ${
                          isAuth
                            ? "btn-outline-primary"
                            : "btn-outline-secondary"
                        }`}
                        onClick={() => handleAddToCart(prod)}
                        disabled={prod.stock <= 0}
                      >
                        {prod.stock > 0
                          ? isAuth
                            ? "Añadir 🛒"
                            : "Login"
                          : "Agotado"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categoria;
