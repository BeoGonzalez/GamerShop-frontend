import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

// COMPONENTES GLOBALES (Que ya tenías)
import ProductoForm from "../components/ProductoForm";
import ProductoList from "../components/ProductoList";

// COMPONENTES ADMIN (Los que te acabo de dar)
import DashboardOverview from "../components/admin/DashboardOverview";
import ReportsView from "../components/admin/ReportsView";
import UsersManager from "../components/admin/UsersManager";
import CategoriesManager from "../components/admin/CategoriesManager";
import OrdersView from "../components/admin/OrdersView";
import ProfileView from "../components/admin/ProfileView";

const API_URL = "https://gamershop-backend-1.onrender.com";

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [ordenes, setOrdenes] = useState([]);

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("jwt_token");
    return token
      ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      : null;
  };

  const handleAuthError = () => {
    localStorage.clear();
    window.location.href = "/login";
  };
  const mostrarExito = (msg) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(null), 3000);
  };

  const fetchData = useCallback(async () => {
    setCargando(true);
    const headers = getAuthHeaders();
    if (!headers) {
      handleAuthError();
      return;
    }

    try {
      const [resProd, resCat, resUser, resOrd] = await Promise.allSettled([
        axios.get(`${API_URL}/productos`),
        axios.get(`${API_URL}/categorias`),
        axios.get(`${API_URL}/usuarios`, { headers }),
        axios.get(`${API_URL}/ordenes`, { headers }),
      ]);

      if (resProd.status === "fulfilled") setProductos(resProd.value.data);
      if (resCat.status === "fulfilled") setCategorias(resCat.value.data);
      if (resUser.status === "fulfilled") setUsuarios(resUser.value.data);
      if (resOrd.status === "fulfilled") setOrdenes(resOrd.value.data);
    } catch (err) {
      console.error(err);
      setError("Error de conexión.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // CRUD Actions
  const guardarProducto = async (data) => {
    try {
      await axios.post(`${API_URL}/productos`, data, {
        headers: getAuthHeaders(),
      });
      mostrarExito("Producto guardado");
      fetchData();
      setActiveTab("products");
    } catch (e) {
      alert("Error al guardar");
    }
  };
  const handleActualizarStock = async (id, val) => {
    try {
      await axios.put(`${API_URL}/productos/${id}/stock`, null, {
        params: { cantidad: parseInt(val) },
        headers: getAuthHeaders(),
      });
      mostrarExito("Stock actualizado");
      fetchData();
    } catch (e) {
      alert("Error stock");
    }
  };
  const eliminarProducto = async (id) => {
    if (window.confirm("¿Borrar?")) {
      try {
        await axios.delete(`${API_URL}/productos/${id}`, {
          headers: getAuthHeaders(),
        });
        mostrarExito("Eliminado");
        fetchData();
      } catch (e) {
        alert("Error eliminar");
      }
    }
  };
  const handleAddCategory = async (data) => {
    try {
      await axios.post(`${API_URL}/categorias`, data, {
        headers: getAuthHeaders(),
      });
      mostrarExito("Categoría creada");
      fetchData();
    } catch (e) {
      alert("Error categoría");
    }
  };
  const handleDeleteCategory = async (id) => {
    if (window.confirm("¿Borrar?")) {
      try {
        await axios.delete(`${API_URL}/categorias/${id}`, {
          headers: getAuthHeaders(),
        });
        fetchData();
      } catch (e) {
        alert("Error eliminar");
      }
    }
  };
  const handleDeleteUser = async (id) => {
    if (window.confirm("¿Borrar usuario?")) {
      try {
        await axios.delete(`${API_URL}/usuarios/${id}`, {
          headers: getAuthHeaders(),
        });
        mostrarExito("Usuario eliminado");
        fetchData();
      } catch (e) {
        alert("Error eliminar");
      }
    }
  };

  const handleTabClick = (id) => {
    setActiveTab(id);
    setShowMobileSidebar(false);
  };

  return (
    <div
      className="d-flex flex-column flex-md-row"
      style={{ minHeight: "calc(100vh - 80px)", position: "relative" }}
    >
      {/* MENU MÓVIL */}
      <div
        className="d-md-none bg-body-tertiary p-3 border-bottom d-flex justify-content-between align-items-center sticky-top"
        style={{ zIndex: 1020 }}
      >
        <h5 className="m-0 fw-bold text-primary">
          <i className="bx bxs-dashboard"></i> Panel
        </h5>
        <button
          className="btn btn-outline-primary"
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        >
          <i
            className={`bx ${showMobileSidebar ? "bx-x" : "bx-menu"} fs-4`}
          ></i>
        </button>
      </div>

      {/* SIDEBAR */}
      <div
        className={`bg-body-tertiary border-end border-secondary-subtle p-3 d-flex flex-column`}
        style={{
          width: "250px",
          minHeight: "100%",
          position: window.innerWidth < 768 ? "absolute" : "relative",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1030,
          transform:
            window.innerWidth < 768 && !showMobileSidebar
              ? "translateX(-100%)"
              : "translateX(0)",
          transition: "transform 0.3s ease-in-out",
          height: window.innerWidth < 768 ? "100%" : "auto",
          boxShadow: showMobileSidebar ? "4px 0 15px rgba(0,0,0,0.1)" : "none",
        }}
      >
        <h5 className="fw-bold mb-4 px-2 text-primary d-none d-md-flex align-items-center gap-2">
          <i className="bx bxs-dashboard"></i> AdminPanel
        </h5>
        <div className="nav flex-column nav-pills gap-2">
          {[
            { id: "dashboard", icon: "bx-bar-chart-alt-2", label: "Dashboard" },
            { id: "reports", icon: "bx-pie-chart-alt-2", label: "Reportes" },
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
              onClick={() => handleTabClick(tab.id)}
            >
              <i className={`bx ${tab.icon} me-2 fs-5`}></i> {tab.label}
            </button>
          ))}
          <hr className="text-secondary" />
          <button
            className={`nav-link text-start d-flex align-items-center ${
              activeTab === "profile" ? "active shadow-sm" : "text-body"
            }`}
            onClick={() => handleTabClick("profile")}
          >
            <i className="bx bx-id-card me-2 fs-5"></i> Mi Perfil
          </button>
        </div>
      </div>
      {showMobileSidebar && (
        <div
          className="d-md-none position-absolute w-100 h-100 bg-black bg-opacity-50"
          style={{ zIndex: 1025, top: 0, left: 0 }}
          onClick={() => setShowMobileSidebar(false)}
        ></div>
      )}

      {/* CONTENIDO */}
      <div
        className="flex-grow-1 p-4 bg-body w-100"
        style={{ overflowY: "auto", overflowX: "hidden" }}
      >
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
          <h2 className="fw-bold text-capitalize text-body m-0">
            {activeTab === "orders"
              ? "Boletas & Ventas"
              : activeTab === "reports"
              ? "Reportes Avanzados"
              : activeTab}
          </h2>
          {cargando && (
            <div className="spinner-border spinner-border-sm text-primary"></div>
          )}
        </div>

        {mensajeExito && (
          <div className="alert alert-success d-flex align-items-center mb-4 rounded-4 shadow-sm animate__animated animate__fadeInDown">
            <i className="bx bx-check-circle fs-4 me-2"></i>
            <div className="fw-bold">{mensajeExito}</div>
          </div>
        )}
        {error && (
          <div className="alert alert-danger d-flex align-items-center mb-4 rounded-4 shadow-sm">
            <i className="bx bx-error-circle fs-4 me-2"></i>
            <div>{error}</div>
          </div>
        )}

        <div className="animate__animated animate__fadeIn">
          {activeTab === "dashboard" && (
            <DashboardOverview
              productos={productos}
              ordenes={ordenes}
              usuarios={usuarios}
            />
          )}
          {activeTab === "reports" && (
            <ReportsView
              productos={productos}
              ordenes={ordenes}
              categorias={categorias}
            />
          )}
          {activeTab === "products" && (
            <div className="row g-4">
              <div className="col-lg-4 order-lg-1 order-1">
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
              <div className="col-lg-8 order-lg-2 order-2">
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
    </div>
  );
}
export default AdminPanel;
