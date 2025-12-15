import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../App.css"; // Tus estilos globales

const API_URL = "https://gamershop-backend-1.onrender.com";

function ProductoDetalle() {
  const { id } = useParams();

  // Estados de datos
  const [producto, setProducto] = useState(null);
  const [variantes, setVariantes] = useState([]);

  // Estados de Interfaz
  const [activeImage, setActiveImage] = useState("");
  const [activeColorName, setActiveColorName] = useState("Principal");
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Mantenemos el amarillo solo para el botón de compra (Identidad de Marca)
  const themeColor = "#F3E000";

  // 1. CARGAR DATOS
  useEffect(() => {
    fetch(`${API_URL}/productos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Producto no encontrado");
        return res.json();
      })
      .then((data) => {
        setProducto(data);
        setActiveImage(data.imagen);

        if (data.variantes && data.variantes.length > 5) {
          try {
            const parsed = JSON.parse(data.variantes);
            setVariantes(Array.isArray(parsed) ? parsed : []);
          } catch (e) {
            console.error("Error parseando variantes JSON:", e);
            setVariantes([]);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  // 2. LOGICA CARRITO
  const agregarAlCarrito = () => {
    if (!producto) return;

    const username = localStorage.getItem("username");
    if (!username) {
      alert("🔒 Inicia sesión para comprar.");
      return;
    }

    const key = `carrito_${username}`;
    const carritoActual = JSON.parse(localStorage.getItem(key)) || [];
    const existe = carritoActual.find((item) => item.id === producto.id);

    const productoAGuardar = {
      ...producto,
      cantidad: cantidad,
      imagen: activeImage,
      selectedColor: activeColorName,
    };

    if (existe) {
      existe.cantidad += cantidad;
      existe.imagen = activeImage;
    } else {
      carritoActual.push(productoAGuardar);
    }

    localStorage.setItem(key, JSON.stringify(carritoActual));
    window.dispatchEvent(new Event("storage"));
    alert(`✅ ¡${cantidad} unidad(es) agregada(s) al carrito!`);
  };

  const increaseQty = () => {
    if (producto && cantidad < producto.stock) setCantidad(cantidad + 1);
  };
  const decreaseQty = () => {
    if (cantidad > 1) setCantidad(cantidad - 1);
  };

  const handleVariantChange = (url, colorName) => {
    setActiveImage(url);
    setActiveColorName(colorName);
  };

  // --- RENDERIZADO ---

  if (loading)
    return (
      <div className="text-center py-5 mt-5">
        <div className="spinner-border text-warning"></div>
      </div>
    );
  if (error || !producto)
    return (
      <div className="text-center py-5">
        <h2 className="text-body-emphasis">❌ Producto no disponible</h2>
        <Link to="/" className="btn btn-primary">
          Volver
        </Link>
      </div>
    );

  const galeriaCompleta = [
    { url: producto.imagen, color: "Principal" },
    ...variantes,
  ];

  return (
    <div className="container py-5 animate__animated animate__fadeIn">
      {/* Breadcrumb Adaptable */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link
              to="/"
              className="text-decoration-none text-body-secondary hover-underline"
            >
              Inicio
            </Link>
          </li>
          <li className="breadcrumb-item">
            <span className="text-body-secondary">
              {producto.categoria?.nombre || "Catálogo"}
            </span>
          </li>
          <li
            className="breadcrumb-item active text-body-emphasis"
            aria-current="page"
          >
            {producto.nombre}
          </li>
        </ol>
      </nav>

      <div className="row g-5">
        {/* === COLUMNA IZQUIERDA: GALERÍA === */}
        <div className="col-lg-7">
          {/* Imagen Principal - USAMOS bg-body-tertiary PARA QUE CAMBIE SOLO */}
          <div
            className="bg-body-tertiary rounded-4 p-4 mb-3 d-flex justify-content-center align-items-center shadow-sm position-relative overflow-hidden"
            style={{ minHeight: "450px" }}
          >
            <img
              src={activeImage}
              alt={producto.nombre}
              className="img-fluid animate__animated animate__zoomIn"
              style={{
                maxHeight: "400px",
                objectFit: "contain",
                transition: "transform 0.3s",
              }}
            />

            {/* Etiqueta flotante adaptable */}
            <span className="position-absolute top-0 end-0 m-4 badge bg-body text-body-emphasis border shadow-sm">
              {activeColorName}
            </span>
          </div>

          {/* Miniaturas */}
          <div className="d-flex gap-2 overflow-auto py-2">
            {galeriaCompleta.map((item, index) => (
              <div
                key={index}
                onClick={() => handleVariantChange(item.url, item.color)}
                className={`rounded-3 p-1 cursor-pointer transition-all ${
                  activeImage === item.url
                    ? "border border-2 border-warning shadow-sm" // Seleccionado
                    : "border border-1 border-secondary-subtle opacity-75" // No seleccionado
                }`}
                style={{
                  width: "80px",
                  height: "80px",
                  minWidth: "80px",
                  cursor: "pointer",
                  backgroundColor: "var(--bs-body-bg)", // Fondo adaptable
                }}
              >
                <img
                  src={item.url}
                  alt={item.color}
                  className="w-100 h-100 object-fit-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* === COLUMNA DERECHA: INFO === */}
        <div className="col-lg-5">
          <h5 className="text-warning fw-bold text-uppercase mb-2">
            {producto.categoria?.nombre}
          </h5>

          {/* Título adaptable */}
          <h1 className="fw-bolder display-6 mb-3 text-body-emphasis">
            {producto.nombre}
          </h1>

          {/* Precio y Stock */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <h2 className="fw-bold mb-0 text-body">
              ${producto.precio?.toLocaleString()}
            </h2>
            {producto.stock > 0 ? (
              <span className="badge bg-success-subtle text-success border border-success px-3 py-2 rounded-pill">
                <i className="bx bx-check-circle me-1"></i> En Stock
              </span>
            ) : (
              <span className="badge bg-danger-subtle text-danger border border-danger px-3 py-2 rounded-pill">
                Agotado
              </span>
            )}
          </div>

          {/* Descripción adaptable */}
          <p className="text-body-secondary lead fs-6 mb-4">
            {producto.descripcion}
          </p>

          <hr className="text-secondary opacity-25 my-4" />

          {/* === SELECTOR DE VARIANTE === */}
          {galeriaCompleta.length > 1 && (
            <div className="mb-4">
              <label className="fw-bold small text-body-secondary mb-2 text-uppercase">
                Variante:{" "}
                <span className="text-body-emphasis">{activeColorName}</span>
              </label>

              <div className="d-flex flex-wrap gap-2">
                {galeriaCompleta.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => handleVariantChange(v.url, v.color)}
                    className={`btn btn-sm px-3 py-2 fw-bold transition-all ${
                      activeImage === v.url
                        ? "btn-outline-warning text-body-emphasis border-2" // Seleccionado: Borde amarillo, texto adaptable
                        : "btn-outline-secondary text-body-secondary" // No seleccionado
                    }`}
                    style={{ minWidth: "80px" }}
                  >
                    {v.color || `Opción ${i + 1}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Controles de Compra */}
          <div className="row g-2">
            {/* Selector Cantidad */}
            <div className="col-4">
              <div className="input-group">
                <button
                  className="btn btn-outline-secondary"
                  onClick={decreaseQty}
                  disabled={producto.stock <= 0}
                >
                  -
                </button>
                <input
                  type="text"
                  className="form-control text-center bg-body text-body-emphasis border-secondary-subtle"
                  value={cantidad}
                  readOnly
                />
                <button
                  className="btn btn-outline-secondary"
                  onClick={increaseQty}
                  disabled={producto.stock <= 0}
                >
                  +
                </button>
              </div>
            </div>

            {/* Botón Agregar - Mantiene Identidad Visual Corsair */}
            <div className="col-8">
              <button
                onClick={agregarAlCarrito}
                disabled={producto.stock <= 0}
                className="btn w-100 fw-bold py-2 shadow-sm d-flex align-items-center justify-content-center gap-2"
                style={{
                  backgroundColor: producto.stock > 0 ? themeColor : "#ccc",
                  color: "#000", // Texto negro siempre para contraste con amarillo
                  border: "none",
                }}
              >
                {producto.stock > 0 ? (
                  <>
                    <i className="bx bx-cart-add fs-5"></i> AÑADIR AL CARRITO
                  </>
                ) : (
                  "AGOTADO"
                )}
              </button>
            </div>
          </div>

          {/* Info Extra - Adaptable */}
          <div className="mt-4 pt-3 d-flex flex-column gap-2 text-body-secondary small">
            <div className="d-flex align-items-center gap-2">
              <i className="bx bx-check-shield fs-5 text-success"></i>
              <span>Garantía de 2 años incluida</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <i className="bx bx-package fs-5 text-primary"></i>
              <span>Envío gratis en compras sobre $50.000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;
