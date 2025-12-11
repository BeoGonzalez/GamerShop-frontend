import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Blog() {
  // --- 1. ESTADO DE AUTENTICACIÓN ---
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);

  // --- 2. DATOS FALSOS INICIALES ---
  const initialPosts = [
    {
      id: 1,
      author: "JuanGamer99",
      role: "USER",
      date: "10/12/2025",
      title: "Duda sobre la RTX 4060",
      content:
        "¿Alguien sabe si esta tarjeta es compatible con una fuente de 500W? Quiero actualizar mi PC pero no tengo mucho presupuesto para la fuente.",
      comments: [
        {
          id: 101,
          author: "Soporte GamerShop",
          role: "ADMIN",
          date: "10/12/2025",
          content:
            "Hola Juan. Sí, la RTX 4060 es muy eficiente. Con una fuente de 500W certificada (80 Plus Bronze o superior) no tendrás ningún problema.",
        },
        {
          id: 102,
          author: "PedroTech",
          role: "USER",
          date: "10/12/2025",
          content:
            "Yo tengo esa misma configuración y me va de maravilla. Recomendado.",
        },
      ],
    },
    {
      id: 2,
      author: "MariaStreams",
      role: "USER",
      date: "09/12/2025",
      title: "¿Cuándo llegan los nuevos teclados mecánicos?",
      content:
        "Estoy esperando stock de los teclados 60% blancos. ¿Tienen fecha estimada?",
      comments: [
        {
          id: 201,
          author: "Ventas GamerShop",
          role: "ADMIN",
          date: "09/12/2025",
          content:
            "Estimada María, recibiremos un nuevo lote este viernes. Te recomendamos estar atenta a la sección de Novedades.",
        },
      ],
    },
    {
      id: 3,
      author: "Carlos_FPS",
      role: "USER",
      date: "08/12/2025",
      title: "Problema con mi envío",
      content:
        "Hice una compra hace 3 días y aún figura en preparación. ¿Es normal?",
      comments: [
        {
          id: 301,
          author: "Logística GamerShop",
          role: "ADMIN",
          date: "08/12/2025",
          content:
            "Hola Carlos. Tuvimos una alta demanda por el CyberWeek. Tu pedido ya fue despachado hoy, deberías recibir el número de seguimiento por correo en breve.",
        },
        {
          id: 302,
          author: "Carlos_FPS",
          role: "USER",
          date: "08/12/2025",
          content: "Muchas gracias por la respuesta rápida.",
        },
      ],
    },
  ];

  const [posts, setPosts] = useState(initialPosts);

  // Estados para formularios
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  // Estado para manejar los inputs de comentarios
  const [commentInputs, setCommentInputs] = useState({});

  // --- 3. EFECTO: DETECTAR USUARIO LOGUEADO ---
  useEffect(() => {
    const user = localStorage.getItem("username");
    const role = localStorage.getItem("rol");
    if (user) {
      setCurrentUser(user);
      setCurrentRole(role);
    }
  }, []);

  // --- 4. FUNCIÓN: CREAR NUEVA PUBLICACIÓN ---
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost = {
      id: Date.now(),
      author: currentUser,
      role: currentRole,
      date: new Date().toLocaleDateString("es-ES"),
      title: newPostTitle,
      content: newPostContent,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle("");
    setNewPostContent("");
    alert("Publicación creada con éxito.");
  };

  // --- 5. FUNCIÓN: RESPONDER (COMENTAR) ---
  const handleCommentChange = (postId, value) => {
    setCommentInputs({ ...commentInputs, [postId]: value });
  };

  const handleSubmitComment = (postId) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: Date.now(),
              author: currentUser,
              role: currentRole,
              date: new Date().toLocaleDateString("es-ES"),
              content: text,
            },
          ],
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    setCommentInputs({ ...commentInputs, [postId]: "" });
  };

  return (
    <div className="container py-5 mt-4">
      {/* ESTILOS CSS LOCALES PARA FORZAR EL COLOR NEGRO */}
      <style>
        {`
          .force-black-text {
            color: #000000 !important;
          }
          /* Inputs con fondo blanco y letra negra para contraste */
          .input-high-contrast {
            background-color: #ffffff !important;
            color: #000000 !important;
            border: 1px solid #ced4da;
          }
          .input-high-contrast::placeholder {
            color: #6c757d;
          }
        `}
      </style>

      {/* HEADER DEL BLOG */}
      <div className="text-center mb-5 animate__animated animate__fadeInDown">
        <div className="d-inline-flex align-items-center justify-content-center p-3 bg-primary bg-opacity-10 rounded-circle text-primary mb-3">
          <i
            className="bx bx-message-square-dots"
            style={{ fontSize: "3rem" }}
          ></i>
        </div>
        <h1 className="fw-bold display-5">Comunidad GamerShop</h1>
        <p className="text-muted lead">
          Resuelve tus dudas, comparte tu setup y habla con nuestros expertos.
        </p>
      </div>

      <div className="row g-5">
        {/* COLUMNA IZQUIERDA: FORMULARIO DE NUEVO TEMA */}
        <div className="col-lg-4 animate__animated animate__fadeInLeft">
          <div
            className="card border-0 shadow-lg rounded-4 position-sticky"
            style={{ top: "100px" }}
          >
            <div className="card-header bg-primary text-white p-4 rounded-top-4 border-0">
              <h5 className="mb-0 fw-bold">
                <i className="bx bx-edit"></i> Crear Tema
              </h5>
            </div>
            <div className="card-body p-4">
              {currentUser ? (
                <form onSubmit={handleCreatePost}>
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-uppercase text-muted">
                      Título
                    </label>
                    <input
                      type="text"
                      className="form-control input-high-contrast" // Clase personalizada
                      placeholder="Ej: Duda con tarjeta gráfica..."
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-uppercase text-muted">
                      Pregunta / Contenido
                    </label>
                    <textarea
                      className="form-control input-high-contrast" // Clase personalizada
                      rows="4"
                      placeholder="Escribe aquí tu consulta..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100 fw-bold rounded-pill"
                  >
                    <i className="bx bx-send"></i> Publicar
                  </button>
                </form>
              ) : (
                <div className="text-center py-4">
                  <i
                    className="bx bx-lock-alt text-muted"
                    style={{ fontSize: "3rem" }}
                  ></i>
                  <p className="mt-3 text-muted">
                    Inicia sesión para crear un tema o responder preguntas.
                  </p>
                  <Link
                    to="/login"
                    className="btn btn-outline-primary rounded-pill px-4 fw-bold"
                  >
                    Iniciar Sesión
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: LISTA DE POSTS */}
        <div className="col-lg-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="card border-0 shadow-sm rounded-4 mb-4 animate__animated animate__fadeInUp"
            >
              <div className="card-body p-4">
                {/* CABECERA DEL POST */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className={`rounded-circle p-2 d-flex align-items-center justify-content-center text-white ${
                        post.role === "ADMIN" ? "bg-primary" : "bg-secondary"
                      }`}
                      style={{ width: "45px", height: "45px" }}
                    >
                      <i
                        className={`bx ${
                          post.role === "ADMIN" ? "bx-support" : "bx-user"
                        }`}
                        style={{ fontSize: "1.5rem" }}
                      ></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0 d-flex align-items-center gap-2 text-dark">
                        {post.author}
                        {post.role === "ADMIN" && (
                          <span
                            className="badge bg-primary bg-opacity-10 text-primary"
                            style={{ fontSize: "0.7rem" }}
                          >
                            STAFF
                          </span>
                        )}
                      </h6>
                      <small className="text-muted">
                        <i className="bx bx-calendar"></i> {post.date}
                      </small>
                    </div>
                  </div>
                </div>

                {/* CONTENIDO DEL POST (TEXTO NEGRO) */}
                <h4 className="fw-bold text-primary">{post.title}</h4>
                {/* Cambio aquí: force-black-text para que se vea negro siempre */}
                <p className="force-black-text">{post.content}</p>

                <hr className="my-4 opacity-10" />

                {/* SECCIÓN DE COMENTARIOS */}
                <h6 className="fw-bold mb-4 text-muted d-flex align-items-center gap-2">
                  <i className="bx bx-comment-detail"></i> Respuestas (
                  {post.comments.length})
                </h6>

                <div className="d-flex flex-column gap-3 mb-4">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="d-flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <i
                          className={`bx ${
                            comment.role === "ADMIN"
                              ? "bx-badge-check text-primary"
                              : "bx-user-circle text-secondary"
                          }`}
                          style={{ fontSize: "2rem" }}
                        ></i>
                      </div>
                      <div className="bg-light p-3 rounded-3 w-100 border">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-bold small d-flex align-items-center gap-1 text-dark">
                            {comment.author}
                            {comment.role === "ADMIN" && (
                              <i
                                className="bx bxs-check-circle text-primary"
                                title="Verificado"
                              ></i>
                            )}
                          </span>
                          <small
                            className="text-muted"
                            style={{ fontSize: "0.75rem" }}
                          >
                            {comment.date}
                          </small>
                        </div>
                        {/* Texto del comentario en negro */}
                        <p className="mb-0 small force-black-text">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}

                  {post.comments.length === 0 && (
                    <p className="text-muted small fst-italic">
                      Aún no hay respuestas. ¡Sé el primero!
                    </p>
                  )}
                </div>

                {/* FORMULARIO DE RESPUESTA */}
                {currentUser && (
                  <div className="d-flex gap-2 mt-3">
                    <input
                      type="text"
                      className="form-control rounded-pill px-3 input-high-contrast" // Fondo blanco, letra negra
                      placeholder="Escribe una respuesta..."
                      value={commentInputs[post.id] || ""}
                      onChange={(e) =>
                        handleCommentChange(post.id, e.target.value)
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSubmitComment(post.id)
                      }
                    />
                    <button
                      className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center p-2"
                      onClick={() => handleSubmitComment(post.id)}
                      disabled={!commentInputs[post.id]}
                    >
                      <i className="bx bx-send"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Blog;
