import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "https://gamershop-backend-1.onrender.com";

function MisCompras() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = localStorage.getItem("username");
    const token = localStorage.getItem("jwt_token");

    if (!usuario || !token) {
      alert("Inicia sesión para ver tus compras");
      navigate("/login");
      return;
    }

    // Petición al endpoint que ya creaste en OrdenController
    axios
      .get(`${API_URL}/ordenes/mis-compras/${usuario}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrdenes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  return (
    <div className="container py-5 animate__animated animate__fadeIn">
      <h2 className="fw-bold mb-4">
        <i className="bx bx-history"></i> Historial de Compras
      </h2>

      {ordenes.length === 0 ? (
        <div className="alert alert-info text-center rounded-4 p-5">
          <h4>Aún no has realizado compras</h4>
          <Link to="/" className="btn btn-primary mt-3 rounded-pill">
            Ir a la Tienda
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {ordenes.map((orden) => (
            <div key={orden.id} className="col-12">
              <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                  <div>
                    <span className="fw-bold text-primary">
                      Orden #{orden.id}
                    </span>
                    <span className="mx-2 text-muted">|</span>
                    <small className="text-muted">{orden.fecha}</small>
                  </div>
                  <span
                    className={`badge rounded-pill ${
                      orden.estado === "PAGADO"
                        ? "bg-success"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {orden.estado}
                  </span>
                </div>
                <div className="card-body">
                  <h6 className="text-muted small text-uppercase mb-3">
                    Resumen de productos:
                  </h6>
                  <ul className="list-group list-group-flush mb-3">
                    {orden.productosResumen &&
                      orden.productosResumen.map((prod, index) => (
                        <li
                          key={index}
                          className="list-group-item px-0 border-0 py-1"
                        >
                          <i className="bx bx-package me-2 text-secondary"></i>{" "}
                          {prod}
                        </li>
                      ))}
                  </ul>
                  <hr className="opacity-25" />
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Total Pagado:</span>
                    <span className="fs-4 fw-bold text-dark">
                      ${orden.total?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MisCompras;
