import React, { useState, useEffect } from "react";

const ProductoForm = ({ onGuardar, categoriasDisponibles, productoEditar }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [imagen, setImagen] = useState(""); // Portada

  // Usaremos este estado para manejar las fotos extra
  const [galeria, setGaleria] = useState([]);

  useEffect(() => {
    if (productoEditar) {
      setNombre(productoEditar.nombre);
      setDescripcion(productoEditar.descripcion);
      setPrecio(productoEditar.precio);
      setStock(productoEditar.stock);
      setImagen(productoEditar.imagen);
      setCategoriaId(productoEditar.categoria?.id || "");

      // --- CAMBIO CLAVE: LEEMOS DE 'variantes' ---
      try {
        if (productoEditar.variantes) {
          // Intentamos convertir el texto JSON a un array
          const variantesParsed = JSON.parse(productoEditar.variantes);
          // Si es un array, lo usamos como galería
          if (Array.isArray(variantesParsed)) {
            setGaleria(variantesParsed);
          }
        }
      } catch (error) {
        console.error("Error al leer variantes como galería:", error);
        setGaleria([]);
      }
    } else {
      // Limpiar todo
      setNombre("");
      setDescripcion("");
      setPrecio("");
      setStock("");
      setImagen("");
      setCategoriaId("");
      setGaleria([]);
    }
  }, [productoEditar]);

  // --- MÉTODOS DE GALERÍA ---
  const agregarCampoImagen = () => setGaleria([...galeria, ""]);

  const cambiarUrlImagen = (index, nuevaUrl) => {
    const nuevaGaleria = [...galeria];
    nuevaGaleria[index] = nuevaUrl;
    setGaleria(nuevaGaleria);
  };

  const eliminarImagen = (index) => {
    const nuevaGaleria = galeria.filter((_, i) => i !== index);
    setGaleria(nuevaGaleria);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const producto = {
      nombre,
      descripcion,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      imagen,
      categoria: { id: parseInt(categoriaId) },

      // --- CAMBIO CLAVE: GUARDAMOS LA GALERÍA EN 'variantes' ---
      // Tu backend espera este campo, así que aquí metemos las fotos extra
      variantes: JSON.stringify(galeria),
    };
    onGuardar(producto);
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 p-4 mb-4 animate__animated animate__fadeIn">
      <h5 className="mb-4 text-primary fw-bold border-bottom pb-2">
        {productoEditar ? "✏️ Editar Producto" : "✨ Nuevo Producto"}
      </h5>

      <form onSubmit={handleSubmit}>
        {/* Fila 1 */}
        <div className="row g-3 mb-3">
          <div className="col-md-8">
            <label className="form-label fw-bold">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-bold">Categoría</label>
            <select
              className="form-select"
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              required
            >
              <option value="">Seleccionar...</option>
              {categoriasDisponibles.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Fila 2 */}
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Precio ($)</label>
            <input
              type="number"
              className="form-control"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">Stock</label>
            <input
              type="number"
              className="form-control"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>
        </div>

        <hr className="my-4 opacity-25" />

        {/* SECCIÓN IMÁGENES */}
        <h6 className="text-body-secondary fw-bold mb-3">
          📸 Gestión de Imágenes
        </h6>

        {/* Portada */}
        <div className="mb-4 p-3 border rounded-3 bg-body-tertiary">
          <label className="form-label fw-bold text-primary">
            Portada Principal
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bx bx-image"></i>
            </span>
            <input
              type="text"
              className="form-control"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              placeholder="URL principal..."
              required
            />
          </div>
          {imagen && (
            <div className="mt-2 text-center">
              <img
                src={imagen}
                alt="Preview"
                className="rounded shadow-sm"
                style={{ maxHeight: "150px" }}
              />
            </div>
          )}
        </div>

        {/* Galería (Guardada en Variantes) */}
        <div className="mb-4">
          <label className="form-label fw-bold d-flex justify-content-between">
            <span>Galería Extra</span>
            <button
              type="button"
              className="btn btn-sm btn-outline-success rounded-pill"
              onClick={agregarCampoImagen}
            >
              <i className="bx bx-plus-circle"></i> Agregar Foto
            </button>
          </label>

          {galeria.length === 0 && (
            <div className="text-body-secondary small fst-italic">
              Sin fotos extra.
            </div>
          )}

          <div className="d-flex flex-column gap-2">
            {galeria.map((url, index) => (
              <div
                key={index}
                className="d-flex align-items-center gap-2 p-2 border rounded bg-body-tertiary"
              >
                <div
                  className="bg-body rounded border d-flex justify-content-center align-items-center overflow-hidden"
                  style={{ width: "50px", height: "50px" }}
                >
                  {url ? (
                    <img
                      src={url}
                      alt="min"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <i className="bx bx-image"></i>
                  )}
                </div>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={url}
                  onChange={(e) => cambiarUrlImagen(index, e.target.value)}
                  placeholder="URL..."
                />
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => eliminarImagen(index)}
                >
                  <i className="bx bx-trash"></i>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label fw-bold">Descripción</label>
          <textarea
            className="form-control"
            rows="3"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          ></textarea>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 py-2 fw-bold rounded-pill shadow-sm"
        >
          <i className="bx bx-save me-2"></i>{" "}
          {productoEditar ? "Guardar" : "Crear"}
        </button>
      </form>
    </div>
  );
};

export default ProductoForm;
