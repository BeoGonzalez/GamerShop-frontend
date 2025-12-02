import React, { useState, useEffect } from "react";
import "../Carrito.css"; // Asegúrate de tener los estilos

const API_URL = "https://gamershop-backend-1.onrender.com/api/producto";

function Carrito() {
  // Estado para el catálogo de productos (Base de Datos)
  const [productos, setProductos] = useState([]);

  // Estado para el carrito del usuario
  const [carrito, setCarrito] = useState(() => {
    // Intentar recuperar el carrito guardado del usuario
    const saved = localStorage.getItem("user_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(false);

  // 1. Cargar productos desde la Base de Datos al iniciar
  useEffect(() => {
    fetchProductos();
  }, []);

  // 2. Guardar carrito en LocalStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("user_cart", JSON.stringify(carrito));
  }, [carrito]);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      // Obtenemos el token para autenticarnos (si tu API requiere auth para ver productos)
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(API_URL, { headers });
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

  // --- LÓGICA DEL CRUD DEL CARRITO ---

  // A. Agregar producto al carrito
  const addToCart = (producto) => {
    // Verificar sesión
    const token = localStorage.getItem("token");
    if (!token) {
      alert("🔐 Debes iniciar sesión para comprar");
      window.location.href = "/login";
      return;
    }

    setCarrito((prevCarrito) => {
      // Verificar si el producto ya existe en el carrito
      const itemExists = prevCarrito.find((item) => item.id === producto.id);

      if (itemExists) {
        // Si existe, aumentamos la cantidad
        return prevCarrito.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        // Si no existe, lo agregamos con cantidad 1
        return [...prevCarrito, { ...producto, cantidad: 1 }];
      }
    });
  };

  // B. Eliminar producto del carrito
  const removeFromCart = (id) => {
    if (window.confirm("¿Eliminar producto del carrito?")) {
      setCarrito((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // C. Aumentar/Disminuir cantidad
  const updateQuantity = (id, amount) => {
    setCarrito((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.cantidad + amount);
          return { ...item, cantidad: newQuantity };
        }
        return item;
      })
    );
  };

  // Calcular Total
  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  return (
    <div className="gamer-container py-5">
      <div className="container">
        <h1 className="text-center gamer-title mb-5">
          🛒 Tu <span className="highlight">Carrito Gamer</span>
        </h1>

        <div className="row g-5">
          {/* SECCIÓN IZQUIERDA: CATÁLOGO DE PRODUCTOS (DB) */}
          <div className="col-lg-8">
            <h4 className="mb-4 text-info">🔥 Productos Disponibles</h4>
            {loading ? (
              <div className="text-center text-light">Cargando arsenal...</div>
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

          {/* SECCIÓN DERECHA: RESUMEN DEL CARRITO (CRUD USUARIO) */}
          <div className="col-lg-4">
            <div
              className="gamer-panel sticky-top"
              style={{ top: "20px", zIndex: 100 }}
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
                          <div style={{ maxWidth: "60%" }}>
                            <h6 className="my-0 text-truncate">
                              {item.nombre}
                            </h6>
                            <small className="text-muted">
                              ${item.precio} x {item.cantidad}
                            </small>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            {/* Botones de Cantidad */}
                            <div
                              className="btn-group btn-group-sm"
                              role="group"
                            >
                              <button
                                className="btn btn-outline-secondary text-light"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                -
                              </button>
                              <button
                                className="btn btn-outline-secondary text-light"
                                disabled
                              >
                                {item.cantidad}
                              </button>
                              <button
                                className="btn btn-outline-secondary text-light"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                +
                              </button>
                            </div>
                            {/* Botón Eliminar */}
                            <button
                              className="btn btn-sm btn-danger"
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

                    <button className="btn btn-gamer-primary w-100 mt-3">
                      PROCEDER AL PAGO 💳
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENTE CARD (Integrado para que funcione directo) ---
function Card({ producto, onAddToCart }) {
  const handleBuy = () => {
    onAddToCart(producto);
  };

  return (
    <div className="card h-100 text-center bg-dark border-secondary shadow-sm card-hover">
      {/* Placeholder de imagen si no viene en DB */}
      <div
        className="card-img-top bg-secondary d-flex align-items-center justify-content-center text-light"
        style={{ height: "180px", objectFit: "cover" }}
      >
        {/* Aquí iría: <img src={producto.imagen} ... /> si tu DB tiene campo imagen */}
        <span className="h1">🎮</span>
      </div>

      <div className="card-body d-flex flex-column">
        <h5
          className="card-title text-light text-truncate"
          title={producto.nombre}
        >
          {producto.nombre}
        </h5>
        <p className="card-text text-muted small text-truncate">
          {producto.categoria}
        </p>
        <div className="mt-auto">
          <p className="fw-bold text-info fs-5 mb-2">${producto.precio}</p>
          <button className="btn btn-success w-100 btn-sm" onClick={handleBuy}>
            Agregar +
          </button>
        </div>
      </div>
    </div>
  );
}

export default Carrito;
