import React from "react";
import { Link } from "react-router-dom";

function Nosotros() {
  return (
    <div className="animate__animated animate__fadeIn">
      {/* HERO SECTION */}
      <div className="bg-body-tertiary py-5 text-center border-bottom border-secondary-subtle">
        <div className="container py-4">
          <h1 className="display-4 fw-bold text-primary mb-3">
            Nuestra Pasión son los Videojuegos
          </h1>
          {/* Quitamos opacity para máxima legibilidad */}
          <p className="lead text-body mx-auto" style={{ maxWidth: "700px" }}>
            En GamerShop no solo vendemos hardware, vivimos la experiencia.
            Nacimos en 2024 con la misión de equipar a cada jugador con lo
            mejor.
          </p>
        </div>
      </div>

      {/* MISION Y VISION */}
      <div className="container py-5">
        <div className="row g-5 align-items-center">
          <div className="col-md-6">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden h-100">
              <div className="card-body p-5 bg-primary text-white d-flex align-items-center justify-content-center flex-column text-center">
                <i className="bx bx-rocket" style={{ fontSize: "5rem" }}></i>
                <h2 className="mt-3 fw-bold text-white">Misión</h2>
                <p className="mb-0 text-white opacity-100">
                  Democratizar el acceso al gaming de alto rendimiento en toda
                  la región.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <h2 className="fw-bold mb-4 d-flex align-items-center gap-2 text-body">
              <i className="bx bx-target-lock text-primary"></i> ¿Quiénes somos?
            </h2>
            <p className="text-body mb-4 fs-5">
              Somos un equipo de ingenieros, diseñadores y, sobre todo, gamers.
              Entendemos lo frustrante que es tener lag o que un juego no corra.
              Por eso seleccionamos cada producto de nuestro catálogo
              personalmente.
            </p>
            <div className="d-flex gap-4">
              <div>
                <h3 className="fw-bold text-primary mb-0">10k+</h3>
                <small className="text-body fw-bold">Clientes Felices</small>
              </div>
              <div>
                <h3 className="fw-bold text-primary mb-0">500+</h3>
                <small className="text-body fw-bold">Productos</small>
              </div>
              <div>
                <h3 className="fw-bold text-primary mb-0">24/7</h3>
                <small className="text-body fw-bold">Soporte</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EQUIPO */}
      <div className="bg-body-tertiary py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-body">Nuestro Equipo</h2>
            <p className="text-muted">Las mentes detrás de la tienda</p>
          </div>

          <div className="row g-4 justify-content-center">
            {[1, 2, 3].map((item) => (
              <div key={item} className="col-md-4 col-lg-3">
                <div className="card border-0 shadow-sm h-100 text-center py-4 rounded-4 bg-body">
                  <div className="card-body">
                    <div
                      className="mb-3 mx-auto bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "100px", height: "100px" }}
                    >
                      <i className="bx bx-user fs-1 text-primary"></i>
                    </div>
                    <h5 className="fw-bold mb-1 text-body">Miembro {item}</h5>
                    <p className="text-primary small mb-3 fw-bold">
                      Especialista en Hardware
                    </p>
                    <div className="d-flex justify-content-center gap-2">
                      <button className="btn btn-sm btn-outline-secondary rounded-circle border-0">
                        <i className="bx bxl-linkedin fs-4"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-secondary rounded-circle border-0">
                        <i className="bx bxl-twitter fs-4"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container py-5 text-center">
        <h3 className="fw-bold mb-3 text-body">¿Listo para armar tu PC?</h3>
        <Link
          to="/categoria"
          className="btn btn-primary btn-lg rounded-pill px-5 shadow fw-bold text-white"
        >
          Ver Catálogo <i className="bx bx-right-arrow-alt"></i>
        </Link>
      </div>
    </div>
  );
}

export default Nosotros;
