import React, { useState, useEffect } from "react";

const ProfileView = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    rol: "",
  });

  useEffect(() => {
    // Recuperamos datos de la sesión
    const username = localStorage.getItem("username") || "Usuario";
    const rol = localStorage.getItem("rol") || "GUEST";

    // Como el login actual guarda username y rol, simulamos el correo
    // basándonos en el usuario para que se vea completo,
    // o puedes recuperarlo si lo guardas en el futuro.
    const email = `${username.toLowerCase()}@gamershop.com`;

    setUser({ username, rol, email });
  }, []);

  return (
    <div className="container py-5 animate__animated animate__fadeIn">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          {/* TARJETA DE PERFIL ADAPTABLE 
              - bg-body-tertiary: Gris claro en día / Gris oscuro en noche
              - border-0 shadow-sm: Estilo limpio
          */}
          <div className="card border-0 shadow-lg rounded-5 bg-body-tertiary overflow-hidden">
            {/* FONDO DECORATIVO SUPERIOR */}
            <div
              className="bg-primary bg-gradient"
              style={{ height: "100px", opacity: "0.8" }}
            ></div>

            <div className="card-body text-center position-relative pb-5">
              {/* --- FOTO DE PERFIL (ICONO) --- */}
              {/* El borde del avatar usa 'bg-body-tertiary' para fusionarse con la tarjeta */}
              <div
                className="position-absolute top-0 start-50 translate-middle rounded-circle bg-body-tertiary p-1"
                style={{ width: "110px", height: "110px" }}
              >
                <div className="w-100 h-100 rounded-circle bg-body-secondary d-flex align-items-center justify-content-center text-primary">
                  <i className="bx bxs-user" style={{ fontSize: "4rem" }}></i>
                </div>
              </div>

              {/* ESPACIO PARA EMPUJAR EL CONTENIDO ABAJO DEL ICONO */}
              <div style={{ marginTop: "60px" }}></div>

              {/* --- DATOS DEL USUARIO --- */}

              {/* Nombre: Se adapta a blanco/negro */}
              <h3 className="fw-bold text-body-emphasis mb-1">
                {user.username}
              </h3>

              {/* Correo: Color gris adaptable */}
              <p className="text-body-secondary mb-3">{user.email}</p>

              {/* Rol: Badge elegante */}
              <span
                className={`badge px-3 py-2 rounded-pill ${
                  user.rol === "ADMIN"
                    ? "bg-primary-subtle text-primary border border-primary-subtle"
                    : "bg-secondary-subtle text-secondary"
                }`}
              >
                <i
                  className={`bx ${
                    user.rol === "ADMIN" ? "bx-shield-quarter" : "bx-user"
                  } me-1`}
                ></i>
                {user.rol}
              </span>
            </div>

            {/* FOOTER OPCIONAL (Decorativo) */}
            <div className="card-footer bg-transparent border-0 text-center pb-4">
              <small className="text-body-secondary opacity-50">
                Cuenta activa - GamerShop ID: #
                {Math.floor(Math.random() * 1000) + 1000}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
