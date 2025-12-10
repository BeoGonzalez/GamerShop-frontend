import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

// 1. Definimos la URL base del backend
const BASE_URL = "https://gamershop-backend-1.onrender.com";

function Carrito() {
  const navigate = useNavigate();

  // --- DATOS DE SESIÓN ---
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("jwt_token");
  const isAuth = !!token && !!username;
  const storageKey = isAuth ? `carrito_${username}` : null;

  // --- ESTADOS ---
  const [carrito, setCarrito] = useState(() => {
    if (!storageKey) return [];
    const saved = localStorage.getItem(storageKey);
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [productosStock, setProductosStock] = useState([]);
  const [total, setTotal] = useState(0);
  const [boleta, setBoleta] = useState(null);
  const [procesando, setProcesando] = useState(false);

  // --- EFECTOS ---

  // A. Cargar stock real desde /productos para validar disponibilidad
  const fetchStock = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/productos`);
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

  // B. Calcular Total y Persistencia local
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
    if (window.confirm("¿Eliminar producto?")) {
      setCarrito((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const updateQuantity = (id, amount) => {
    setCarrito((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const prodReal = productosStock.find((p) => p.id === id);
          const maxStock = prodReal ? prodReal.stock : 999;
          const newQty = (item.cantidad || 1) + amount;

          if (newQty < 1) return item;
          if (newQty > maxStock) {
            alert(`⚠️ Stock insuficiente. Solo quedan ${maxStock} unidades.`);
            return item;
          }
          return { ...item, cantidad: newQty };
        }
        return item;
      })
    );
  };

  // --- PROCESAR COMPRA (Conexión a OrdenController) ---
  const procesarCompra = async () => {
    if (carrito.length === 0) return;
    setProcesando(true);

    try {
      // 1. Preparamos el DTO exacto que espera Java (CompraRequest)
      const ordenData = {
        username: username,
        items: carrito.map((item) => ({
          id: item.id,
          cantidad: item.cantidad || 1,
        })),
      };

      // 2. Enviamos a /ordenes/comprar
      const response = await fetch(`${BASE_URL}/ordenes/comprar`, {
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

      // 3. Éxito: Generar Boleta
      const nuevaBoleta = {
        idOrden: Math.floor(Math.random() * 900000) + 100000,
        fecha: new Date().toLocaleDateString(),
        hora: new Date().toLocaleTimeString(),
        cliente: username,
        items: [...carrito],
        totalPagado: total,
      };

      setBoleta(nuevaBoleta);
      setCarrito([]);
      if (storageKey) localStorage.removeItem(storageKey);
      fetchStock(); // Actualizar stock visual
    } catch (error) {
      console.error("Error en compra:", error);
      alert("❌ Error: " + error.message);
    } finally {
      setProcesando(false);
    }
  };

  const cerrarBoleta = () => {
    setBoleta(null);
    navigate("/");
  };

  if (!isAuth)
    return (
      <div className="container py-5 text-center mt-5">
        <div className="card shadow p-5 mx-auto" style={{ maxWidth: "500px" }}>
          <h2>🔒 Acceso Restringido</h2>
          <Link to="/login" className="btn btn-primary fw-bold mt-3">
            Ir al Login
          </Link>
        </div>
      </div>
    );

  return (
    <div className="container py-5 mt-5 position-relative">
      <h2 className="mb-4 border-bottom pb-3">
        🛒 Carrito de{" "}
        <span className="text-primary text-capitalize">{username}</span>
      </h2>
      <div className="row g-5">
        <div className="col-lg-8">
          {carrito.length === 0 ? (
            <div className="alert alert-secondary text-center py-5">
              <h4>Tu carrito está vacío 😢</h4>
              <Link to="/" className="btn btn-outline-primary mt-3">
                Ir a Comprar
              </Link>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {carrito.map((item) => (
                <div key={item.id} className="card shadow-sm border">
                  <div className="card-body d-flex align-items-center gap-3 flex-wrap">
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
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <h5
                          className="mb-0 text-primary text-truncate"
                          style={{ maxWidth: "200px" }}
                        >
                          {item.nombre}
                        </h5>
                        <button
                          onClick={() => eliminarProducto(item.id)}
                          className="btn btn-sm btn-outline-danger border-0"
                        >
                          ❌
                        </button>
                      </div>
                      <small className="text-muted">
                        {item.categoria?.nombre || item.categoria || "General"}
                      </small>
                      <div className="fw-bold mt-1">
                        ${item.precio.toLocaleString()}
                      </div>
                    </div>
                    <div className="d-flex align-items-center border rounded px-2">
                      <button
                        className="btn btn-sm"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        -
                      </button>
                      <span className="mx-2 fw-bold">{item.cantidad || 1}</span>
                      <button
                        className="btn btn-sm"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <div
                      className="text-end fw-bold"
                      style={{ minWidth: "80px" }}
                    >
                      ${(item.precio * (item.cantidad || 1)).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {carrito.length > 0 && (
          <div className="col-lg-4">
            <div className="card shadow-sm sticky-top" style={{ top: "100px" }}>
              <div className="card-header bg-body-tertiary">
                <h5 className="m-0">Resumen</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Productos</span>
                  <span>
                    {carrito.reduce((a, b) => a + (b.cantidad || 1), 0)}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-4 fs-4 fw-bold">
                  <span>TOTAL</span>
                  <span className="text-primary">
                    ${total.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={procesarCompra}
                  disabled={procesando}
                  className="btn btn-success w-100 py-3 fw-bold shadow-lg"
                >
                  {procesando ? "Procesando..." : "PAGAR AHORA 💳"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Boleta */}
      {boleta && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.8)", zIndex: 9999 }}
        >
          <div
            className="card shadow-lg p-4"
            style={{ maxWidth: "400px", width: "90%" }}
          >
            <div className="text-center mb-4">
              <h4 className="text-success">✅ PAGO EXITOSO</h4>
            </div>
            <div className="mb-3 border-bottom pb-2 text-center">
              <p className="mb-1">
                <strong>Orden:</strong> #{boleta.idOrden}
              </p>
              <p className="mb-0">
                <strong>Cliente:</strong> {boleta.cliente}
              </p>
            </div>
            <ul className="list-unstyled mb-3">
              {boleta.items.map((it, idx) => (
                <li
                  key={idx}
                  className="d-flex justify-content-between small text-muted"
                >
                  <span>
                    {it.cantidad} x {it.nombre}
                  </span>
                  <span>${it.precio * it.cantidad}</span>
                </li>
              ))}
            </ul>
            <div className="d-flex justify-content-between fw-bold fs-5 border-top pt-2">
              <span>TOTAL</span>
              <span>${boleta.totalPagado.toLocaleString()}</span>
            </div>
            <button onClick={cerrarBoleta} className="btn btn-dark w-100 mt-4">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carrito;
