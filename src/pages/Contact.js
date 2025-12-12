import React, { useState } from "react";

function Contact() {
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulamos el envío
    setEnviado(true);
  };

  return (
    <div className="container py-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          {/* TARJETA MODERNA */}
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
            {/* CABECERA CON ICONO */}
            <div className="card-header bg-primary text-white text-center py-4">
              <div className="mb-2">
                <i className="bx bx-support" style={{ fontSize: "3rem" }}></i>
              </div>
              <h2 className="fw-bold m-0">Centro de Ayuda</h2>
              <p className="mb-0 opacity-75">Estamos listos para asistirte</p>
            </div>

            <div className="card-body p-5 bg-body-tertiary">
              {/* MENSAJE DE ÉXITO */}
              {enviado ? (
                <div className="text-center py-5 animate__animated animate__fadeIn">
                  <div className="mb-3">
                    {/* Icono de Check Gigante */}
                    <i
                      className="bx bx-check-circle text-success"
                      style={{ fontSize: "5rem" }}
                    ></i>
                  </div>
                  <h3 className="text-success fw-bold">¡Mensaje Recibido!</h3>
                  <p className="text-muted">
                    Hemos enviado una confirmación a:
                    <br />
                    <strong>gamershop230@gmail.com</strong>
                  </p>
                  <button
                    className="btn btn-outline-primary mt-3 rounded-pill px-4 d-inline-flex align-items-center gap-2"
                    onClick={() => setEnviado(false)}
                  >
                    <i className="bx bx-refresh fs-4"></i> Enviar otro mensaje
                  </button>
                </div>
              ) : (
                /* FORMULARIO */
                <form onSubmit={handleSubmit}>
                  <p className="text-center text-muted mb-4">
                    Completa el formulario y un agente te contactará.
                  </p>

                  {/* Input Nombre (LIMPIO) */}
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control rounded-3"
                      id="floatingNombre"
                      placeholder=""
                      required
                    />
                    <label htmlFor="floatingNombre">Nombre de Jugador</label>
                  </div>

                  {/* Input Email (LIMPIO) */}
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className="form-control rounded-3"
                      id="floatingEmail"
                      placeholder=""
                      required
                    />
                    <label htmlFor="floatingEmail">Correo Electrónico</label>
                  </div>

                  {/* Textarea Mensaje (LIMPIO) */}
                  <div className="form-floating mb-4">
                    <textarea
                      className="form-control rounded-3"
                      placeholder=""
                      id="floatingMensaje"
                      style={{ height: "150px" }}
                      required
                    ></textarea>
                    <label htmlFor="floatingMensaje">Tu Mensaje</label>
                  </div>

                  {/* Botón de Enviar */}
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg rounded-pill fw-bold shadow-sm hover-effect d-flex align-items-center justify-content-center gap-2"
                    >
                      Enviar Mensaje <i className="bx bx-paper-plane"></i>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Pie de tarjeta */}
            {!enviado && (
              <div className="card-footer text-center py-3 bg-body text-muted small">
                O contáctanos directamente:{" "}
                <a
                  href="mailto:gamershop230@gmail.com"
                  className="text-decoration-none fw-bold d-inline-flex align-items-center gap-1"
                >
                  <i className="bx bx-mail-send"></i> gamershop230@gmail.com
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
