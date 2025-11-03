export default function Cards({ productos = [], onAddToCart }) {
  return (
    <div className="row g-3">
      {productos.map((p) => (
        <div key={p.id} className="col-md-4">
          <div className="card h-100 text-center">
            <img
              src={p.imagen}
              alt={p.nombre}
              className="card-img-top"
              style={{ height: "180px", objectFit: "cover" }}
            />
            <div className="card-body">
              <h5 className="card-title">{p.nombre}</h5>
              <p className="fw-bold">${p.precio}</p>
              <button
                className="btn btn-success"
                onClick={() => onAddToCart(p)}
              >
                Comprar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
