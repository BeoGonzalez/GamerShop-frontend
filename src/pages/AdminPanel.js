import React, { useState, useEffect } from "react";
// Rutas relativas
import ProductoForm from "../components/ProductoForm";
import ProductoList from "../components/ProductoList";
// import "../Carrito.css";

// Asegúrate de que esta URL sea correcta.
// Si tu backend no tiene un ProductoController mapeado a /productos, esto dará 404, pero aquí manejamos el 403.
const API_URL = "https://gamershop-backend-1.onrender.com/productos";

function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Helper para enviar el Token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return null; // Retornamos null si no hay token
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // Función para manejar errores de sesión (403)
  const handleAuthError = () => {
    alert(
      "⚠️ Tu sesión ha expirado o no tienes permisos. Por favor inicia sesión nuevamente."
    );
    localStorage.removeItem("jwt_token"); // Borramos el token malo
    localStorage.removeItem("username");
    window.location.href = "/login"; // Forzamos la recarga hacia el login
  };

  // Cargar productos al iniciar
  useEffect(() => {
    const cargarProductos = async () => {
      setCargando(true);
      setError(null);

      const headers = getAuthHeaders();

      // Si no hay token, mandamos al login directamente
      if (!headers) {
        handleAuthError();
        return;
      }

      try {
        const response = await fetch(API_URL, { headers });

        if (!response.ok) {
          // Si el backend dice 403 Forbidden, el token no sirve
          if (response.status === 403) {
            handleAuthError();
            return;
          }
          throw new Error(`Error del servidor: ${response.status}`);
        }

        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error cargando productos:", error);
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  // Guardar nuevo producto
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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "No se pudo guardar");
      }

      const productoGuardado = await response.json();
      setProductos([...productos, productoGuardado]);
      alert("✅ Producto registrado exitosamente.");
    } catch (error) {
      alert(`❌ Error al guardar: ${error.message}`);
    }
  };

  // Eliminar producto
  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

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
        headers: headers,
      });

      if (response.status === 403) {
        handleAuthError();
        return;
      }

      if (!response.ok) {
        throw new Error("Error al eliminar");
      }
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
      setProductos(backup);
    }
  };

  // Cálculos visuales
  const totalItems = productos.length;
  const valorTotal = productos.reduce((acc, item) => {
    const stock = item.stock || 0;
    return acc + item.precio * stock;
  }, 0);

  return (
    <div className="container py-5 mt-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-5 text-white">
        <h1 className="m-0 fw-bold">
          PANEL DE CONTROL <span className="text-warning">ADMIN</span>
        </h1>
        <div className="text-end">
          <span className="badge bg-success p-2">Conexión Segura</span>
        </div>
      </div>

      {/* Métricas */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card bg-dark text-white border-secondary p-3">
            <h5 className="text-muted">TOTAL PRODUCTOS</h5>
            <h2 className="text-info m-0">{totalItems}</h2>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card bg-dark text-white border-secondary p-3">
            <h5 className="text-muted">VALOR INVENTARIO (USD)</h5>
            <h2 className="text-warning m-0">${valorTotal.toLocaleString()}</h2>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Formulario */}
        <div className="col-lg-4">
          <div className="card bg-dark text-white border-secondary h-100">
            <div className="card-header border-secondary">
              <h5 className="m-0">⚡ Nuevo Producto</h5>
            </div>
            <div className="card-body">
              <ProductoForm onGuardar={guardarProducto} />
              {error && (
                <div className="alert alert-danger mt-3 small">⚠️ {error}</div>
              )}
            </div>
          </div>
        </div>

        {/* Lista */}
        <div className="col-lg-8">
          <div className="card bg-dark text-white border-secondary h-100">
            <div className="card-header border-secondary">
              <h5 className="m-0">📦 Inventario</h5>
            </div>
            <div className="card-body">
              {cargando ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-info mb-2"></div>
                  <p>Verificando credenciales y cargando datos...</p>
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
  );
}

export default AdminPanel;
