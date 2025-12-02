import React, { useState, useEffect } from "react";
// Rutas relativas corregidas para evitar "Module not found"
import ProductoForm from "../components/ProductoForm";
import ProductoList from "../components/ProductoList";
import "../Carrito.css";

// URL de tu Backend en Render
const API_URL = "https://gamershop-backend-1.onrender.com/api/producto";

function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Helper para enviar el Token JWT en cada petición
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) return {};
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // Cargar productos al iniciar (incluyendo STOCK de la BD)
  useEffect(() => {
    const cargarProductos = async () => {
      setCargando(true);
      setError(null);
      try {
        const headers = getAuthHeaders();
        // Intentamos autenticarnos, pero si falla el token, el backend podría permitir GET público
        const config = headers.Authorization ? { headers } : {};

        const response = await fetch(API_URL, config);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error de conexión:", error);
        setError(`No se pudo conectar al servidor: ${error.message}`);
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  // Guardar nuevo producto (POST)
  const guardarProducto = async (nuevoProducto) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(nuevoProducto),
      });

      // Manejo de error 403 (Permisos)
      if (response.status === 403) {
        alert(
          "⛔ ACCESO DENEGADO: Tu usuario no tiene permisos de Administrador."
        );
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "No se pudo guardar");
      }

      const productoGuardado = await response.json();

      // Actualizamos la lista visualmente
      setProductos([...productos, productoGuardado]);
      alert("✅ Producto registrado exitosamente en la base de datos.");
    } catch (error) {
      alert(`❌ Error al guardar: ${error.message}`);
    }
  };

  // Eliminar producto (DELETE)
  const eliminarProducto = async (id) => {
    if (
      !window.confirm(
        "¿Seguro que deseas eliminar este producto de la Base de Datos?"
      )
    )
      return;

    // Actualización optimista (borramos de la vista primero)
    const backup = [...productos];
    setProductos(productos.filter((p) => p.id !== id));

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.status === 403) {
        alert("⛔ Solo los Administradores pueden eliminar.");
        setProductos(backup); // Revertimos si falla
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
    } catch (error) {
      alert(`❌ Error al eliminar: ${error.message}`);
      setProductos(backup);
    }
  };

  // KPIs
  const totalItems = productos.length;
  const valorTotal = productos.reduce((acc, item) => {
    // Si stock es null, usamos 0 para el cálculo
    const stock = item.stock || 0;
    return acc + item.precio * stock;
  }, 0);

  return (
    <div className="gamer-container py-4">
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h1 className="gamer-title m-0">
            PANEL DE CONTROL <span className="highlight">ADMIN</span>
          </h1>
          <div className="text-end">
            <span className="badge bg-dark border border-secondary p-2 me-2">
              DB: <span className="text-success">CONECTADA</span>
            </span>
            <span className="badge bg-dark border border-secondary p-2">
              Rol: ADMIN
            </span>
          </div>
        </div>

        {/* Métricas */}
        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="gamer-panel p-3 d-flex justify-content-between align-items-center">
              <h5 className="m-0 text-muted">TOTAL PRODUCTOS</h5>
              <h2 className="m-0 text-info">{totalItems}</h2>
            </div>
          </div>
          <div className="col-md-6">
            <div className="gamer-panel p-3 d-flex justify-content-between align-items-center">
              <h5 className="m-0 text-muted">VALOR INVENTARIO (USD)</h5>
              <h2 className="m-0" style={{ color: "var(--neon-pink)" }}>
                ${valorTotal.toLocaleString()}
              </h2>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Formulario */}
          <div className="col-lg-4">
            <div className="gamer-panel h-100">
              <div className="gamer-panel-header">
                <h5>⚡ Nuevo Ingreso</h5>
              </div>
              <div className="gamer-panel-body">
                <ProductoForm onGuardar={guardarProducto} />
                {error && (
                  <div className="alert alert-danger mt-3 small bg-dark text-danger border border-danger">
                    ⚠️ {error}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lista */}
          <div className="col-lg-8">
            <div className="gamer-panel h-100">
              <div className="gamer-panel-header">
                <h5>📦 Inventario en Tiempo Real</h5>
              </div>
              <div className="gamer-panel-body">
                {cargando ? (
                  <div className="text-center py-5 text-info">
                    <div className="spinner-border mb-2"></div>
                    <p>Sincronizando con AlwaysData...</p>
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
