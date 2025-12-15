import React, { useState } from "react";
import axios from "axios";

const API_URL = "https://gamershop-backend-1.onrender.com";

// Recibimos 'ordenes' y la función 'onRefresh' desde AdminPanel
const OrdersView = ({ ordenes = [], onRefresh }) => {
  const [procesando, setProcesando] = useState(false);

  // --- CORRECCIÓN: Usar "jwt_token" ---
  const getHeaders = () => {
    const token = localStorage.getItem("jwt_token");
    return token ? { Authorization: `Bearer ${token}` } : null;
  };

  // 1. CAMBIAR ESTADO
  const handleEstadoChange = async (id, nuevoEstado) => {
    const headers = getHeaders();
    if (!headers) return alert("No hay sesión activa");

    setProcesando(true);
    try {
      await axios.put(
        `${API_URL}/ordenes/${id}`,
        { estado: nuevoEstado },
        { headers }
      );

      alert(`✅ Estado actualizado a ${nuevoEstado}`);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error(error);
      alert("❌ Error al actualizar estado");
    } finally {
      setProcesando(false);
    }
  };

  // 2. ELIMINAR ORDEN
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "⚠️ ¿Eliminar orden?\n\n¡Esto devolverá el stock a los productos!"
      )
    )
      return;

    const headers = getHeaders();
    if (!headers) return alert("No hay sesión activa");

    setProcesando(true);

    try {
      await axios.delete(`${API_URL}/ordenes/${id}`, { headers });
      alert("🗑️ Orden eliminada y stock restaurado.");
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error(error);
      alert("❌ Error al eliminar orden");
    } finally {
      setProcesando(false);
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case "PAGADO":
        return "success";
      case "ENVIADO":
        return "primary";
      case "ENTREGADO":
        return "dark";
      case "CANCELADO":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <div className="card border-0 shadow-lg rounded-4 animate__animated animate__fadeIn">
      <div className="card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
        <h5 className="fw-bold text-primary mb-0">
          <i className="bx bx-package"></i> Gestión de Pedidos
        </h5>
        <span className="badge bg-light text-dark border">
          {ordenes.length} Órdenes
        </span>
      </div>

      <div className="card-body px-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">ID</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado Actual</th>
                <th className="text-end pe-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.length > 0 ? (
                ordenes.map((orden) => (
                  <tr key={orden.id}>
                    <td className="ps-4 fw-bold text-muted">#{orden.id}</td>

                    <td>
                      <div className="d-flex flex-column">
                        <span className="fw-bold">{orden.username}</span>
                        <small
                          className="text-muted"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {orden.cantidadItems} items
                        </small>
                      </div>
                    </td>

                    <td className="text-muted small">
                      {orden.fecha
                        ? new Date(orden.fecha).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="fw-bold text-success">
                      ${orden.total?.toLocaleString()}
                    </td>

                    <td>
                      <span
                        className={`badge rounded-pill bg-${getStatusColor(
                          orden.estado
                        )}`}
                      >
                        {orden.estado}
                      </span>
                    </td>

                    <td className="text-end pe-4">
                      <div className="d-flex justify-content-end gap-2">
                        <select
                          className="form-select form-select-sm"
                          style={{ width: "130px", fontSize: "0.85rem" }}
                          value={orden.estado}
                          onChange={(e) =>
                            handleEstadoChange(orden.id, e.target.value)
                          }
                          disabled={procesando}
                        >
                          <option value="PAGADO">🟢 PAGADO</option>
                          <option value="ENVIADO">🚚 ENVIADO</option>
                          <option value="ENTREGADO">🏠 ENTREGADO</option>
                          <option value="CANCELADO">❌ CANCELADO</option>
                        </select>

                        <button
                          onClick={() => handleDelete(orden.id)}
                          className="btn btn-sm btn-outline-danger border-0"
                          title="Eliminar y devolver stock"
                          disabled={procesando}
                        >
                          <i className="bx bx-trash fs-5"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <i className="bx bx-notepad fs-1 mb-2"></i>
                    <p className="mb-0">No hay órdenes registradas.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersView;
