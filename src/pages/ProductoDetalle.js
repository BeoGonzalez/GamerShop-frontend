import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Asegúrate de que esta URL sea la correcta
const API_URL = "https://gamershop-backend-1.onrender.com";

function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [galeria, setGaleria] = useState([]);
  const [imagenMostrada, setImagenMostrada] = useState("");
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  // ESTADO PARA CAPTURAR EL ERROR REAL
  const [errorTecnico, setErrorTecnico] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/productos/${id}`)
      .then((res) => {
        // Analizamos el error HTTP específico
        if (res.status === 404)
          throw new Error(
            "ERROR 404: El producto con ID " +
              id +
              " no existe en la BD de Render."
          );
        if (res.status === 403)
          throw new Error(
            "ERROR 403: Acceso denegado. El SecurityConfig no se actualizó."
          );
        if (res.status === 500)
          throw new Error(
            "ERROR 500: Fallo interno del servidor (Revisa los logs de Render)."
          );
        if (!res.ok) throw new Error(`Error desconocido: ${res.status}`);

        return res.json();
      })
      .then((data) => {
        setProducto(data);
        setImagenMostrada(data.imagen);

        try {
          if (data.variantes) {
            const parsed = JSON.parse(data.variantes);
            if (Array.isArray(parsed)) setGaleria(parsed);
          }
        } catch (e) {
          console.error("Error parsing variantes", e);
          setGaleria([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        // Guardamos el mensaje de error para mostrarlo en pantalla
        setErrorTecnico(err.message);
        setLoading(false);
      });
  }, [id]);

  // ... (MANTÉN TU FUNCIÓN handleAgregarCarrito IGUAL) ...
  const handleAgregarCarrito = () => {
    /* ... tu código ... */
  };

  if (loading)
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  // --- AQUÍ MOSTRAMOS EL ERROR EN PANTALLA ---
  if (errorTecnico)
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger p-5 rounded-4 shadow">
          <h1 className="display-1">
            <i className="bx bx-bug"></i>
          </h1>
          <h3 className="fw-bold">Ocurrió un error técnico</h3>
          <p className="fs-5 text-break">{errorTecnico}</p>
          <hr />
          <p className="small">Revisa la consola (F12) o los logs de Render.</p>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline-danger mt-3"
          >
            Volver
          </button>
        </div>
      </div>
    );
  // ------------------------------------------

  if (!producto) return <div>Cargando datos...</div>;

  return (
    // ... (MANTÉN TU RETURN ORIGINAL DEL DISEÑO AQUÍ) ...
    <div className="container py-5 animate__animated animate__fadeIn">
      {/* Pega aquí todo tu diseño bonito del mensaje anterior */}
      {/* Solo asegúrate de que use las variables 'producto', 'galeria', etc. */}
      <h1>{producto.nombre}</h1>
      {/* ... resto del HTML ... */}
    </div>
  );
}

export default ProductoDetalle;
