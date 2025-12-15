import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../App.css"; // Asegúrate de tener tus estilos básicos aquí

const API_URL = "https://gamershop-backend-1.onrender.com";

function ProductoDetalle() {
  const { id } = useParams();

  // Estados de datos
  const [producto, setProducto] = useState(null);
  const [variantes, setVariantes] = useState([]); // Array parseado del JSON

  // Estados de Interfaz
  const [activeImage, setActiveImage] = useState(""); // Imagen grande actual
  const [activeColorName, setActiveColorName] = useState("Principal"); // Nombre del color actual
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Colores estilo Corsair
  const themeColor = "#F3E000"; // Amarillo Corsair

  // 1. CARGAR DATOS
  useEffect(() => {
    fetch(`${API_URL}/productos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Producto no encontrado");
        return res.json();
      })
      .then((data) => {
        setProducto(data);
        setActiveImage(data.imagen); // La imagen principal por defecto

        // PARSEO DE VARIANTES (De String JSON a Array JS)
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

  // 2. LOGICA CARRITO MEJORADA
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

    // Creamos el objeto a guardar
    const productoAGuardar = {
      ...producto,
      cantidad: cantidad,
      imagen: activeImage, // Guardamos la FOTO EXACTA que eligió el usuario
      selectedColor: activeColorName, // Guardamos el NOMBRE del color
    };

    if (existe) {
      // Nota: Aquí hay una lógica simple. Si quisieras separar "Mouse Rojo" de "Mouse Azul" en el carrito
      // deberías comparar también el 'selectedColor' o 'imagen' en el .find().
      // Por ahora, sumamos cantidad al producto ID general.
      existe.cantidad += cantidad;
      // Actualizamos la imagen a la última seleccionada (opcional)
      existe.imagen = activeImage;
    } else {
      carritoActual.push(productoAGuardar);
    }

    localStorage.setItem(key, JSON.stringify(carritoActual));
    window.dispatchEvent(new Event("storage"));
    alert(`✅ ¡${cantidad} unidad(es) agregada(s) al carrito!`);
  };

  // Controladores de cantidad
  const increaseQty = () => {
    if (producto && cantidad < producto.stock) setCantidad(cantidad + 1);
  };
  const decreaseQty = () => {
    if (cantidad > 1) setCantidad(cantidad - 1);
  };

  // Función para cambiar imagen y actualizar nombre del color
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
        <h2>❌ Producto no disponible</h2>
        <Link to="/" className="btn btn-dark">
          Volver
        </Link>
      </div>
    );

  // Construimos la galería completa: Imagen Principal + Variantes
  const galeriaCompleta = [
    { url: producto.imagen, color: "Principal" }, // Puedes cambiar "Principal" por el color base (ej: "Negro")
    ...variantes,
  ];

  return (
    <div className="container py-5 animate__animated animate__fadeIn">
      {/* Breadcrumb simple */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none text-muted">
              Inicio
            </Link>
          </li>
          <li className="breadcrumb-item">
            <span className="text-muted">
              {producto.categoria?.nombre || "Catálogo"}
            </span>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {producto.nombre}
          </li>
        </ol>
      </nav>

      <div className="row g-5">
        {/* === COLUMNA IZQUIERDA: GALERÍA === */}
        <div className="col-lg-7">
          {/* Imagen Principal Grande */}
          <div
            className="bg-light rounded-4 p-4 mb-3 d-flex justify-content-center align-items-center shadow-sm position-relative"
            style={{ minHeight: "450px" }}
          >
            <img
              src={activeImage}
              alt={producto.nombre}
              className="img-fluid animate__animated animate__fadeIn"
              style={{ maxHeight: "400px", objectFit: "contain" }}
            />
            {/* Etiqueta flotante del color */}
            <span className="position-absolute top-0 end-0 m-4 badge bg-dark text-white opacity-75">
              {activeColorName}
            </span>
          </div>

          {/* Tira de Miniaturas (Thumbnails) */}
          <div className="d-flex gap-2 overflow-auto py-2">
            {galeriaCompleta.map((item, index) => (
              <div
                key={index}
                onClick={() => handleVariantChange(item.url, item.color)}
                className={`border rounded-3 p-1 cursor-pointer ${
                  activeImage === item.url
                    ? "border-warning border-3"
                    : "border-secondary-subtle"
                }`}
                style={{
                  width: "80px",
                  height: "80px",
                  minWidth: "80px",
                  cursor: "pointer",
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

        {/* === COLUMNA DERECHA: INFO Y COMPRA === */}
        <div className="col-lg-5">
          <h5 className="text-warning fw-bold text-uppercase mb-2">
            {producto.categoria?.nombre}
          </h5>

          <h1 className="fw-bolder display-6 mb-3 text-dark">
            {producto.nombre}
          </h1>

          <div className="d-flex align-items-center gap-3 mb-4">
            <h2 className="fw-bold mb-0">
              ${producto.precio?.toLocaleString()}
            </h2>
            {producto.stock > 0 ? (
              <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2 rounded-pill">
                <i className="bx bx-check-circle me-1"></i> En Stock
              </span>
            ) : (
              <span className="badge bg-danger bg-opacity-10 text-danger border border-danger px-3 py-2 rounded-pill">
                Agotado
              </span>
            )}
          </div>

          <p className="text-muted lead fs-6 mb-4">{producto.descripcion}</p>

          <hr className="text-secondary opacity-25 my-4" />

          {/* === SELECTOR DE VARIANTE (AQUÍ APARECEN LOS COLORES) === */}
          {galeriaCompleta.length > 1 && (
            <div className="mb-4">
              <label className="fw-bold small text-muted mb-2 text-uppercase">
                Variante: <span className="text-dark">{activeColorName}</span>
              </label>

              <div className="d-flex flex-wrap gap-2">
                {galeriaCompleta.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => handleVariantChange(v.url, v.color)}
                    className={`btn btn-sm px-3 py-2 fw-bold ${
                      activeImage === v.url
                        ? "btn-dark border-dark" // Estilo seleccionado
                        : "btn-outline-secondary" // Estilo normal
                    }`}
                    style={{ minWidth: "80px" }}
                  >
                    {v.color || `Opción ${i + 1}`}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* ======================================================= */}

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
                  className="form-control text-center bg-white"
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

            {/* Botón Agregar */}
            <div className="col-8">
              <button
                onClick={agregarAlCarrito}
                disabled={producto.stock <= 0}
                className="btn w-100 fw-bold py-2 shadow-sm"
                style={{
                  backgroundColor: producto.stock > 0 ? themeColor : "#ccc",
                  color: "#000",
                  border: "none",
                }}
              >
                {producto.stock > 0 ? "AÑADIR AL CARRITO" : "AGOTADO"}
              </button>
            </div>
          </div>

          {/* Garantía / Info extra */}
          <div className="mt-4 pt-3 d-flex flex-column gap-2 text-muted small">
            <div className="d-flex align-items-center gap-2">
              <i className="bx bx-check-shield fs-5"></i>
              <span>Garantía de 2 años incluida</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <i className="bx bx-package fs-5"></i>
              <span>Envío gratis en compras sobre $50.000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;
