import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";

function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Cargar productos del backend
    fetch("https://gamershop-backend-1.onrender.com/productos")
      .then((res) => {
        if (!res.ok) throw new Error("Error al conectar con el servidor");
        return res.json();
      })
      .then((data) => {
        setProductos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudieron cargar los productos.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="animate__animated animate__fadeIn">
      {/* 1. SECCIÓN HERO (Banner Principal) */}
      <Hero />

      {/* 2. CATÁLOGO DE PRODUCTOS */}
      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold display-6 text-primary">
            <i className="bx bx-star"></i> Productos Destacados
          </h2>
          {/* Texto adaptable: text-body-secondary */}
          <p className="text-body-secondary fs-5">
            Lo último en tecnología para llevar tu setup al siguiente nivel.
          </p>
        </div>

        {/* MENSAJE DE CARGA */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-body-secondary">Cargando inventario...</p>
          </div>
        )}

        {/* MENSAJE DE ERROR */}
        {error && (
          <div className="alert alert-danger text-center rounded-4 shadow-sm">
            <i className="bx bx-error-circle fs-4"></i> {error}
          </div>
        )}

        {/* --- VALIDACIÓN: SI NO HAY PRODUCTOS --- */}
        {!loading && !error && productos.length === 0 && (
          <div className="text-center py-5 animate__animated animate__fadeIn">
            <div className="mb-3 text-secondary opacity-50">
              <i className="bx bx-package" style={{ fontSize: "5rem" }}></i>
            </div>
            <h3 className="fw-bold text-body-emphasis">
              No hay productos en el almacén
            </h3>
            <p className="text-body-secondary">
              Estamos reponiendo stock. ¡Vuelve pronto!
            </p>
          </div>
        )}

        {/* GRID DE PRODUCTOS (Solo si hay productos > 0) */}
        {!loading && !error && productos.length > 0 && (
          <div className="row g-4">
            {productos.map((prod) => (
              <div key={prod.id} className="col-12 col-md-6 col-lg-3">
                {/* CARD DEL PRODUCTO: bg-body-tertiary para fondo adaptable */}
                <div className="card border-0 shadow-lg rounded-4 overflow-hidden h-100 bg-body-tertiary transition-hover">
                  {/* HEADER (IMAGEN): bg-body para que cambie blanco/negro */}
                  <div
                    className="position-relative bg-body d-flex align-items-center justify-content-center overflow-hidden"
                    style={{ height: "250px" }}
                  >
                    {/* Badge de Categoría */}
                    <span className="position-absolute top-0 start-0 m-3 badge bg-primary bg-gradient shadow-sm rounded-pill">
                      {prod.categoria ? prod.categoria.nombre : "Gaming"}
                    </span>

                    {prod.imagen ? (
                      <img
                        src={prod.imagen}
                        alt={prod.nombre}
                        className="img-fluid p-4 hover-zoom"
                        style={{
                          maxHeight: "100%",
                          objectFit: "contain",
                          transition: "transform 0.3s",
                        }}
                      />
                    ) : (
                      <div className="text-secondary opacity-25">
                        <i
                          className="bx bx-joystick"
                          style={{ fontSize: "5rem" }}
                        ></i>
                      </div>
                    )}
                  </div>

                  {/* BODY DE LA CARD */}
                  <div className="card-body d-flex flex-column p-4">
                    {/* Nombre: text-body-emphasis (Negro fuerte / Blanco brillante) */}
                    <h5
                      className="fw-bold text-body-emphasis mb-1 text-truncate"
                      title={prod.nombre}
                    >
                      {prod.nombre}
                    </h5>

                    {/* Descripción: text-body-secondary (Gris medio adaptable) */}
                    <small className="text-body-secondary mb-3 d-block text-truncate">
                      {prod.descripcion || "Sin descripción disponible"}
                    </small>

                    {/* Precio y Stock */}
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        {/* Precio: text-body (Adaptable) o success */}
                        <span className="fs-4 fw-bold text-success">
                          ${prod.precio.toLocaleString()}
                        </span>

                        {prod.stock > 0 ? (
                          <span className="badge bg-success-subtle text-success-emphasis border border-success-subtle rounded-pill">
                            Stock: {prod.stock}
                          </span>
                        ) : (
                          <span className="badge bg-danger-subtle text-danger-emphasis border border-danger-subtle rounded-pill">
                            Agotado
                          </span>
                        )}
                      </div>

                      {/* BOTÓN DE ACCIÓN */}
                      <Link
                        to={`/producto/${prod.id}`}
                        className="btn btn-primary w-100 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                      >
                        Ver Detalles <i className="bx bx-right-arrow-alt"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
