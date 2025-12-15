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

  // Detectar tema global
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
    usuarios: [], // <--- Aquí se guardarán tus usuarios
    ordenes: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // =================================================================
  // 1. CORRECCIÓN CRÍTICA: Nombre del Token
  // =================================================================
  const getHeaders = () => {
    // CAMBIO: Antes decia "token", ahora debe ser "jwt_token" para coincidir con Login.js
    const token = localStorage.getItem("jwt_token");
    return token ? { Authorization: `Bearer ${token}` } : null;
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const headers = getHeaders();

    console.log("🔄 Conectando a:", API_URL);

    try {
      // Usamos allSettled para que si falla uno, no rompa todo el panel
      const [p, c, u, o] = await Promise.allSettled([
        // Productos y Categorías (Públicos o sin header estricto en GET según tu config)
        axios.get(`${API_URL}/productos`),
        axios.get(`${API_URL}/categorias`),

        // Usuarios (Requiere Auth sí o sí)
        headers
          ? axios.get(`${API_URL}/usuarios`, { headers })
          : Promise.reject({ msg: "No hay sesión activa (Falta jwt_token)" }),

        // Ordenes (Requiere Auth sí o sí)
        headers
          ? axios.get(`${API_URL}/ordenes`, { headers })
          : Promise.reject({ msg: "No Auth" }),
      ]);

      // DIAGNÓSTICO EN CONSOLA
      if (u.status === "fulfilled") {
        console.log("✅ Usuarios cargados:", u.value.data.length);
      } else {
        console.warn("⚠️ No se pudieron cargar usuarios:", u.reason);
      }

      // Guardamos lo que se pudo cargar
      setData({
        productos: p.status === "fulfilled" ? p.value.data : [],
        categorias: c.status === "fulfilled" ? c.value.data : [],
        // Aquí asignamos la data de usuarios
        usuarios: u.status === "fulfilled" ? u.value.data : [],
        ordenes: o.status === "fulfilled" ? o.value.data : [],
      });

      // Si falla productos, es un error de red grave
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

  // Estilos
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
        // Pasamos la lista de usuarios y la función para recargar
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
    <div
      className="d-flex flex-column flex-md-row bg-body text-body"
      style={{ minHeight: "100vh" }}
    >
      {/* Header Móvil */}
      <div className="d-md-none bg-body-tertiary p-3 border-bottom d-flex justify-content-between align-items-center sticky-top">
        <h5 className="m-0 text-primary fw-bold">AdminPanel</h5>
        <button
          className="btn btn-outline-primary"
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        >
          <i className="bx bx-menu fs-4"></i>
        </button>
      </div>

      {/* Sidebar */}
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
              className={`btn text-start d-flex align-items-center gap-2 ${
                activeTab === item.id
                  ? "btn-primary shadow-sm"
                  : "btn-ghost text-body hover-bg-secondary"
              }`}
              onClick={() => {
                setActiveTab(item.id);
                setShowMobileSidebar(false);
              }}
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

      {/* Contenido Principal */}
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
