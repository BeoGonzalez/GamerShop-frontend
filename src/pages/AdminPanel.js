import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

// --- COMPONENTES ---
import DashboardOverview from "../components/admin/DashboardOverview";
import ReportsView from "../components/admin/ReportsView";
import ProductsManager from "../components/admin/ProductsManager";
import UsersManager from "../components/admin/UsersManager";
import CategoriesManager from "../components/admin/CategoriesManager";
import OrdersView from "../components/admin/OrdersView";
import ProfileView from "../components/admin/ProfileView";

const API_URL = "https://gamershop-backend-1.onrender.com";

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Detectar tema global (Útil si necesitas lógica JS específica, pero el CSS lo hará automático)
  const [darkMode, setDarkMode] = useState(
    document.documentElement.getAttribute("data-bs-theme") === "dark"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(
        document.documentElement.getAttribute("data-bs-theme") === "dark"
      );
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-bs-theme"],
    });
    return () => observer.disconnect();
  }, []);

  // --- DATOS ---
  const [data, setData] = useState({
    productos: [],
    categorias: [],
    usuarios: [],
    ordenes: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. OBTENER TOKEN
  const getHeaders = () => {
    const token = localStorage.getItem("jwt_token");
    return token ? { Authorization: `Bearer ${token}` } : null;
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const headers = getHeaders();

    console.log("🔄 Conectando a:", API_URL);

    try {
      const [p, c, u, o] = await Promise.allSettled([
        axios.get(`${API_URL}/productos`),
        axios.get(`${API_URL}/categorias`),
        headers
          ? axios.get(`${API_URL}/usuarios`, { headers })
          : Promise.reject({ msg: "No Auth" }),
        headers
          ? axios.get(`${API_URL}/ordenes`, { headers })
          : Promise.reject({ msg: "No Auth" }),
      ]);

      if (u.status === "fulfilled") {
        console.log("✅ Usuarios cargados:", u.value.data.length);
      } else {
        console.warn("⚠️ No se pudieron cargar usuarios:", u.reason);
      }

      setData({
        productos: p.status === "fulfilled" ? p.value.data : [],
        categorias: c.status === "fulfilled" ? c.value.data : [],
        usuarios: u.status === "fulfilled" ? u.value.data : [],
        ordenes: o.status === "fulfilled" ? o.value.data : [],
      });

      if (p.status === "rejected") {
        throw new Error(
          "No se pudo conectar con el Backend (¿Render está dormido?)"
        );
      }
    } catch (err) {
      console.error("❌ Error de conexión:", err);
      setError(err.message || "Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Estilos Sidebar
  const isMobile = window.innerWidth < 768;
  const sidebarStyle = {
    width: "250px",
    minHeight: "100vh",
    position: isMobile ? "fixed" : "relative",
    zIndex: 1040,
    left: 0,
    top: 0,
    bottom: 0,
    transform:
      isMobile && !showMobileSidebar ? "translateX(-100%)" : "translateX(0)",
    transition: "transform 0.3s ease-in-out",
    height: "100vh",
  };

  // Renderizado dinámico
  const renderContent = () => {
    // Pasamos darkMode a los hijos por si lo necesitan para lógica interna
    const commonProps = { ...data, darkMode, onRefresh: fetchData };

    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview {...commonProps} />;
      case "reports":
        return <ReportsView {...commonProps} />;
      case "products":
        return (
          <ProductsManager
            productos={data.productos}
            categorias={data.categorias}
            onRefresh={fetchData}
          />
        );
      case "categories":
        return (
          <CategoriesManager
            categorias={data.categorias}
            onRefresh={fetchData}
          />
        );
      case "users":
        return <UsersManager usuarios={data.usuarios} onRefresh={fetchData} />;
      case "orders":
        return <OrdersView ordenes={data.ordenes} />;
      case "profile":
        return <ProfileView />;
      default:
        return <DashboardOverview {...commonProps} />;
    }
  };

  return (
    // CLASE CLAVE: bg-body y text-body hacen que el fondo sea blanco/negro automáticamente
    <div
      className="d-flex flex-column flex-md-row bg-body text-body"
      style={{ minHeight: "100vh" }}
    >
      {/* Header Móvil (bg-body-tertiary adapta el gris del header) */}
      <div className="d-md-none bg-body-tertiary p-3 border-bottom d-flex justify-content-between align-items-center sticky-top">
        <h5 className="m-0 text-primary fw-bold">AdminPanel</h5>
        <button
          className="btn btn-outline-primary"
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        >
          <i className="bx bx-menu fs-4"></i>
        </button>
      </div>

      {/* Sidebar (bg-body-tertiary adapta el fondo de la barra lateral) */}
      <div
        className="bg-body-tertiary border-end p-3 d-flex flex-column shadow-sm"
        style={sidebarStyle}
      >
        <div className="mb-4 px-2 pt-2">
          <h5 className="text-primary fw-bold m-0 d-none d-md-block">
            AdminPanel
          </h5>
        </div>
        <div className="nav flex-column gap-2 flex-grow-1">
          {[
            { id: "dashboard", icon: "bx-bar-chart-alt-2", label: "Dashboard" },
            { id: "products", icon: "bx-cube", label: "Productos" },
            { id: "categories", icon: "bx-category", label: "Categorías" },
            { id: "orders", icon: "bx-receipt", label: "Pedidos" },
            { id: "users", icon: "bx-user-circle", label: "Usuarios" },
            { id: "reports", icon: "bx-pie-chart-alt-2", label: "Reportes" },
            { id: "profile", icon: "bx-id-card", label: "Mi Perfil" },
          ].map((item) => (
            <button
              key={item.id}
              // AQUÍ ESTÁ LA MAGIA DE LOS BOTONES:
              // - text-body: El texto se vuelve blanco en dark mode.
              // - hover-bg-secondary-subtle: Efecto hover suave en ambos modos.
              className={`btn text-start d-flex align-items-center gap-2 border-0 ${
                activeTab === item.id
                  ? "btn-primary shadow-sm fw-bold" // Activo
                  : "bg-transparent text-body opacity-75 hover-opacity-100" // Inactivo (Adaptable)
              }`}
              onClick={() => {
                setActiveTab(item.id);
                setShowMobileSidebar(false);
              }}
              style={{ transition: "all 0.2s" }}
            >
              <i className={`bx ${item.icon} fs-5`}></i> {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Backdrop Móvil */}
      {showMobileSidebar && (
        <div
          className="d-md-none position-fixed top-0 start-0 w-100 h-100 bg-black opacity-50"
          style={{ zIndex: 1030 }}
          onClick={() => setShowMobileSidebar(false)}
        ></div>
      )}

      {/* Contenido Principal (bg-body asegura el fondo correcto) */}
      <div
        className="flex-grow-1 p-4 w-100 bg-body overflow-auto"
        style={{ height: "100vh" }}
      >
        {/* DIAGNÓSTICO DE CONEXIÓN */}
        {loading && (
          <div className="alert alert-info">
            <div className="spinner-border spinner-border-sm me-2"></div>
            Conectando con Backend...
          </div>
        )}

        {error && (
          <div className="alert alert-danger shadow-sm border-0 rounded-3">
            <h5 className="fw-bold">
              <i className="bx bx-error-circle"></i> Error de Conexión
            </h5>
            <p className="mb-0">{error}</p>
            <small>
              Sugerencia: Si usas Render Free, espera 1 minuto y recarga la
              página.
            </small>
          </div>
        )}

        {!loading && !error && renderContent()}
      </div>
    </div>
  );
}

export default AdminPanel;
