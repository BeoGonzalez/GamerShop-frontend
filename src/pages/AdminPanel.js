import React, { useState, useEffect } from "react";
import ProductoForm from "../components/ProductoForm";
import ProductoList from "../components/ProductoList";
import "../Carrito.css"; // Mantenemos el estilo Gamer

const API_URL = "https://gamershop-backend-1.onrender.com/api/producto";

function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Helper para obtener cabeceras con Token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    setCargando(true);
    try {
      const response = await fetch(API_URL, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error("Error cargando datos");
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      setError("Error de conexión con la base de datos.");
    } finally {
      setCargando(false);
    }
  };

  const guardarProducto = async (nuevoProducto) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(nuevoProducto),
      });
      if (!response.ok) throw new Error("No se pudo guardar");

      const productoGuardado = await response.json();
      setProductos([...productos, productoGuardado]);
      alert("✅ Producto registrado en el sistema.");
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿CONFIRMAR ELIMINACIÓN DE BASE DE DATOS?")) return;

    // Optimistic UI update
    const backup = [...productos];
    setProductos(productos.filter((p) => p.id !== id));

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Fallo al eliminar");
    } catch (error) {
      alert("❌ Error: " + error.message);
      setProductos(backup);
    }
  };

  // Cálculos para el Dashboard (KPIs)
  const totalItems = productos.length;
  const valorTotal = productos.reduce((acc, item) => acc + item.precio, 0);

  return (
    <div className="gamer-container py-4">
      <div className="container">
        {/* Header del Dashboard */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h1 className="gamer-title m-0">
            Gestión de prodctos <span className="highlight">Gamers</span>
          </h1>
          <div className="text-end">
            <span className="badge bg-dark border border-secondary p-2 me-2">
              Estado: <span className="text-success">ONLINE</span>
            </span>
            <span className="badge bg-dark border border-secondary p-2">
              Usuario: ADMIN
            </span>
          </div>
        </div>

        {/* KPIs (Métricas Rápidas) */}
        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="gamer-panel p-3 d-flex justify-content-between align-items-center">
              <h5 className="m-0 text-muted">TOTAL ITEMS</h5>
              <h2 className="m-0 text-info">{totalItems}</h2>
            </div>
          </div>
          <div className="col-md-6">
            <div className="gamer-panel p-3 d-flex justify-content-between align-items-center">
              <h5 className="m-0 text-muted">VALOR INVENTARIO</h5>
              <h2 className="m-0" style={{ color: "var(--neon-pink)" }}>
                ${valorTotal}
              </h2>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Panel Izquierdo: Formulario */}
          <div className="col-lg-4">
            <div className="gamer-panel h-100">
              <div className="gamer-panel-header">
                <h5>⚡ Registrar Nuevo Item</h5>
              </div>
              <div className="gamer-panel-body">
                <ProductoForm onGuardar={guardarProducto} />
                {error && (
                  <div className="alert alert-danger mt-3 small">{error}</div>
                )}
              </div>
            </div>
          </div>

          {/* Panel Derecho: Lista */}
          <div className="col-lg-8">
            <div className="gamer-panel h-100">
              <div className="gamer-panel-header">
                <h5>📦 Gestión de Base de Datos</h5>
              </div>
              <div className="gamer-panel-body">
                {cargando ? (
                  <div className="text-center py-5 text-info">
                    <div className="spinner-border mb-2"></div>
                    <p>Accediendo a servidores...</p>
                  </div>
                ) : (
                  <ProductoList
                    productos={productos}
                    onEliminar={eliminarProducto}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
