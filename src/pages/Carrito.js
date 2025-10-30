import { useState, useEffect } from "react";

function Carrito() {
  // Estado local del carrito
  const [carrito, setCarrito] = useState([]);
  const [usuario, setUsuario] = useState(null);

  // Lista de productos disponibles
  const productos = [
    { id: 1, nombre: "Mouse Gamer", precio: 20000 },
    { id: 2, nombre: "Audífonos Gamer", precio: 55000 },
    { id: 3, nombre: "Teclado Gamer RGB", precio: 90000 },
    { id: 4, nombre: "Monitor Gamer", precio: 220000 },
    { id: 5, nombre: "Tarjeta Gráfica", precio: 1250000 },
  ];

  // Cargar usuario (si está logueado)
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUsuario(JSON.parse(userData));
  }, []);

  // Agregar un producto al carrito
  const agregarAlCarrito = (producto) => {
    const index = carrito.findIndex((p) => p.nombre === producto.nombre);
    if (index !== -1) {
      const nuevoCarrito = [...carrito];
      nuevoCarrito[index].cantidad += 1;
      setCarrito(nuevoCarrito);
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  // Eliminar un producto del carrito
  const eliminarDelCarrito = (index) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    setCarrito(nuevoCarrito);
  };

  // Calcular total
  const total = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  // Función para pagar
  const pagar = () => {
    if (!usuario) {
      alert("🔒 Debes iniciar sesión para realizar la compra.");
      window.location.href = "/login"; // Redirige sin useNavigate
      return;
    }

    if (carrito.length === 0) {
      alert("🛒 Tu carrito está vacío.");
      return;
    }

    alert("✅ ¡Compra realizada con éxito!");
    setCarrito([]); // Vaciar carrito
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4 text-center">Carrito de Compras</h1>

      {/* Productos disponibles */}
      <h4>Productos disponibles</h4>
      <div className="row mb-4">
        {productos.map((p) => (
          <div key={p.id} className="col-md-4 mb-3">
            <div className="card h-100 text-center">
              <div className="card-body">
                <h5 className="card-title">{p.nombre}</h5>
                <p className="card-text">${p.precio.toLocaleString()}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => agregarAlCarrito(p)}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sección del carrito */}
      <h4>Tu Carrito</h4>
      {carrito.length === 0 ? (
        <p className="text-muted">El carrito está vacío</p>
      ) : (
        <ul className="list-group mb-3">
          {carrito.map((item, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {item.nombre} x{item.cantidad}
              <div>
                <span className="me-3">
                  ${(item.precio * item.cantidad).toLocaleString()}
                </span>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminarDelCarrito(index)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Total */}
      <div className="alert alert-info text-center">
        Total: <strong>${total.toLocaleString()}</strong>
      </div>

      {/* Botón de pagar */}
      <div className="text-center">
        <button className="btn btn-success btn-lg" onClick={pagar}>
          💳 Pagar
        </button>
      </div>
    </div>
  );
}

export default Carrito;
