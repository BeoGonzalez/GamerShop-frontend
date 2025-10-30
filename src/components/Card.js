function Card({ producto, onAddToCart }) {
  const handleBuy = () => {
    const user = localStorage.getItem("user");

    if (!user) {
      alert("🔐 Debes iniciar sesión para comprar");
      window.location.href = "/login"; // Redirige sin useNavigate
      return;
    }

    onAddToCart(producto);
  };

  return (
    <div className="card h-100 text-center">
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className="card-img-top"
        style={{ height: "180px", objectFit: "cover" }}
      />
      <div className="card-body">
        <h5 className="card-title">{producto.nombre}</h5>
        <p className="fw-bold">${producto.precio}</p>
        <button className="btn btn-success" onClick={handleBuy}>
          Comprar
        </button>
      </div>
    </div>
  );
}

export default Card;
