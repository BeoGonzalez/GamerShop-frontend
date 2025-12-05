import React, { useState, useEffect } from "react";
import ProductoForm from "../components/ProductoForm";
import ProductoList from "../components/ProductoList";

const API_URL = "https://gamershop-backend-1.onrender.com/productos";

function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // --- NUEVO: Extraer categorías únicas ---
  // Creamos un Set para eliminar duplicados y luego lo convertimos a Array
  const categoriasDisponibles = [
    "Consolas",
    "Juegos",
    "Accesorios",
    "PC", // Categorías base
    ...new Set(productos.map((p) => p.categoria).filter(Boolean)), // + Categorías existentes en la BD
  ];
  // Eliminamos duplicados finales (por si "Consolas" ya estaba en la BD)
  const categoriasUnicas = [...new Set(categoriasDisponibles)];

  // ... (El resto de funciones getAuthHeaders, handleAuthError, useEffect, guardarProducto, eliminarProducto siguen IGUAL) ...
  // Solo copio las partes que cambian para no hacer el código gigante innecesariamente.

  const getAuthHeaders = () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return null;
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const handleAuthError = () => {
    alert(
      "⚠️ Sesión expirada o permisos insuficientes. Inicia sesión nuevamente."
    );
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  useEffect(() => {
    const cargarProductos = async () => {
      setCargando(true);
      setError(null);
      const headers = getAuthHeaders();
      try {
        const config = headers ? { headers } : {};
        const response = await fetch(API_URL, config);
        if (!response.ok) {
          if (response.status === 403) {
            handleAuthError();
            return;
          }
          throw new Error(`Error ${response.status}`);
        }
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };
    cargarProductos();
  }, []);

  const guardarProducto = async (nuevoProducto) => {
    const headers = getAuthHeaders();
    if (!headers) {
      handleAuthError();
      return;
    }
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(nuevoProducto),
      });
      if (response.status === 403) {
        handleAuthError();
        return;
      }
      if (!response.ok) throw new Error("Error al guardar");
      const productoGuardado = await response.json();
      setProductos([...productos, productoGuardado]);
      alert("✅ Producto registrado exitosamente.");
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Eliminar producto?")) return;
    const headers = getAuthHeaders();
    if (!headers) {
      handleAuthError();
      return;
    }
    const backup = [...productos];
    setProductos(productos.filter((p) => p.id !== id));
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers,
      });
      if (response.status === 403) {
        handleAuthError();
        return;
      }
      if (!response.ok) throw new Error("Error al eliminar");
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
      setProductos(backup);
    }
  };

  const totalItems = productos.length;
  const valorTotal = productos.reduce(
    (acc, item) => acc + item.precio * item.stock,
    0
  );

  return (
    <div className="container py-5 mt-5">
      <div className="d-flex justify-content-between align-items-center mb-5 text-white">
        <h1 className="m-0 fw-bold">
          PANEL <span className="text-warning">ADMIN</span>
        </h1>
        <span className="badge bg-success p-2">Conectado a API</span>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card bg-dark text-white border-secondary p-3 shadow-sm">
            <h5 className="text-muted small fw-bold">TOTAL PRODUCTOS</h5>
            <h2 className="text-info m-0">{totalItems}</h2>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card bg-dark text-white border-secondary p-3 shadow-sm">
            <h5 className="text-muted small fw-bold">VALOR INVENTARIO (USD)</h5>
            <h2 className="text-warning m-0">${valorTotal.toLocaleString()}</h2>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card bg-dark text-white border-secondary h-100 shadow">
            <div className="card-header border-secondary bg-black bg-opacity-25">
              <h5 className="m-0">⚡ Nuevo Producto</h5>
            </div>
            <div className="card-body">
              {/* CAMBIO: Pasamos la lista de categorías al formulario */}
              <ProductoForm
                onGuardar={guardarProducto}
                categoriasDisponibles={categoriasUnicas}
              />
              {error && (
                <div className="alert alert-danger mt-3 small">⚠️ {error}</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card bg-dark text-white border-secondary h-100 shadow">
            <div className="card-header border-secondary bg-black bg-opacity-25 d-flex justify-content-between align-items-center">
              <h5 className="m-0">📦 Inventario</h5>
              {cargando && (
                <div className="spinner-border spinner-border-sm text-info"></div>
              )}
            </div>
            <div className="card-body p-0">
              {cargando && productos.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">Cargando...</p>
                </div>
              ) : (
                <div className="p-3">
                  <ProductoList
                    productos={productos}
                    onEliminar={eliminarProducto}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
