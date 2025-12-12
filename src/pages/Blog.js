import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Blog() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      usuario: "JuanGamer99",
      titulo: "¿Vale la pena la RTX 4060?",
      contenido: "Hola a todos, estoy pensando en actualizar mi gráfica...",
      likes: 12,
      fecha: "Hace 2 horas",
    },
    {
      id: 2,
      usuario: "MariaSims",
      titulo: "Busco gente para jugar Valheim",
      contenido: "Tenemos un servidor dedicado, buscamos 2 personas más.",
      likes: 5,
      fecha: "Hace 5 horas",
    },
  ]);

  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevoContenido, setNuevoContenido] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    const user = localStorage.getItem("username");
    if (token && user) {
      setIsAuth(true);
      setUsername(user);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nuevoTitulo.trim() || !nuevoContenido.trim()) return;

    const nuevoPost = {
      id: posts.length + 1,
      usuario: username,
      titulo: nuevoTitulo,
      contenido: nuevoContenido,
      likes: 0,
      fecha: "Justo ahora",
    };

    setPosts([nuevoPost, ...posts]);
    setNuevoTitulo("");
    setNuevoContenido("");
  };

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* COLUMNA IZQUIERDA */}
        <div className="col-lg-4">
          <div className="sticky-top" style={{ top: "90px" }}>
            <div className="mb-4">
              {/* text-body asegura que sea blanco en dark mode */}
              <h2 className="fw-bold text-primary">
                <i className="bx bx-message-square-detail me-2"></i>
                Foro Gamer
              </h2>
              <p className="text-body">Únete a la conversación.</p>
            </div>

            {isAuth ? (
              <div className="card shadow-sm border-0 bg-body-tertiary rounded-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-body">
                    <i className="bx bx-edit"></i> Crear nuevo tema
                  </h5>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      {/* Quitamos text-secondary, dejamos form-label que arreglamos en CSS */}
                      <label className="form-label fw-bold small">TÍTULO</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        placeholder="Ej: Duda con tarjeta gráfica..."
                        value={nuevoTitulo}
                        onChange={(e) => setNuevoTitulo(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold small">
                        CONTENIDO
                      </label>
                      <textarea
                        className="form-control rounded-3"
                        rows="4"
                        placeholder="Escribe aquí tu pregunta o comentario..."
                        value={nuevoContenido}
                        onChange={(e) => setNuevoContenido(e.target.value)}
                        required
                      ></textarea>
                    </div>
                    <button className="btn btn-primary w-100 rounded-pill fw-bold text-white">
                      Publicar <i className="bx bx-send ms-1"></i>
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="card shadow-sm border-0 bg-body-tertiary rounded-4 text-center p-4">
                <i className="bx bx-lock-alt fs-1 text-primary mb-2"></i>
                <h5 className="fw-bold text-body">Acceso Restringido</h5>
                <p className="text-muted small">
                  Inicia sesión para crear un tema.
                </p>
                <Link
                  to="/login"
                  className="btn btn-outline-primary rounded-pill w-100"
                >
                  Ir al Login
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="col-lg-8">
          <h4 className="fw-bold mb-4 text-body">Discusiones Recientes</h4>

          <div className="d-flex flex-column gap-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="card border-0 shadow-sm rounded-4 animate__animated animate__fadeIn bg-body-tertiary"
              >
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
                        style={{ width: "40px", height: "40px" }}
                      >
                        {post.usuario.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0 text-body">
                          {post.usuario}
                        </h6>
                        <small
                          className="text-muted"
                          style={{ fontSize: "0.8rem" }}
                        >
                          {post.fecha}
                        </small>
                      </div>
                    </div>
                    <span className="badge bg-primary-subtle text-primary-emphasis rounded-pill border border-primary-subtle">
                      <i className="bx bx-hash"></i> General
                    </span>
                  </div>

                  <h5 className="fw-bold text-primary mt-3">{post.titulo}</h5>
                  <p className="text-body">{post.contenido}</p>

                  <div className="d-flex align-items-center gap-3 mt-3 border-top pt-3 border-secondary-subtle">
                    <button className="btn btn-sm btn-link text-decoration-none text-muted d-flex align-items-center gap-1 p-0 hover-primary">
                      <i className="bx bx-heart fs-5"></i> {post.likes} Me gusta
                    </button>
                    <button className="btn btn-sm btn-link text-decoration-none text-muted d-flex align-items-center gap-1 p-0 hover-primary">
                      <i className="bx bx-comment fs-5"></i> Responder
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog;
