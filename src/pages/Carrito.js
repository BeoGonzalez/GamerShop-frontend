import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

// URL base del backend
const API_URL = "https://gamershop-backend-1.onrender.com";

function Carrito() {
  const navigate = useNavigate();

  // 1. Datos de Sesión
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("jwt_token");
  const isAuth = !!token && !!username;

  // Clave dinámica para leer el carrito de ESTE usuario
  const storageKey = isAuth ? `carrito_${username}` : null;

  // 2. Estados
  const [carrito, setCarrito] = useState(() => {
    if (!storageKey) return [];
    const saved = localStorage.getItem(storageKey);
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [productosStock, setProductosStock] = useState([]); // Stock real para validar
  const [total, setTotal] = useState(0);
  const [boleta, setBoleta] = useState(null);
  const [procesando, setProcesando] = useState(false);

  // 3. Efectos

  // Cargar stock real del backend (Productos)
  const fetchStock = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/productos`);
      if (response.ok) {
        const data = await response.json();
        setProductosStock(data);
      }
    } catch (error) {
      console.error("Error al sincronizar stock:", error);
    }
  }, []);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  // Calcular Total y Guardar cambios locales
  useEffect(() => {
    const nuevoTotal = carrito.reduce((acc, item) => {
      const cantidad = item.cantidad || 1;
      return acc + item.precio * cantidad;
    }, 0);
    setTotal(nuevoTotal);

    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(carrito));
    }
  }, [carrito, storageKey]);

  // --- ACCIONES ---

  const eliminarProducto = (id) => {
    if (
      window.confirm("¿Estás seguro de eliminar este producto del carrito?")
    ) {
      const nuevoCarrito = carrito.filter((item) => item.id !== id);
      setCarrito(nuevoCarrito);
    }
  };

  const updateQuantity = (id, amount) => {
    setCarrito((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          // Validación contra stock real
          const prodReal = productosStock.find((p) => p.id === id);
          // Si no encontramos el producto real, usamos un fallback alto
          const maxStock = prodReal ? prodReal.stock : 999;

          const newQty = (item.cantidad || 1) + amount;

          if (newQty < 1) return item;
          if (newQty > maxStock) {
            alert(`⚠️ ¡Stock insuficiente! Solo quedan ${maxStock} unidades.`);
            return item;
          }
          return { ...item, cantidad: newQty };
        }
        return item;
      })
    );
  };

  // --- PROCESAR COMPRA (Conexión con OrdenController) ---
  const procesarCompra = async () => {
    if (carrito.length === 0) return;
    setProcesando(true);

    try {
      // Preparar el DTO para el backend: username + items[{id, cantidad}]
      // Esto coincide con tu CompraRequest.java
      const ordenData = {
        username: username,
        items: carrito.map((item) => ({
          id: item.id,
          cantidad: item.cantidad || 1,
        })),
      };

      // Petición POST a /ordenes/comprar
      const response = await fetch(`${API_URL}/ordenes/comprar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ordenData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      // Éxito: Generar Boleta Visual
      const nuevaBoleta = {
        idOrden: Math.floor(Math.random() * 900000) + 100000,
        fecha: new Date().toLocaleDateString(),
        hora: new Date().toLocaleTimeString(),
        cliente: username,
        items: [...carrito],
        totalPagado: total,
      };

      setBoleta(nuevaBoleta);

      // Limpiar carrito
      setCarrito([]);
      if (storageKey) localStorage.removeItem(storageKey);

      // Actualizar stock local
      fetchStock();
    } catch (error) {
      console.error("Error en compra:", error);
      alert("❌ No se pudo completar la compra:\n" + error.message);
    } finally {
      setProcesando(false);
    }
  };

  const cerrarBoleta = () => {
    setBoleta(null);
    navigate("/");
  };

  // --- RENDERIZADO ---

  if (!isAuth) {
    return (
      <div className="container py-5 text-center mt-5">
        <div className="card shadow p-5 mx-auto" style={{ maxWidth: "500px" }}>
          <h2>🔒 Acceso Restringido</h2>
          <p className="text-muted">
            Debes iniciar sesión para ver tu carrito.
          </p>
          <Link to="/login" className="btn btn-primary fw-bold">
            Ir al Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-5 position-relative">
      <h2 className="mb-4 border-bottom pb-3">
        🛒 Carrito de{" "}
        <span className="text-primary text-capitalize">{username}</span>
      </h2>

      <div className="row g-5">
        {/* LISTA DE PRODUCTOS */}
        <div className="col-lg-8">
          {carrito.length === 0 ? (
            <div className="alert alert-secondary text-center py-5">
              <h4>Tu carrito está vacío 😢</h4>
              <p>¡Ve a la tienda y agrega algunos juegos!</p>
              <Link to="/" className="btn btn-outline-primary mt-3">
                Ir a Comprar
              </Link>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {carrito.map((item) => (
                <div key={item.id} className="card shadow-sm border">
                  <div className="card-body d-flex align-items-center flex-wrap gap-3">
                    {/* Imagen */}
                    <div
                      className="bg-body-secondary rounded d-flex align-items-center justify-content-center"
                      style={{
                        width: "80px",
                        height: "80px",
                        overflow: "hidden",
                      }}
                    >
                      {item.imagen ? (
                        <img
                          src={item.imagen}
                          alt={item.nombre}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: "2rem" }}>🎮</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h5
                          className="mb-0 text-primary text-truncate"
                          title={item.nombre}
                          style={{ maxWidth: "250px" }}
                        >
                          {item.nombre}
                        </h5>
                        <button
                          onClick={() => eliminarProducto(item.id)}
                          className="btn btn-sm btn-outline-danger border-0 py-0"
                          title="Eliminar del carrito"
                        >
                          ❌ Eliminar
                        </button>
                      </div>
                      <small className="text-muted d-block">
                        {/* Manejo seguro de la categoría (si es objeto o string) */}
                        {item.categoria?.nombre || item.categoria || "General"}
                      </small>
                      <div className="fw-bold mt-1">
                        ${item.precio.toLocaleString()}{" "}
                        <span className="text-muted small fw-normal">
                          unidad
                        </span>
                      </div>
                    </div>

                    {/* Controles de Cantidad */}
                    <div className="d-flex align-items-center border rounded px-2">
                      <button
                        className="btn btn-sm btn-link text-decoration-none text-body"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        -
                      </button>

                      <span
                        className="mx-3 fw-bold"
                        style={{ minWidth: "20px", textAlign: "center" }}
                      >
                        {item.cantidad || 1}
                      </span>

                      <button
                        className="btn btn-sm btn-link text-decoration-none text-body"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div
                      className="text-end ms-auto"
                      style={{ minWidth: "90px" }}
                    >
                      <small className="d-block text-muted">Subtotal</small>
                      <span className="fw-bold fs-5 text-success">
                        ${(item.precio * (item.cantidad || 1)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: RESUMEN DE PAGO */}
        {carrito.length > 0 && (
          <div className="col-lg-4">
            <div className="card shadow-sm sticky-top" style={{ top: "100px" }}>
              <div className="card-header bg-body-tertiary">
                <h5 className="m-0">Resumen de Compra</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2 text-muted">
                  <span>Productos</span>
                  <span>
                    {carrito.reduce((acc, i) => acc + (i.cantidad || 1), 0)} u.
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-3 text-muted">
                  <span>Envío</span>
                  <span className="text-success">Gratis</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4 align-items-center">
                  <span className="fs-5">TOTAL A PAGAR</span>
                  <span className="fs-3 fw-bold text-primary">
                    ${total.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={procesarCompra}
                  disabled={procesando}
                  className="btn btn-success w-100 py-3 fw-bold shadow-lg"
                >
                  {procesando ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Procesando...
                    </>
                  ) : (
                    "PAGAR AHORA 💳"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL BOLETA DE VENTA (Overlay) --- */}
      {boleta && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.8)",
            zIndex: 9999,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="card shadow-lg p-0"
            style={{
              maxWidth: "400px",
              width: "90%",
              fontFamily: "'Courier New', monospace",
            }}
          >
            <div className="card-header bg-success text-white text-center py-3">
              <h4 className="m-0">✅ PAGO EXITOSO</h4>
              <small>GamerShop Inc.</small>
            </div>

            <div className="card-body p-4 bg-body">
              <div className="text-center border-bottom pb-3 mb-3 border-2">
                <p className="mb-1 fw-bold">ORDEN #{boleta.idOrden}</p>
                <p className="mb-1">
                  {boleta.fecha} - {boleta.hora}
                </p>
                <p className="mb-0">
                  Cliente: <strong>{boleta.cliente}</strong>
                </p>
              </div>

              <div className="mb-3">
                <p className="small text-muted mb-2 border-bottom pb-1">
                  DETALLE:
                </p>
                <ul className="list-unstyled mb-0">
                  {boleta.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="d-flex justify-content-between small mb-1"
                    >
                      <span>
                        {item.cantidad} x {item.nombre}
                      </span>
                      <span>
                        ${(item.precio * item.cantidad).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="d-flex justify-content-between border-top pt-3 mt-2 fw-bold fs-5">
                <span>TOTAL</span>
                <span>${boleta.totalPagado.toLocaleString()}</span>
              </div>
            </div>

            <div className="card-footer bg-body border-0 text-center pb-4">
              <p className="small text-muted mb-3">
                Tu inventario ha sido actualizado.
              </p>
              <button
                onClick={cerrarBoleta}
                className="btn btn-dark w-100 fw-bold"
              >
                CERRAR Y SEGUIR COMPRANDO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carrito;
