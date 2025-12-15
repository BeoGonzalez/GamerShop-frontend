import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://gamershop-backend-1.onrender.com";

function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [procesando, setProcesando] = useState(false);

  // ESTADO PARA LA BOLETA (Si tiene datos, mostramos la boleta en vez del carrito)
  const [boleta, setBoleta] = useState(null);

  const navigate = useNavigate();

  // 1. Cargar carrito del LocalStorage
  useEffect(() => {
    const usuarioActual = localStorage.getItem("username");
    if (usuarioActual) {
      const key = `carrito_${usuarioActual}`;
      const items = JSON.parse(localStorage.getItem(key)) || [];
      setCarrito(items);
      calcularTotal(items);
    }
  }, []);

  const calcularTotal = (items) => {
    const suma = items.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    );
    setTotal(suma);
  };

  // 2. ELIMINAR ITEM
  const eliminarItem = (id) => {
    const usuarioActual = localStorage.getItem("username");
    const key = `carrito_${usuarioActual}`;

    const nuevoCarrito = carrito.filter((item) => item.id !== id);
    setCarrito(nuevoCarrito);
    calcularTotal(nuevoCarrito);

    localStorage.setItem(key, JSON.stringify(nuevoCarrito));
    window.dispatchEvent(new Event("storage")); // Actualizar Navbar
  };

  // 3. PROCESAR COMPRA (CONECTADO A ORDEN CONTROLLER)
  const handleComprar = async () => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("jwt_token"); // Token correcto

    if (!username || !token) {
      alert("🔒 Debes iniciar sesión para comprar.");
      navigate("/login");
      return;
    }

    if (carrito.length === 0) return alert("El carrito está vacío.");

    setProcesando(true);

    // --- PREPARAR DATOS PARA EL BACKEND ---
    // Mapeamos para que coincida con CompraRequest.java: { id, cantidad }
    const itemsParaBackend = carrito.map((prod) => ({
      id: prod.id,
      cantidad: prod.cantidad,
    }));

    const payload = {
      username: username,
      items: itemsParaBackend,
    };

    try {
      console.log("📤 Enviando orden:", payload);

      // Enviamos el POST
      const response = await axios.post(`${API_URL}/ordenes`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // --- ÉXITO: GENERAR BOLETA VISUAL ---
      // El backend devuelve: { "mensaje": "Orden registrada", "id": 123 }

      const datosDeBoleta = {
        nroOrden: response.data.id,
        fecha: new Date().toLocaleString(),
        cliente: username,
        items: [...carrito], // Guardamos copia de los items para mostrar
        totalPagado: total,
      };

      // 1. Guardamos la boleta en el estado para mostrarla
      setBoleta(datosDeBoleta);

      // 2. Limpiamos el carrito del sistema
      localStorage.removeItem(`carrito_${username}`);
      setCarrito([]);
      setTotal(0);
      window.dispatchEvent(new Event("storage"));

      // NO navegamos a ningún lado, dejamos que el return renderice la boleta
    } catch (error) {
      console.error("Error compra:", error);
      const msg = error.response?.data || "Error al procesar la compra.";
      // Si el error es un objeto, lo convertimos a texto
      alert(`❌ ${typeof msg === "object" ? JSON.stringify(msg) : msg}`);
    } finally {
      setProcesando(false);
    }
  };

  // Función para salir de la boleta
  const cerrarBoleta = () => {
    navigate("/"); // Volver al inicio
  };

  if (!localStorage.getItem("username")) {
    return (
      <div className="container py-5 text-center">
        <h3>Inicia sesión para ver tu carrito</h3>
        <Link to="/login" className="btn btn-primary mt-3">
          Ir al Login
        </Link>
      </div>
    );
  }

  // =========================================================
  // RENDERIZADO CONDICIONAL: ¿MOSTRAMOS BOLETA O CARRITO?
  // =========================================================

  if (boleta) {
    //
    return (
      <div className="container py-5 animate__animated animate__zoomIn">
        <div className="d-flex justify-content-center">
          <div
            className="card shadow-lg border-0 rounded-4"
            style={{
              maxWidth: "500px",
              width: "100%",
              backgroundColor: "#fffdf8",
            }}
          >
            {/* Encabezado Verde */}
            <div className="bg-success text-white text-center py-4 rounded-top-4">
              <i
                className="bx bx-check-circle"
                style={{ fontSize: "5rem" }}
              ></i>
              <h2 className="fw-bold mt-2">¡Pago Exitoso!</h2>
              <p className="mb-0 opacity-75">Tu orden ha sido registrada</p>
            </div>

            <div className="card-body p-4">
              <div className="text-center mb-4">
                <h5 className="fw-bold text-dark letter-spacing-1">
                  BOLETA DE VENTA
                </h5>
                <p className="text-muted small mb-0">
                  Orden #{boleta.nroOrden}
                </p>
                <p className="text-muted small">{boleta.fecha}</p>
              </div>

              <hr
                className="border-secondary opacity-25 border-dashed"
                style={{ borderStyle: "dashed" }}
              />

              {/* Lista de Items */}
              <div className="mb-4">
                {boleta.items.map((item, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between mb-2 small"
                  >
                    <div>
                      <span className="fw-bold text-dark">{item.nombre}</span>{" "}
                      <br />
                      <span className="text-muted">x{item.cantidad}</span>
                      {/* Si tiene variante de color, la mostramos */}
                      {item.selectedColor && (
                        <span className="text-muted ms-1">
                          ({item.selectedColor})
                        </span>
                      )}
                    </div>
                    <span className="fw-bold">
                      ${(item.precio * item.cantidad).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="border-secondary opacity-25" />

              {/* Total */}
              <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded mb-4">
                <span className="fs-5 text-muted">TOTAL</span>
                <span className="fs-3 fw-bold text-success">
                  ${boleta.totalPagado.toLocaleString()}
                </span>
              </div>

              {/* Botón Volver */}
              <button
                onClick={cerrarBoleta}
                className="btn btn-dark w-100 py-3 fw-bold rounded-pill shadow-sm"
              >
                VOLVER A LA TIENDA
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- SI NO HAY BOLETA, MOSTRAMOS EL CARRITO NORMAL ---
  return (
    <div className="container py-5 animate__animated animate__fadeIn">
      <h2 className="fw-bold mb-4">🛒 Tu Carrito de Compras</h2>

      {carrito.length === 0 ? (
        <div className="alert alert-warning text-center p-5 rounded-4">
          <h4>Tu carrito está vacío</h4>
          <Link to="/" className="btn btn-dark mt-3 rounded-pill">
            Volver al Catálogo
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {/* LISTA DE ITEMS */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-0">
                {carrito.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex align-items-center p-3 border-bottom"
                  >
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                      className="rounded me-3"
                    />
                    <div className="flex-grow-1">
                      <h5 className="mb-1 fw-bold">{item.nombre}</h5>
                      <p className="text-muted mb-0 small">
                        Precio: ${item.precio.toLocaleString()}
                      </p>
                      {item.selectedColor && (
                        <span className="badge bg-secondary">
                          {item.selectedColor}
                        </span>
                      )}
                    </div>
                    <div className="text-end">
                      <span className="badge bg-light text-dark border mb-2 d-block">
                        Cant: {item.cantidad}
                      </span>
                      <button
                        onClick={() => eliminarItem(item.id)}
                        className="btn btn-sm btn-outline-danger border-0"
                      >
                        <i className="bx bx-trash fs-5"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RESUMEN DE PAGO */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-lg rounded-4 bg-primary text-white">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4">Resumen</h4>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-4">
                  <span>Envío</span>
                  <span>Gratis</span>
                </div>
                <hr className="opacity-50" />
                <div className="d-flex justify-content-between fs-4 fw-bold mb-4">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>

                <button
                  onClick={handleComprar}
                  className="btn btn-light w-100 py-3 fw-bold rounded-pill text-primary shadow"
                  disabled={procesando}
                >
                  {procesando ? (
                    <span>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Procesando...
                    </span>
                  ) : (
                    "CONFIRMAR COMPRA"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carrito;
