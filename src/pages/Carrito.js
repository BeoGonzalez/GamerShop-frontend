import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Carrito.css";

const API_URL = "https://gamershop-backend-1.onrender.com/api/producto";

function Carrito() {
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estado del carrito (persistencia en localStorage)
  const [carrito, setCarrito] = useState(() => {
    const saved = localStorage.getItem("user_cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Estados para la Boleta Falsa
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  // Función auxiliar para obtener Headers con Token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token
      ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      : {};
  };

  // 1. Cargar productos de la BD (Ahora traen el campo 'stock')
  const fetchProductos = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      // Si hay token lo usamos, si no, hacemos petición pública (GET es permitido)
      const config = headers.Authorization ? { headers } : {};

      const response = await fetch(API_URL, config);
      if (response.ok) {
        const data = await response.json();
        setProductos(data);
      } else {
        console.error("Error al cargar productos");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // 2. Guardar carrito en LocalStorage al cambiar
  useEffect(() => {
    localStorage.setItem("user_cart", JSON.stringify(carrito));
  }, [carrito]);

  // --- FUNCIONES DEL CARRITO ---

  const addToCart = (producto) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("🔐 Debes iniciar sesión para comprar");
      navigate("/login");
      return;
    }

    // --- VALIDACIÓN DE STOCK ---
    // Verificamos cuánto tenemos ya en el carrito
    const itemInCart = carrito.find((item) => item.id === producto.id);
    const cantidadActual = itemInCart ? itemInCart.cantidad : 0;

    // Obtenemos el stock real (si es undefined, asumimos 0)
    const stockReal = producto.stock !== undefined ? producto.stock : 0;

    // Si intentar agregar 1 más supera el stock real
    if (cantidadActual + 1 > stockReal) {
      alert(`❌ Stock insuficiente. Solo quedan ${stockReal} unidades.`);
      return;
    }

    setCarrito((prevCarrito) => {
      const itemExists = prevCarrito.find((item) => item.id === producto.id);
      if (itemExists) {
        return prevCarrito.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prevCarrito, { ...producto, cantidad: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    if (window.confirm("¿Eliminar producto del carrito?")) {
      setCarrito((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const updateQuantity = (id, amount) => {
    setCarrito((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          // Buscamos el stock máximo real desde la lista de productos
          const productoReal = productos.find((p) => p.id === id);
          const maxStock = productoReal ? productoReal.stock : 0;

          const newQuantity = item.cantidad + amount;

          // Validaciones
          if (newQuantity < 1) return item; // No bajar de 1
          if (newQuantity > maxStock) {
            alert(`⚠️ No puedes llevar más de ${maxStock} unidades.`);
            return item; // No subir más allá del stock
          }

          return { ...item, cantidad: newQuantity };
        }
        return item;
      })
    );
  };

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  // --- LÓGICA DE PAGO CONECTADA AL BACKEND ---
  const handleCheckout = async () => {
    if (carrito.length === 0) return;

    try {
      // 1. Enviar la petición de compra al Backend para restar stock
      const response = await fetch(`${API_URL}/comprar`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(carrito), // Enviamos la lista de items
      });

      if (!response.ok) {
        // Si el backend dice que no hay stock, mostramos el error
        const errorText = await response.text();
        throw new Error(errorText);
      }

      // 2. Si todo sale bien (Backend respondió 200 OK)

      // Generamos los datos para la boleta visual
      const orderData = {
        id: Math.floor(Math.random() * 900000) + 100000,
        fecha: new Date().toLocaleString(),
        items: [...carrito],
        total: total,
      };

      setLastOrder(orderData);

      // 3. Limpiamos el carrito local
      setCarrito([]);
      localStorage.removeItem("user_cart");

      // 4. Mostramos la boleta
      setShowReceipt(true);

      // 5. IMPORTANTE: Recargamos los productos para ver el stock actualizado en la pantalla
      fetchProductos();
    } catch (error) {
      alert("❌ Error al procesar la compra: " + error.message);
    }
  };

  return (
    <div className="gamer-container py-5 position-relative">
      <div className="container">
        <h1 className="text-center gamer-title mb-5">
          🛒 Tu <span className="highlight">Carrito Gamer</span>
        </h1>

        <div className="row g-5">
          {/* COLUMNA IZQUIERDA: CATÁLOGO */}
          <div className="col-lg-8">
            <h4 className="mb-4 text-info">🔥 Productos Disponibles</h4>
            {loading ? (
              <div className="text-center text-light">
                Cargando inventario...
              </div>
            ) : (
              <div className="row g-3">
                {productos.map((p) => (
                  <div key={p.id} className="col-md-6 col-xl-4">
                    <Card producto={p} onAddToCart={addToCart} />
                  </div>
                ))}
                {productos.length === 0 && !loading && (
                  <p className="text-muted">
                    No hay productos en el inventario.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: RESUMEN CARRITO */}
          <div className="col-lg-4">
            <div
              className="gamer-panel sticky-top"
              style={{ top: "20px", zIndex: 90 }}
            >
              <div className="gamer-panel-header">
                <h5>🛍️ Resumen de Compra</h5>
              </div>
              <div className="gamer-panel-body">
                {carrito.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    <p>Tu carrito está vacío.</p>
                    <small>¡Equipa tu inventario!</small>
                  </div>
                ) : (
                  <>
                    <ul className="list-group list-group-flush mb-3">
                      {carrito.map((item) => (
                        <li
                          key={item.id}
                          className="list-group-item bg-transparent text-light border-secondary d-flex justify-content-between align-items-center px-0"
                        >
                          <div style={{ maxWidth: "55%" }}>
                            <h6
                              className="my-0 text-truncate"
                              title={item.nombre}
                            >
                              {item.nombre}
                            </h6>
                            <small className="text-muted">
                              ${item.precio} x {item.cantidad}
                            </small>
                          </div>
                          <div className="d-flex align-items-center gap-1">
                            <button
                              className="btn btn-sm btn-outline-secondary text-light"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              -
                            </button>
                            <span className="px-2">{item.cantidad}</span>
                            <button
                              className="btn btn-sm btn-outline-secondary text-light"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              +
                            </button>
                            <button
                              className="btn btn-sm btn-danger ms-2"
                              onClick={() => removeFromCart(item.id)}
                            >
                              ×
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="d-flex justify-content-between align-items-center border-top border-secondary pt-3 mt-3">
                      <h5>Total:</h5>
                      <h3 className="text-info">${total}</h3>
                    </div>

                    <button
                      className="btn btn-gamer-primary w-100 mt-3"
                      onClick={handleCheckout}
                    >
                      PAGAR Y DESCONTAR STOCK 💳
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL DE BOLETA (OVERLAY) --- */}
      {showReceipt && lastOrder && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.9)", zIndex: 9999 }}
        >
          <div
            className="gamer-panel p-4"
            style={{
              maxWidth: "500px",
              width: "90%",
              border: "2px solid #00f3ff",
              boxShadow: "0 0 30px rgba(0, 243, 255, 0.3)",
            }}
          >
            <div className="text-center mb-4">
              <h1 className="display-4">✅</h1>
              <h3 className="text-success">¡Compra Exitosa!</h3>
              <p className="text-muted small">
                Tu inventario ha sido actualizado.
              </p>
            </div>

            <div
              className="bg-dark p-3 rounded border border-secondary mb-4"
              style={{ fontFamily: "'Courier New', monospace" }}
            >
              <div className="text-center border-bottom border-secondary pb-2 mb-2">
                <h5 className="text-info m-0">GAMERSHOP RECEIPT</h5>
                <small className="text-muted">ID: #{lastOrder.id}</small>
              </div>

              <div className="mb-3">
                <small className="text-muted d-block">
                  Fecha: {lastOrder.fecha}
                </small>
              </div>

              <ul className="list-unstyled mb-3 border-bottom border-secondary pb-2">
                {lastOrder.items.map((item, index) => (
                  <li
                    key={index}
                    className="d-flex justify-content-between text-light small mb-1"
                  >
                    <span>
                      {item.cantidad} x {item.nombre}
                    </span>
                    <span>${item.precio * item.cantidad}</span>
                  </li>
                ))}
              </ul>

              <div className="d-flex justify-content-between fw-bold text-white fs-5">
                <span>TOTAL</span>
                <span className="text-success">${lastOrder.total}</span>
              </div>
            </div>

            <button
              className="btn btn-outline-info w-100"
              onClick={() => setShowReceipt(false)}
            >
              CERRAR Y SEGUIR COMPRANDO
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente Card con visualización de STOCK
function Card({ producto, onAddToCart }) {
  // Verificamos si hay stock (asumiendo que si stock es undefined o null es 0 por seguridad)
  const stockDisponible = producto.stock !== undefined ? producto.stock : 0;
  const sinStock = stockDisponible <= 0;

  return (
    <div
      className={`card h-100 text-center bg-dark border-secondary shadow-sm ${
        sinStock ? "opacity-50" : ""
      }`}
    >
      <div
        className="card-img-top bg-secondary d-flex align-items-center justify-content-center text-light"
        style={{ height: "180px", objectFit: "cover" }}
      >
        <span className="h1">🎮</span>
      </div>
      <div className="card-body d-flex flex-column">
        <h5
          className="card-title text-light text-truncate"
          title={producto.nombre}
        >
          {producto.nombre}
        </h5>

        {/* INDICADOR DE STOCK */}
        <div className="mb-2">
          {sinStock ? (
            <span className="badge bg-danger">AGOTADO</span>
          ) : (
            <span
              className={`badge ${
                stockDisponible < 5 ? "bg-warning text-dark" : "bg-success"
              }`}
            >
              Stock: {stockDisponible}
            </span>
          )}
        </div>

        <p className="card-text text-muted small text-truncate">
          {producto.categoria}
        </p>

        <div className="mt-auto">
          <p className="fw-bold text-info fs-5 mb-2">${producto.precio}</p>
          <button
            className="btn btn-success w-100 btn-sm"
            onClick={() => onAddToCart(producto)}
            disabled={sinStock}
          >
            {sinStock ? "Sin Stock" : "Agregar +"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Carrito;
