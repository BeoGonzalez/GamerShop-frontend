import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ProductoForm from "../components/ProductoForm";
import ProductoList from "../components/ProductoList";
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

  // --- LÓGICA MODO OSCURO ---
  // 1. Leemos del localStorage o por defecto 'true' (Gamer style)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("admin_theme");
    return saved ? JSON.parse(saved) : true;
  });

  // 2. Función para cambiar
  const toggleTheme = () => {
    const newVal = !darkMode;
    setDarkMode(newVal);
    localStorage.setItem("admin_theme", JSON.stringify(newVal));
  };
  // ---------------------------

  const [data, setData] = useState({
    productos: [],
    categorias: [],
    usuarios: [],
    ordenes: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getHeaders = () => {
    const token = localStorage.getItem("jwt_token");
    return token ? { Authorization: `Bearer ${token}` } : null;
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const headers = getHeaders();
    if (!headers) {
      window.location.href = "/login";
      return;
    }

    try {
      const [p, c, u, o] = await Promise.allSettled([
        axios.get(`${API_URL}/productos`),
        axios.get(`${API_URL}/categorias`),
        axios.get(`${API_URL}/usuarios`, { headers }),
        axios.get(`${API_URL}/ordenes`, { headers }),
      ]);

      setData({
        productos: p.status === "fulfilled" ? p.value.data : [],
        categorias: c.status === "fulfilled" ? c.value.data : [],
        usuarios: u.status === "fulfilled" ? u.value.data : [],
        ordenes: o.status === "fulfilled" ? o.value.data : [],
      });
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Acciones CRUD
  const handleAction = async (method, endpoint, payload = null) => {
    try {
      await axios({
        method,
        url: `${API_URL}${endpoint}`,
        data: payload,
        headers: getHeaders(),
      });
      fetchData();
      alert("Acción realizada con éxito");
    } catch (e) {
      alert("Error: " + (e.response?.data?.message || e.message));
    }
  };

  // Estilos Dinámicos Sidebar
  const isMobile = window.innerWidth < 768;
  const sidebarStyle = {
    width: "250px",
    minHeight: "100%",
    position: isMobile ? "absolute" : "relative",
    zIndex: isMobile ? 1040 : 1,
    left: 0,
    top: 0,
    bottom: 0,
    transform:
      isMobile && !showMobileSidebar ? "translateX(-100%)" : "translateX(0)",
    transition: "0.3s",
    height: isMobile ? "100%" : "auto",
    boxShadow: showMobileSidebar ? "4px 0 15px rgba(0,0,0,0.1)" : "none",
  };

  // --- RENDERIZADO PRINCIPAL ---
  // Agregamos 'data-bs-theme' al contenedor padre. Esto hace la magia de Bootstrap.
  return (
    <div
      className="d-flex flex-column flex-md-row bg-body text-body"
      style={{ minHeight: "calc(100vh - 80px)", position: "relative" }}
      data-bs-theme={darkMode ? "dark" : "light"} // <--- MAGIA AQUÍ
    >
      {/* HEADER MÓVIL */}
      <div
        className="d-md-none bg-body-tertiary p-3 border-bottom d-flex justify-content-between sticky-top"
        style={{ zIndex: 1020 }}
      >
        <h5 className="m-0 text-primary fw-bold">AdminPanel</h5>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary"
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          >
            <i className="bx bx-menu"></i>
          </button>
        </div>
      </div>

      {/* SIDEBAR */}
      {/* Cambié 'bg-light' por 'bg-body-tertiary' para que cambie de color según el modo */}
      <div
        className="bg-body-tertiary border-end p-3 d-flex flex-column"
        style={sidebarStyle}
      >
        <div className="d-flex justify-content-between align-items-center mb-4 px-2">
          <h5 className="text-primary fw-bold m-0 d-none d-md-block">
            AdminPanel
          </h5>
          {/* Botón de Tema en Desktop */}
          <button
            className="btn btn-sm btn-outline-secondary d-none d-md-block rounded-circle"
            onClick={toggleTheme}
            title="Cambiar tema"
          >
            <i className={`bx ${darkMode ? "bx-sun" : "bx-moon"} fs-5`}></i>
          </button>
        </div>

        <div className="nav flex-column gap-2">
          {[
            "dashboard",
            "reports",
            "products",
            "categories",
            "orders",
            "users",
            "profile",
          ].map((tab) => (
            <button
              key={tab}
              // Lógica para botones activos/inactivos adaptables
              className={`btn text-start d-flex align-items-center gap-2 ${
                activeTab === tab
                  ? "btn-primary shadow-sm"
                  : "btn-ghost text-body hover-bg-secondary"
              }`}
              onClick={() => {
                setActiveTab(tab);
                setShowMobileSidebar(false);
              }}
              style={{ opacity: activeTab === tab ? 1 : 0.8 }}
            >
              {/* Iconos dinámicos */}
              {tab === "dashboard" && <i className="bx bx-bar-chart-alt-2"></i>}
              {tab === "reports" && <i className="bx bx-pie-chart-alt-2"></i>}
              {tab === "products" && <i className="bx bx-cube"></i>}
              {tab === "categories" && <i className="bx bx-category"></i>}
              {tab === "orders" && <i className="bx bx-receipt"></i>}
              {tab === "users" && <i className="bx bx-user-circle"></i>}
              {tab === "profile" && <i className="bx bx-id-card"></i>}

              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Backdrop Móvil */}
      {showMobileSidebar && (
        <div
          className="d-md-none position-absolute w-100 h-100 bg-black opacity-50"
          style={{ zIndex: 1030 }}
          onClick={() => setShowMobileSidebar(false)}
        ></div>
      )}

      {/* CONTENIDO */}
      <div
        className="flex-grow-1 p-4 w-100 bg-body"
        style={{ overflowY: "auto" }}
      >
        {loading && <div className="spinner-border text-primary mb-3"></div>}

        {error && (
          <div className="alert alert-danger d-flex align-items-center mb-4 rounded-4 shadow-sm animate__animated animate__fadeIn">
            <i className="bx bx-error-circle fs-4 me-2"></i>
            <div>{error}</div>
          </div>
        )}

        {/* Pasamos 'darkMode' como prop a los gráficos si es necesario ajustar colores específicos */}
        {activeTab === "dashboard" && (
          <DashboardOverview {...data} darkMode={darkMode} />
        )}
        {activeTab === "reports" && (
          <ReportsView {...data} darkMode={darkMode} />
        )}

        {activeTab === "products" && (
          <div className="row">
            <div className="col-md-4 mb-4">
              <ProductoForm
                onGuardar={(d) => handleAction("post", "/productos", d)}
                categoriasDisponibles={data.categorias}
              />
            </div>
            <div className="col-md-8">
              <ProductoList
                productos={data.productos}
                onEliminar={(id) => handleAction("delete", `/productos/${id}`)}
                onActualizarStock={(id, val) =>
                  handleAction("put", `/productos/${id}/stock?cantidad=${val}`)
                }
              />
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <CategoriesManager
            categorias={data.categorias}
            onAddCategory={(d) => handleAction("post", "/categorias", d)}
            onDeleteCategory={(id) =>
              handleAction("delete", `/categorias/${id}`)
            }
          />
        )}

        {activeTab === "users" && (
          <UsersManager
            usuarios={data.usuarios}
            onDeleteUser={(id) => handleAction("delete", `/usuarios/${id}`)}
          />
        )}

        {activeTab === "orders" && <OrdersView ordenes={data.ordenes} />}

        {activeTab === "profile" && <ProfileView />}
      </div>
    </div>
  );
}
export default AdminPanel;
