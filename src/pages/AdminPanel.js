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
  // --- ESTADOS (Aquí es donde se define activeTab) ---
  const [activeTab, setActiveTab] = useState("dashboard");

  // Estados de Datos
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [ordenes, setOrdenes] = useState([]);

  // Estados de UI
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

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

  const mostrarExito = (mensaje) => {
    setMensajeExito(mensaje);
    setTimeout(() => {
      setMensajeExito(null);
    }, 3000);
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

      // C. Cargar Usuarios
      try {
        const resUser = await axios.get(`${API_URL}/usuarios`, { headers });
        setUsuarios(resUser.data);
      } catch (e) {
        console.warn("Error cargando usuarios (¿Eres Admin?)", e);
      }

      // D. Cargar Órdenes
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
      const cantidadNumerica = parseInt(nuevoStock, 10);

      if (isNaN(cantidadNumerica)) {
        alert("Por favor ingresa un número válido.");
        return;
      }

      await axios.put(`${API_URL}/productos/${id}/stock`, null, {
        params: { cantidad: cantidadNumerica },
        headers,
      });

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
  // 3. OTRAS ACCIONES (Categorías, Usuarios)
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
  // RENDERIZADO (VISTA)
  // ==========================================
  return (
    <div className="d-flex" style={{ minHeight: "calc(100vh - 80px)" }}>
      {/* --- SIDEBAR IZQUIERDO --- */}
      <div
        className="bg-body-tertiary border-end border-secondary-subtle p-3 d-flex flex-column"
        style={{ width: "250px", minHeight: "100%" }}
      >
        <h5 className="fw-bold mb-4 px-2 text-primary d-flex align-items-center gap-2">
          <i className="bx bxs-dashboard"></i> AdminPanel
        </h5>

        <div className="nav flex-column nav-pills gap-2">
          {[
            { id: "dashboard", icon: "bx-bar-chart-alt-2", label: "Dashboard" },
            { id: "products", icon: "bx-cube", label: "Productos" },
            { id: "categories", icon: "bx-category", label: "Categorías" },
            { id: "orders", icon: "bx-receipt", label: "Ventas" },
            { id: "users", icon: "bx-user-circle", label: "Usuarios" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`nav-link text-start d-flex align-items-center ${
                activeTab === tab.id
                  ? "active fw-bold shadow-sm"
                  : "text-body hover-bg-secondary"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={`bx ${tab.icon} me-2 fs-5`}></i> {tab.label}
            </button>
          ))}
          <hr className="text-secondary" />
          <button
            className={`nav-link text-start d-flex align-items-center ${
              activeTab === "profile" ? "active shadow-sm" : "text-body"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <i className="bx bx-id-card me-2 fs-5"></i> Mi Perfil
          </button>
        </div>
      </div>

      {/* --- CONTENIDO PRINCIPAL (DERECHA) --- */}
      <div className="flex-grow-1 p-4 bg-body" style={{ overflowY: "auto" }}>
        {/* Header Dinámico */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-capitalize text-body">
            {activeTab === "orders" ? "Boletas & Ventas" : activeTab}
          </h2>
          {cargando && (
            <div className="spinner-border spinner-border-sm text-primary"></div>
          )}
        </div>

        {/* Alertas de Éxito */}
        {mensajeExito && (
          <div className="alert alert-success d-flex align-items-center mb-4 rounded-4 shadow-sm animate__animated animate__fadeInDown">
            <i className="bx bx-check-circle fs-4 me-2"></i>
            <div className="fw-bold">{mensajeExito}</div>
          </div>
        )}

        {/* Alertas de Error */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center mb-4 rounded-4 shadow-sm">
            <i className="bx bx-error-circle fs-4 me-2"></i>
            <div>{error}</div>
          </div>
        )}

        {/* --- VISTAS SEGÚN LA PESTAÑA ACTIVA --- */}
        <div className="animate__animated animate__fadeIn">
          {/* 1. DASHBOARD */}
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

          {/* 2. PRODUCTOS */}
          {activeTab === "products" && (
            <div className="row g-4">
              <div className="col-lg-4">
                <div className="card border-0 shadow-lg rounded-4 h-100 bg-body-tertiary">
                  <div className="card-header bg-transparent border-0 pt-4 ps-4">
                    <h5 className="m-0 fw-bold d-flex align-items-center gap-2 text-primary">
                      <i className="bx bx-plus-circle"></i> Nuevo Producto
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
    </div>
  );
}

export default AdminPanel;
