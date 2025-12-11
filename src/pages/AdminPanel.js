import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

// --- IMPORTAMOS TUS COMPONENTES ---
import ProductoForm from "../components/ProductoForm";
import ProductoList from "../components/ProductoList";

// Componentes del Panel de Admin
import DashboardStats from "../components/admin/DashboardStats";
import DashboardCharts from "../components/admin/DashboardCharts";
import UsersManager from "../components/admin/UsersManager";
import CategoriesManager from "../components/admin/CategoriesManager";
import OrdersView from "../components/admin/OrdersView";
import ProfileView from "../components/admin/ProfileView";

// URL base de tu backend
const API_URL = "https://gamershop-backend-1.onrender.com";

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [ordenes, setOrdenes] = useState([]);

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // --- NUEVO ESTADO PARA MENSAJES DE ÉXITO ---
  const [mensajeExito, setMensajeExito] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return null;
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const handleAuthError = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // --- HELPER PARA MOSTRAR ÉXITO TEMPORAL ---
  const mostrarExito = (mensaje) => {
    setMensajeExito(mensaje);
    // El mensaje desaparece a los 3 segundos
    setTimeout(() => {
      setMensajeExito(null);
    }, 3000);
  };

  // ==========================================
  // 1. CARGA DE DATOS
  // ==========================================
  const fetchData = useCallback(async () => {
    setCargando(true);
    const headers = getAuthHeaders();

    if (!headers) {
      handleAuthError();
      return;
    }

    try {
      const resProd = await fetch(`${API_URL}/productos`);
      if (resProd.ok) setProductos(await resProd.json());

      const resCat = await fetch(`${API_URL}/categorias`);
      if (resCat.ok) setCategorias(await resCat.json());

      try {
        const resUser = await axios.get(`${API_URL}/usuarios`, { headers });
        setUsuarios(resUser.data);
      } catch (e) {
        console.warn("Error cargando usuarios", e);
      }

      try {
        const resOrd = await axios.get(`${API_URL}/ordenes`, { headers });
        setOrdenes(resOrd.data);
      } catch (e) {
        console.warn("Error cargando órdenes", e);
      }
    } catch (err) {
      console.error("Error general:", err);
      setError("Error de conexión con el servidor.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ==========================================
  // 2. ACCIONES DE PRODUCTOS
  // ==========================================

  const handleActualizarStock = async (id, nuevoStock) => {
    const headers = getAuthHeaders();
    try {
      const cantidadNumerica = parseInt(nuevoStock, 10);

      if (isNaN(cantidadNumerica)) {
        alert("Por favor ingresa un número válido.");
        return;
      }

      await axios.put(`${API_URL}/productos/${id}/stock`, null, {
        params: { cantidad: cantidadNumerica },
        headers,
      });

      // --- MENSAJE DE ÉXITO AL ACTUALIZAR STOCK ---
      mostrarExito("✅ Stock modificado correctamente.");
      fetchData();
    } catch (e) {
      console.error("Error detallado al actualizar stock:", e);
      const mensajeBackend = e.response?.data || e.message;
      alert(`Error al actualizar stock: ${mensajeBackend}`);
    }
  };

  const guardarProducto = async (data) => {
    const headers = getAuthHeaders();
    try {
      await axios.post(`${API_URL}/productos`, data, { headers });

      // --- MENSAJE DE ÉXITO AL CREAR PRODUCTO ---
      mostrarExito("✅ Producto agregado correctamente.");
      fetchData();
    } catch (e) {
      console.error(e);
      alert(
        "Error al guardar producto: " +
          (e.response?.data || "Error desconocido")
      );
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Borrar este producto?")) return;
    const headers = getAuthHeaders();
    try {
      await axios.delete(`${API_URL}/productos/${id}`, { headers });
      mostrarExito("🗑️ Producto eliminado.");
      fetchData();
    } catch (e) {
      alert("Error al eliminar");
    }
  };

  // ==========================================
  // 3. OTRAS ACCIONES
  // ==========================================
  const handleAddCategory = async (data) => {
    const headers = getAuthHeaders();
    try {
      await axios.post(`${API_URL}/categorias`, data, { headers });
      mostrarExito("Categoría creada.");
      fetchData();
    } catch (e) {
      alert("Error al crear categoría");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("¿Borrar categoría?")) return;
    const headers = getAuthHeaders();
    try {
      await axios.delete(`${API_URL}/categorias/${id}`, { headers });
      fetchData();
    } catch (e) {
      alert("Error al eliminar categoría");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    const headers = getAuthHeaders();
    try {
      await axios.delete(`${API_URL}/usuarios/${id}`, { headers });
      mostrarExito("Usuario eliminado.");
      fetchData();
    } catch (e) {
      alert("Error al eliminar usuario.");
    }
  };

  // ==========================================
  // RENDERIZADO
  // ==========================================
  return (
    <div className="d-flex" style={{ minHeight: "calc(100vh - 80px)" }}>
      {/* SIDEBAR */}
      <div
        className="bg-body-tertiary border-end p-3 d-flex flex-column"
        style={{ width: "250px", minHeight: "100%" }}
      >
        <h5 className="fw-bold mb-4 px-2 text-primary d-flex align-items-center gap-2">
          <i className="bx bxs-dashboard"></i> AdminPanel
        </h5>

        <div className="nav flex-column nav-pills gap-2">
          <button
            className={`nav-link text-start ${
              activeTab === "dashboard" ? "active" : ""
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <i className="bx bx-bar-chart-alt-2 me-2"></i> Dashboard
          </button>
          <button
            className={`nav-link text-start ${
              activeTab === "products" ? "active" : ""
            }`}
            onClick={() => setActiveTab("products")}
          >
            <i className="bx bx-cube me-2"></i> Productos
          </button>
          <button
            className={`nav-link text-start ${
              activeTab === "categories" ? "active" : ""
            }`}
            onClick={() => setActiveTab("categories")}
          >
            <i className="bx bx-category me-2"></i> Categorías
          </button>
          <button
            className={`nav-link text-start ${
              activeTab === "orders" ? "active" : ""
            }`}
            onClick={() => setActiveTab("orders")}
          >
            <i className="bx bx-receipt me-2"></i> Ventas
          </button>
          <button
            className={`nav-link text-start ${
              activeTab === "users" ? "active" : ""
            }`}
            onClick={() => setActiveTab("users")}
          >
            <i className="bx bx-user-circle me-2"></i> Usuarios
          </button>
          <hr />
          <button
            className={`nav-link text-start ${
              activeTab === "profile" ? "active" : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <i className="bx bx-id-card me-2"></i> Mi Perfil
          </button>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="flex-grow-1 p-4 bg-body" style={{ overflowY: "auto" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-capitalize">
            {activeTab === "orders" ? "Boletas & Ventas" : activeTab}
          </h2>
          {cargando && (
            <div className="spinner-border spinner-border-sm text-primary"></div>
          )}
        </div>

        {/* --- AQUÍ ESTÁ LA NUEVA ALERTA DE ÉXITO --- */}
        {mensajeExito && (
          <div className="alert alert-success d-flex align-items-center mb-4 rounded-4 shadow-sm animate__animated animate__fadeInDown">
            <i className="bx bx-check-circle fs-4 me-2"></i>
            <div className="fw-bold">{mensajeExito}</div>
          </div>
        )}

        {/* Alerta de Error */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center mb-4 rounded-4 shadow-sm">
            <i className="bx bx-error-circle fs-4 me-2"></i>
            <div>{error}</div>
          </div>
        )}

        {/* VISTAS */}
        {activeTab === "dashboard" && (
          <>
            <DashboardStats
              productos={productos}
              ordenes={ordenes}
              usuarios={usuarios}
            />
            <DashboardCharts ordenes={ordenes} productos={productos} />
          </>
        )}

        {activeTab === "products" && (
          <div className="row g-4 animate__animated animate__fadeIn">
            <div className="col-lg-4">
              <div className="card border-0 shadow-lg rounded-4 h-100">
                <div className="card-header bg-transparent border-0 pt-4 ps-4">
                  <h5 className="m-0 fw-bold d-flex align-items-center gap-2">
                    <i className="bx bx-plus-circle text-primary"></i> Nuevo
                  </h5>
                </div>
                <div className="card-body p-4">
                  <ProductoForm
                    onGuardar={guardarProducto}
                    categoriasDisponibles={categorias}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <ProductoList
                productos={productos}
                onEliminar={eliminarProducto}
                onActualizarStock={handleActualizarStock}
              />
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <CategoriesManager
            categorias={categorias}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}

        {activeTab === "orders" && <OrdersView ordenes={ordenes} />}

        {activeTab === "users" && (
          <UsersManager usuarios={usuarios} onDeleteUser={handleDeleteUser} />
        )}

        {activeTab === "profile" && <ProfileView />}
      </div>
    </div>
  );
}

export default AdminPanel;
