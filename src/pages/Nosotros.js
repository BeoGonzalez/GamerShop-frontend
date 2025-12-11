import React from "react";
import { Link } from "react-router-dom";

function Nosotros() {
  return (
    <div className="container py-5">
      {/* SECCIÓN HERO */}
      <div className="text-center mb-5 animate__animated animate__fadeIn">
        <h1 className="fw-bold display-4 text-body">
          Sobre <span className="text-primary gamer-text">GamerShop</span>
        </h1>
        <p
          className="lead text-muted mt-2 mx-auto"
          style={{ maxWidth: "600px" }}
        >
          Desde el sur del mundo para los gamers más exigentes. Conoce la
          historia detrás de tu próxima victoria.
        </p>
      </div>

      {/* HISTORIA / MISIÓN */}
      <div className="row align-items-center mb-5">
        <div className="col-lg-6 mb-4 mb-lg-0">
          <div className="bg-body-tertiary p-5 rounded-4 border shadow-sm h-100 d-flex flex-column justify-content-center">
            <h3 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <i className="bx bx-rocket text-primary"></i> Nuestra Historia
            </h3>
            <p className="text-secondary">
              Todo comenzó en el año <strong>2025</strong>, en la fría pero
              vibrante ciudad de <strong>Puerto Montt</strong>. Nuestro
              fundador, <strong>Benjamín González</strong>, notó que los gamers
              del sur siempre tenían dificultades para conseguir el hardware más
              reciente a tiempo.
            </p>
            <p className="text-secondary mb-0">
              Decidido a cambiar el juego, Benjamín fundó GamerShop con una
              misión clara: romper las barreras geográficas y ofrecer tecnología
              de punta con la calidez y confianza que solo un experto local
              puede brindar. Hoy, somos el punto de referencia para armar el
              setup de tus sueños.
            </p>
          </div>
        </div>
        <div className="col-lg-6">
          <div
            className="bg-dark text-white rounded-4 p-5 text-center shadow d-flex align-items-center justify-content-center"
            style={{ minHeight: "300px" }}
          >
            <div>
              {/* ICONO GRANDE */}
              <i className="bx bx-joystick" style={{ fontSize: "6rem" }}></i>
              <h4 className="mt-3">Creado por Gamers</h4>
              <small className="text-white-50">Est. Puerto Montt, 2025</small>
            </div>
          </div>
        </div>
      </div>

      {/* VALORES (STATS) */}
      <div className="row g-4 text-center mb-5">
        <div className="col-md-4">
          <div className="p-4 border rounded-4 shadow-sm hover-effect h-100">
            <div className="mb-3">
              <i
                className="bx bx-medal text-warning"
                style={{ fontSize: "3rem" }}
              ></i>
            </div>
            <h5 className="fw-bold">Calidad Benjamín</h5>
            <p className="small text-muted mb-0">
              Selección personal de componentes probados por nuestro fundador.
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-4 border rounded-4 shadow-sm hover-effect h-100">
            <div className="mb-3">
              <i
                className="bx bxs-map-pin text-danger"
                style={{ fontSize: "3rem" }}
              ></i>
            </div>
            <h5 className="fw-bold">Corazón Sureño</h5>
            <p className="small text-muted mb-0">
              Nacidos en Puerto Montt, conectando a jugadores de todo el país.
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-4 border rounded-4 shadow-sm hover-effect h-100">
            <div className="mb-3">
              <i
                className="bx bx-headphone text-success"
                style={{ fontSize: "3rem" }}
              ></i>
            </div>
            <h5 className="fw-bold">Soporte Experto</h5>
            <p className="small text-muted mb-0">
              Asesoría técnica real, de gamer a gamer.
            </p>
          </div>
        </div>
      </div>

      {/* CTA FINAL */}
      <div className="text-center py-5 bg-primary bg-opacity-10 rounded-4 border border-primary-subtle">
        <i
          className="bx bx-up-arrow-circle text-primary mb-3"
          style={{ fontSize: "3rem" }}
        ></i>
        <h3 className="fw-bold mb-3">¿Listo para unirte a la familia?</h3>
        <Link
          to="/categoria"
          className="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow"
        >
          Ver Catálogo <i className="bx bx-right-arrow-alt ms-1"></i>
        </Link>
      </div>
    </div>
  );
}

export default Nosotros;
