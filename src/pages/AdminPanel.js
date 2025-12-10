import React, { useState, useEffect } from "react";
// Asegúrate de que las rutas a tus componentes sean correctas
import ProductoForm from "../components/ProductoForm";
import ProductoList from "../components/ProductoList";

// URL base de tu backend en Render
const API_URL = "https://gamershop-backend-1.onrender.com";

function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]); // Estado para categorías reales de la BD
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Helper para obtener los headers de autenticación
  const getAuthHeaders = () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return null;
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // Manejo de errores de autenticación
  const handleAuthError = () => {
    alert(
      "⚠️ Sesión expirada o permisos insuficientes. Inicia sesión nuevamente."
    );
    localStorage.clear();
    window.location.href = "/login";
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      setCargando(true);
      setError(null);

      try {
        // 1. Cargar Categorías (desde CategoriaController)
        // Esto permite que el formulario muestre las categorías reales
        try {
          const resCat = await fetch(`${API_URL}/categorias`);
          if (resCat.ok) {
            const dataCat = await resCat.json();
            setCategorias(dataCat);
          }
        } catch (e) {
          console.warn(
            "No se pudieron cargar categorías (el endpoint podría no estar listo)",
            e
          );
        }

        // 2. Cargar Productos (desde ProductoController)
        const resProd = await fetch(`${API_URL}/productos`);

        if (!resProd.ok) {
          if (resProd.status === 403) {
            handleAuthError();
            return;
          }
          throw new Error("Error al cargar productos");
        }
        const dataProd = await resProd.json();
        setProductos(dataProd);
      } catch (error) {
        console.error("Error general:", error);
        setError("Error de conexión con el servidor");
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, []);

  // --- CRUD ---

  const guardarProducto = async (productoData) => {
    const headers = getAuthHeaders();
    if (!headers) {
      handleAuthError();
      return;
    }

    try {
      // POST al endpoint de productos
      const response = await fetch(`${API_URL}/productos`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(productoData),
      });

      if (response.status === 403) {
        handleAuthError();
        return;
      }
      if (!response.ok) throw new Error("Error al guardar");

      const nuevoProd = await response.json();
      setProductos([...productos, nuevoProd]);
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

    // Optimista: borrar de la vista primero
    const backup = [...productos];
    setProductos(productos.filter((p) => p.id !== id));

    try {
      const response = await fetch(`${API_URL}/productos/${id}`, {
        method: "DELETE",
        headers,
      });

      if (response.status === 403) {
        setProductos(backup); // Revertimos cambios si falla
        handleAuthError();
        return;
      }

      if (!response.ok) throw new Error("Fallo al eliminar");
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
      setProductos(backup);
    }
  };

  // Cálculos para el dashboard
  const totalItems = productos.length;
  const valorTotal = productos.reduce(
    (acc, item) => acc + item.precio * (item.stock || 0),
    0
  );

  return (
    <div className="container py-5 mt-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h1 className="m-0 fw-bold text-body">
          PANEL <span className="text-warning">ADMIN</span>
        </h1>
        <span className="badge bg-success p-2">Conectado a API</span>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm border p-3">
            <h5 className="text-muted small fw-bold">TOTAL PRODUCTOS</h5>
            <h2 className="text-primary m-0">{totalItems}</h2>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm border p-3">
            <h5 className="text-muted small fw-bold">VALOR INVENTARIO (USD)</h5>
            <h2 className="text-success m-0">${valorTotal.toLocaleString()}</h2>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Formulario */}
        <div className="col-lg-4">
          <div className="card shadow h-100 border">
            <div className="card-header bg-body-tertiary border-bottom">
              <h5 className="m-0">⚡ Nuevo Producto</h5>
            </div>
            <div className="card-body">
              {/* Pasamos las categorías reales para que el formulario las use */}
              <ProductoForm
                onGuardar={guardarProducto}
                categoriasDisponibles={categorias}
              />
              {error && (
                <div className="alert alert-danger mt-3 small">⚠️ {error}</div>
              )}
            </div>
          </div>
        </div>

        {/* Lista */}
        <div className="col-lg-8">
          <div className="card shadow h-100 border">
            <div className="card-header bg-body-tertiary border-bottom d-flex justify-content-between align-items-center">
              <h5 className="m-0">📦 Inventario</h5>
              {cargando && (
                <div className="spinner-border spinner-border-sm text-primary"></div>
              )}
            </div>
            <div className="card-body p-0">
              <ProductoList
                productos={productos}
                onEliminar={eliminarProducto}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
