import { useState } from "react";

function Carrito() {
  // Estado local del carrito
  const [carrito, setCarrito] = useState([]);

  // Lista de productos disponibles
  const productos = [
    { id: 1, nombre: "GTA7", precio: 100000 },
    { id: 2, nombre: "Resident Evil 4 Remake", precio: 25000 },
    { id: 3, nombre: "Dying Light", precio: 50000 },
    { id: 4, nombre: "Minecraft", precio: 20000 },
  ];

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
    </div>
  );
}

export default Carrito;
