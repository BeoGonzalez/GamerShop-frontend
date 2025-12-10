import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ProductoForm from "../components/ProductoForm";
import ProductoList from "../components/ProductoList";

// URL base de tu backend
const API_URL = "https://gamershop-backend-1.onrender.com";

function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Helper para headers con JWT
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
    localStorage.clear();
    window.location.href = "/login";
  };

  // Función de carga de productos
  const fetchProductos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
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
      console.error("Error cargando productos:", error);
      setError("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  }, []);

  // Cargar Categorías (solo una vez)
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const resCat = await fetch(`${API_URL}/categorias`);
        if (resCat.ok) {
          const dataCat = await resCat.json();
          setCategorias(dataCat);
        }
      } catch (e) {
        console.warn("No se pudieron cargar categorías", e);
      }
    };

    fetchCategorias();
    fetchProductos(); // Llamada inicial
  }, [fetchProductos]);

  // --- LÓGICA DE ACTUALIZAR STOCK (ESTA ES LA CLAVE) ---
  const handleActualizarStock = async (id, nuevoStock) => {
    // 1. Verificamos Token
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      handleAuthError();
      return;
    }

    try {
      // 2. Enviamos el NUEVO valor absoluto
      await axios.put(`${API_URL}/productos/${id}/stock`, null, {
        params: { cantidad: nuevoStock },
        headers: { Authorization: `Bearer ${token}` },
      });

      // Recargamos la lista para confirmar el cambio
      fetchProductos();
    } catch (error) {
      console.error("Error actualizando stock:", error);
      if (error.response && error.response.status === 403) {
        alert("⛔ Acceso denegado.");
      } else {
        alert("❌ No se pudo guardar el stock.");
      }
    }
  };

  // --- CRUD: Guardar Producto ---
  const guardarProducto = async (productoData) => {
    const headers = getAuthHeaders();
    if (!headers) {
      handleAuthError();
      return;
    }

    try {
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

      alert("✅ Producto registrado exitosamente.");
      fetchProductos();
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  // --- CRUD: Eliminar Producto ---
  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Eliminar producto?")) return;

    const headers = getAuthHeaders();
    if (!headers) {
      handleAuthError();
      return;
    }

    // Optimista
    const backup = [...productos];
    setProductos(productos.filter((p) => p.id !== id));

    try {
      const response = await fetch(`${API_URL}/productos/${id}`, {
        method: "DELETE",
        headers,
      });

      if (response.status === 403) {
        setProductos(backup);
        handleAuthError();
        return;
      }
      if (!response.ok) throw new Error("Fallo al eliminar");
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
      setProductos(backup);
    }
  };

  // Cálculos
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
        <div className="col-lg-4">
          <div className="card shadow h-100 border">
            <div className="card-header bg-body-tertiary border-bottom">
              <h5 className="m-0">⚡ Nuevo Producto</h5>
            </div>
            <div className="card-body">
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

        <div className="col-lg-8">
          <div className="card shadow h-100 border">
            <div className="card-header bg-body-tertiary border-bottom d-flex justify-content-between align-items-center">
              <h5 className="m-0">📦 Inventario</h5>
              {cargando && (
                <div className="spinner-border spinner-border-sm text-primary"></div>
              )}
            </div>
            <div className="card-body p-0">
              {/* AQUÍ ESTÁ LA CORRECCIÓN CLAVE: */}
              <ProductoList
                productos={productos}
                onEliminar={eliminarProducto}
                onActualizarStock={handleActualizarStock}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
