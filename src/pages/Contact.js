import React, { useState } from "react";

function Contact() {
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulamos el envío
    setEnviado(true);

    // Opcional: Resetear el formulario después de 3 segundos
    // setTimeout(() => setEnviado(false), 3000);
  };

  return (
    <div className="container py-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          {/* TARJETA MODERNA */}
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
            <div className="card-header bg-primary text-white text-center py-4">
              <h2 className="fw-bold m-0">Contáctanos</h2>
              <p className="mb-0 opacity-75">Estamos aquí para ayudarte</p>
            </div>

            <div className="card-body p-5 bg-body-tertiary">
              {/* MENSAJE DE ÉXITO */}
              {enviado ? (
                <div className="text-center py-5 animate__animated animate__fadeIn">
                  <div className="mb-3">
                    <span style={{ fontSize: "4rem" }}>✅</span>
                  </div>
                  <h3 className="text-success fw-bold">¡Mensaje Enviado!</h3>
                  <p className="text-muted">
                    Se ha enviado correctamente hacia el correo:
                    <br />
                    <strong>gamershop230@gmail.com</strong>
                  </p>
                  <button
                    className="btn btn-outline-primary mt-3 rounded-pill px-4"
                    onClick={() => setEnviado(false)}
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                /* FORMULARIO */
                <form onSubmit={handleSubmit}>
                  <p className="text-center text-muted mb-4">
                    ¿Tienes alguna duda con tu compra? Escríbenos.
                  </p>

                  {/* Input Nombre con Floating Label */}
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control rounded-3"
                      id="floatingNombre"
                      placeholder="Tu Nombre"
                      required
                    />
                    <label htmlFor="floatingNombre">Nombre Completo</label>
                  </div>

                  {/* Input Email (Opcional, pero recomendado) */}
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className="form-control rounded-3"
                      id="floatingEmail"
                      placeholder="nombre@ejemplo.com"
                      required
                    />
                    <label htmlFor="floatingEmail">Correo Electrónico</label>
                  </div>

                  {/* Textarea Mensaje */}
                  <div className="form-floating mb-4">
                    <textarea
                      className="form-control rounded-3"
                      placeholder="Escribe tu mensaje aquí"
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
                      className="btn btn-primary btn-lg rounded-pill fw-bold shadow-sm hover-effect"
                    >
                      Enviar Mensaje
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Pie de tarjeta con info extra */}
            {!enviado && (
              <div className="card-footer text-center py-3 bg-body text-muted small">
                También puedes escribirnos directo a:{" "}
                <a
                  href="mailto:gamershop230@gmail.com"
                  className="text-decoration-none fw-bold"
                >
                  gamershop230@gmail.com
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
