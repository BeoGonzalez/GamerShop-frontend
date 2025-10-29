import React, { useState } from "react";
import Gif from "../assets/animacion.gif";

function Hero() {
  return (
    <div className="hero-section position-relative overflow-hidden">
      {/* GIF de fondo centrado */}
      <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 d-flex align-items-center justify-content-center">
        <img
          src={Gif}
          alt="Background animation"
          className="hero-video"
          style={{
            objectFit: "cover",
            minWidth: "100%",
            minHeight: "100%",
            imageRendering: "crisp-edges",
            filter: "blur(0.3px)",
            transform: "scale(1.01)",
          }}
        />
      </div>

      {/* Contenido del Hero */}
      <div
        className="container text-center text-white py-5 position-relative"
        style={{ zIndex: 1 }}
      >
        <h1 className="hero-title mb-4">
          Sube el nivel de tu setup gamer
          <br />
          <span className="hero-title-light">Más rapido que nunca</span>
        </h1>

        <div className="d-flex justify-content-center gap-4 mb-4 flex-wrap">
          <button className="btn btn-link text-white text-decoration-none border-bottom border-3 border-warning pb-2 px-0">
            Video
          </button>
          <button className="btn btn-link text-white text-decoration-none pb-2 px-0">
            Video Templates
          </button>
          <button className="btn btn-link text-white text-decoration-none pb-2 px-0">
            Audio
          </button>
          <button className="btn btn-link text-white text-decoration-none pb-2 px-0">
            Images
          </button>
        </div>

        <div className="row justify-content-center mb-4">
          <div className="col-lg-8 col-12">
            <div className="input-group input-group-lg hero-search">
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                style={{
                  borderTopLeftRadius: "50px",
                  borderBottomLeftRadius: "50px",
                  border: "none",
                }}
              />
              <button
                className="btn btn-warning px-5"
                type="button"
                style={{
                  borderTopRightRadius: "50px",
                  borderBottomRightRadius: "50px",
                }}
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
