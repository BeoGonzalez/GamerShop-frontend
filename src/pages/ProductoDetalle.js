import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [variantes, setVariantes] = useState([]); // Lista procesada de colores
  const [imagenMostrada, setImagenMostrada] = useState("");
  const [colorSeleccionado, setColorSeleccionado] = useState("Principal"); // Nombre del color activo

  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  useEffect(() => {
    fetch(`https://gamershop-backend-1.onrender.com/productos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error");
        return res.json();
      })
      .then((data) => {
        setProducto(data);
        setImagenMostrada(data.imagen);

        // PARSEAR LAS VARIANTES (Convertir texto JSON a Array real)
        try {
          if (data.variantes) {
            setVariantes(JSON.parse(data.variantes));
          }
        } catch (e) {
          console.error("Error al leer variantes", e);
          setVariantes([]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleCambiarColor = (url, nombre) => {
    setImagenMostrada(url);
    setColorSeleccionado(nombre);
  };

  const handleAgregarCarrito = () => {
    const username = localStorage.getItem("username");
    if (!username) {
      alert("🔒 Inicia sesión para comprar.");
      navigate("/login");
      return;
    }

    const key = `carrito_${username}`;
    const carritoActual = JSON.parse(localStorage.getItem(key)) || [];

    // Generamos un ID único para el carrito basado en el ID producto + Color
    // Así puedes tener el mismo mouse en Rojo y en Azul como items separados
    const uniqueId = `${producto.id}-${colorSeleccionado}`;

    const existeIndex = carritoActual.findIndex(
      (item) => item.uniqueId === uniqueId
    );

    if (existeIndex >= 0) {
      if (carritoActual[existeIndex].cantidad + cantidad > producto.stock) {
        alert("Stock insuficiente.");
        return;
      }
      carritoActual[existeIndex].cantidad += cantidad;
    } else {
      carritoActual.push({
        id: producto.id,
        uniqueId: uniqueId, // Clave compuesta
        nombre: `${producto.nombre} (${colorSeleccionado})`, // Nombre con el color
        precio: producto.precio,
        imagen: imagenMostrada, // La foto del color seleccionado
        cantidad: cantidad,
        stockMaximo: producto.stock,
      });
    }
    localStorage.setItem(key, JSON.stringify(carritoActual));
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
    window.dispatchEvent(new Event("storage"));
  };

  if (loading)
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  if (!producto) return <div>No encontrado</div>;

  return (
    <div className="container py-5 animate__animated animate__fadeIn">
      <button
        onClick={() => navigate(-1)}
        className="btn btn-link text-decoration-none text-body mb-4 ps-0 d-flex align-items-center gap-2 fw-bold"
      >
        <i className="bx bx-left-arrow-alt fs-4"></i> Volver
      </button>

      <div className="card border-0 shadow-lg rounded-5 overflow-hidden bg-body">
        <div className="row g-0">
          {/* FOTO */}
          <div className="col-md-7 bg-body-tertiary d-flex align-items-center justify-content-center p-5 position-relative">
            <div
              className="bg-white p-4 rounded-4 shadow-sm d-flex align-items-center justify-content-center w-100"
              style={{ minHeight: "400px" }}
            >
              <img
                src={imagenMostrada}
                alt={producto.nombre}
                className="img-fluid hover-scale animate__animated animate__fadeIn"
                style={{ maxHeight: "450px", objectFit: "contain" }}
                key={imagenMostrada}
              />
            </div>
          </div>

          {/* INFO */}
          <div className="col-md-5">
            <div className="card-body p-4 p-lg-5 h-100 d-flex flex-column">
              <h1 className="fw-bold display-6 mb-2 text-body lh-sm">
                {producto.nombre}
              </h1>
              <h2 className="text-success fw-bold mb-4 display-5">
                ${producto.precio.toLocaleString()}
              </h2>

              {/* --- LISTA DE COLORES DINÁMICA --- */}
              <div className="mb-4">
                <h6 className="fw-bold text-body mb-3">
                  <i className="bx bx-palette"></i> Color:{" "}
                  <span className="text-primary">{colorSeleccionado}</span>
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {/* 1. Botón Principal (Original) */}
                  <button
                    onClick={() =>
                      handleCambiarColor(producto.imagen, "Principal")
                    }
                    className={`btn p-1 border-2 transition-all ${
                      colorSeleccionado === "Principal"
                        ? "border-primary shadow"
                        : "border-secondary-subtle"
                    }`}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "12px",
                    }}
                    title="Principal"
                  >
                    <img
                      src={producto.imagen}
                      className="w-100 h-100 rounded-3"
                      style={{ objectFit: "cover" }}
                      alt="Original"
                    />
                  </button>

                  {/* 2. Mapeo de Variantes (Bucle) */}
                  {variantes.map((variante, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        handleCambiarColor(variante.url, variante.color)
                      }
                      className={`btn p-1 border-2 transition-all ${
                        colorSeleccionado === variante.color
                          ? "border-primary shadow"
                          : "border-secondary-subtle"
                      }`}
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "12px",
                      }}
                      title={variante.color}
                    >
                      <img
                        src={variante.url}
                        className="w-100 h-100 rounded-3"
                        style={{ objectFit: "cover" }}
                        alt={variante.color}
                      />
                    </button>
                  ))}
                </div>
              </div>
              {/* --------------------------------- */}

              <div className="mb-4 bg-body-tertiary p-4 rounded-4 border border-secondary-subtle">
                <h5 className="fw-bold text-body mb-2">Descripción</h5>
                <p
                  className="text-body mb-0 lh-lg"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {producto.descripcion || "Sin descripción."}
                </p>
              </div>

              <div className="mt-auto"></div>
              <hr className="text-secondary opacity-25 mb-4" />

              <div className="row g-3">
                <div className="col-4">
                  <div className="input-group">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      className="form-control text-center fw-bold bg-body text-body"
                      value={cantidad}
                      readOnly
                    />
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setCantidad((c) => Math.min(producto.stock, c + 1))
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="col-8">
                  <button
                    onClick={handleAgregarCarrito}
                    className={`btn w-100 fw-bold rounded-pill py-2 shadow-sm ${
                      agregado ? "btn-success" : "btn-primary hover-scale"
                    }`}
                    disabled={producto.stock <= 0}
                  >
                    {agregado ? (
                      <span>
                        <i className="bx bx-check-double"></i> Listo
                      </span>
                    ) : (
                      <span>
                        <i className="bx bx-cart-add fs-5 me-2"></i> Agregar
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;
