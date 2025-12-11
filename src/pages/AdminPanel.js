import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

// --- IMPORTAMOS TUS COMPONENTES (Asegúrate de tenerlos en las carpetas correctas) ---
import ProductoForm from "../components/ProductoForm";
import ProductoList from "../components/ProductoList";

// Componentes del Panel de Admin (Creados anteriormente)
import DashboardStats from "../components/admin/DashboardStats";
import DashboardCharts from "../components/admin/DashboardCharts";
import UsersManager from "../components/admin/UsersManager";
import CategoriesManager from "../components/admin/CategoriesManager";
import OrdersView from "../components/admin/OrdersView";
import ProfileView from "../components/admin/ProfileView";

// URL base de tu backend
const API_URL = "https://gamershop-backend-1.onrender.com";

function AdminPanel() {
  // Estado para controlar la pestaña activa (Sidebar)
  const [activeTab, setActiveTab] = useState("dashboard");

  // Estados de Datos
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]); // Usuarios reales de la BD
  const [ordenes, setOrdenes] = useState([]); // Boletas reales de la BD

  // Estados de UI
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // --- HELPER: OBTENER HEADERS CON TOKEN ---
  const getAuthHeaders = () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return null;
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // --- HELPER: MANEJAR ERROR DE AUTH ---
  const handleAuthError = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // ==========================================
  // 1. CARGA DE DATOS MAESTRA (FetchData)
  // ==========================================
  const fetchData = useCallback(async () => {
    setCargando(true);
    const headers = getAuthHeaders();

    if (!headers) {
      handleAuthError();
      return;
    }

    try {
      // A. Cargar Productos
      const resProd = await fetch(`${API_URL}/productos`);
      if (resProd.ok) setProductos(await resProd.json());

      // B. Cargar Categorías
      const resCat = await fetch(`${API_URL}/categorias`);
      if (resCat.ok) setCategorias(await resCat.json());

      // C. Cargar Usuarios (Desde tu UsuarioController actualizado)
      try {
        const resUser = await axios.get(`${API_URL}/usuarios`, { headers });
        setUsuarios(resUser.data);
      } catch (e) {
        console.warn("Error cargando usuarios (¿Eres Admin?)", e);
      }

      // D. Cargar Órdenes / Boletas (Desde tu OrdenController actualizado)
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

  // Cargar todo al iniciar el componente
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ==========================================
  // 2. ACCIONES DEL CRUD DE PRODUCTOS
  // ==========================================
  const handleActualizarStock = async (id, nuevoStock) => {
    const headers = getAuthHeaders();
    try {
      await axios.put(`${API_URL}/productos/${id}/stock`, null, {
        params: { cantidad: nuevoStock },
        headers,
      });
      fetchData(); // Recargar datos
    } catch (e) {
      alert("Error al actualizar stock");
    }
  };

  const guardarProducto = async (data) => {
    const headers = getAuthHeaders();
    try {
      await axios.post(`${API_URL}/productos`, data, { headers });
      alert("✅ Producto guardado");
      fetchData();
    } catch (e) {
      alert("Error al guardar producto");
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Borrar este producto?")) return;
    const headers = getAuthHeaders();
    try {
      await axios.delete(`${API_URL}/productos/${id}`, { headers });
      fetchData();
    } catch (e) {
      alert("Error al eliminar");
    }
  };

  // ==========================================
  // 3. ACCIONES DE CATEGORÍAS
  // ==========================================
  const handleAddCategory = async (data) => {
    const headers = getAuthHeaders();
    try {
      await axios.post(`${API_URL}/categorias`, data, { headers });
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

  // ==========================================
  // 4. ACCIONES DE USUARIOS
  // ==========================================
  const handleDeleteUser = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    const headers = getAuthHeaders();
    try {
      await axios.delete(`${API_URL}/usuarios/${id}`, { headers });
      fetchData();
    } catch (e) {
      alert("Error al eliminar usuario. Puede que tenga compras asociadas.");
    }
  };

  // ==========================================
  // RENDERIZADO (VISTA)
  // ==========================================
  return (
    <div className="d-flex" style={{ minHeight: "calc(100vh - 80px)" }}>
      {/* --- SIDEBAR IZQUIERDO --- */}
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

      {/* --- CONTENIDO PRINCIPAL (DERECHA) --- */}
      <div className="flex-grow-1 p-4 bg-body" style={{ overflowY: "auto" }}>
        {/* Header Dinámico */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-capitalize">
            {activeTab === "orders" ? "Boletas & Ventas" : activeTab}
          </h2>
          {cargando && (
            <div className="spinner-border spinner-border-sm text-primary"></div>
          )}
        </div>

        {/* Alertas de Error */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center mb-4 rounded-4 shadow-sm">
            <i className="bx bx-error-circle fs-4 me-2"></i>
            <div>{error}</div>
          </div>
        )}

        {/* --- VISTAS SEGÚN LA PESTAÑA ACTIVA --- */}

        {/* 1. DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            <DashboardStats
              productos={productos}
              ordenes={ordenes}
              usuarios={usuarios}
            />
            {/* Gráficos conectados a los datos reales */}
            <DashboardCharts ordenes={ordenes} productos={productos} />
          </>
        )}

        {/* 2. PRODUCTOS */}
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

        {/* 3. CATEGORÍAS */}
        {activeTab === "categories" && (
          <CategoriesManager
            categorias={categorias}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}

        {/* 4. VENTAS (BOLETAS) */}
        {activeTab === "orders" && <OrdersView ordenes={ordenes} />}

        {/* 5. USUARIOS */}
        {activeTab === "users" && (
          <UsersManager usuarios={usuarios} onDeleteUser={handleDeleteUser} />
        )}

        {/* 6. PERFIL */}
        {activeTab === "profile" && <ProfileView />}
      </div>
    </div>
  );
}

export default AdminPanel;
