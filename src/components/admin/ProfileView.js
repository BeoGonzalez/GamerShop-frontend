import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://gamershop-backend-1.onrender.com";

const ProfileView = () => {
  const [perfil, setPerfil] = useState({
    username: "",
    email: "",
    rol: "",
  });

  // Datos editables
  const [emailEdit, setEmailEdit] = useState("");
  const [passwordEdit, setPasswordEdit] = useState(""); // Nueva contraseña
  const [loading, setLoading] = useState(true);

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : null;
  };

  // 1. Obtener mi perfil (GET /usuarios/perfil)
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const headers = getHeaders();
        if (!headers) return;

        const res = await axios.get(`${API_URL}/usuarios/perfil`, { headers });
        setPerfil(res.data);
        setEmailEdit(res.data.email); // Prellenamos el email
      } catch (error) {
        console.error("Error cargando perfil", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, []);

  // 2. Actualizar perfil (PUT /usuarios/perfil)
  const handleUpdate = async (e) => {
    e.preventDefault();
    const headers = getHeaders();

    const payload = {
      email: emailEdit,
    };

    // Solo enviamos password si el usuario escribió algo
    if (passwordEdit.trim() !== "") {
      payload.password = passwordEdit;
    }

    try {
      await axios.put(`${API_URL}/usuarios/perfil`, payload, { headers });
      alert("✅ Perfil actualizado correctamente");
      setPasswordEdit(""); // Limpiar campo contraseña

      // Actualizar vista local
      setPerfil({ ...perfil, email: emailEdit });
    } catch (error) {
      alert(
        "❌ Error al actualizar perfil: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  return (
    <div className="container animate__animated animate__fadeIn">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow-lg rounded-4">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <div
                  className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="bx bx-user fs-1"></i>
                </div>
                <h3 className="fw-bold">{perfil.username}</h3>
                <span className="badge bg-secondary">{perfil.rol}</span>
              </div>

              <form onSubmit={handleUpdate}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    value={perfil.username}
                    disabled
                    readOnly
                  />
                  <div className="form-text">
                    El nombre de usuario no se puede cambiar.
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={emailEdit}
                    onChange={(e) => setEmailEdit(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Nueva Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Dejar en blanco para mantener la actual"
                    value={passwordEdit}
                    onChange={(e) => setPasswordEdit(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 rounded-pill py-2 fw-bold"
                >
                  Guardar Cambios
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
