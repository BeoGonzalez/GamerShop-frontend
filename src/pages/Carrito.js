import React, { useState, useEffect } from "react";
import ProductoForm from "../components/ProductoForm";
import ProductoList from "../components/ProductoList";
import "../Carrito.css"; // <--- IMPORTANTE: Importa tu nuevo CSS aquí

const API_URL = "https://gamershop-backend-1.onrender.com/carrito";

function Carrito() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    setCargando(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error de conexión con el servidor");
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error:", error);
      setError("No se pudo sincronizar con la base de datos.");
    } finally {
      setCargando(false);
    }
  };

  const guardarProducto = async (nuevoProducto) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProducto),
      });

      if (!response.ok) throw new Error("Falló el guardado");
      const productoGuardado = await response.json();

      // Actualización optimista (más rápida)
      setProductos((prev) => [...prev, productoGuardado]);
    } catch (error) {
      alert(`❌ SYSTEM ERROR: ${error.message}`);
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Confirmar eliminación del sistema?")) return;

    const backup = [...productos];
    setProductos(productos.filter((p) => p.id !== id)); // Borrado visual inmediato

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error al eliminar del backend");
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
      setProductos(backup); // Revertir si falla
    }
  };

  return (
    <div className="gamer-container py-5">
      <div className="container">
        <h1 className="mb-5 text-center gamer-title">
          ⚙️ GameZone <span className="highlight">System Manager</span>
        </h1>

        <div className="row g-5">
          {/* Columna Izquierda: Panel de Ingreso */}
          <div className="col-lg-4">
            <div className="gamer-panel h-100">
              <div className="gamer-panel-header">
                <h5>⚡ Ingreso de Datos</h5>
              </div>
              <div className="gamer-panel-body">
                <ProductoForm onGuardar={guardarProducto} />
                {error && (
                  <div className="alert alert-danger mt-3 bg-transparent border-danger text-danger">
                    ⚠️ {error}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Inventario */}
          <div className="col-lg-8">
            <div className="gamer-panel h-100">
              <div className="gamer-panel-header d-flex justify-content-between align-items-center">
                <h4>📦 Inventario Actual</h4>
                <span className="badge bg-dark border border-info text-info">
                  Items: {productos.length}
                </span>
              </div>
              <div className="gamer-panel-body">
                {cargando ? (
                  <div className="d-flex justify-content-center py-5 align-items-center flex-column">
                    <div
                      className="spinner-border text-info mb-3"
                      role="status"
                      style={{ width: "3rem", height: "3rem" }}
                    ></div>
                    <p className="text-info">Sincronizando datos...</p>
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

export default Carrito;
