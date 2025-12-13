import React, { useState } from "react";

const ProductoForm = ({ onGuardar, categoriasDisponibles }) => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("");

  // ESTADO PARA LA LISTA DINÁMICA DE VARIANTES
  const [variantes, setVariantes] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !precio || !stock || !categoriaId || !imagen) {
      alert("Completa los campos obligatorios");
      return;
    }

    const nuevoProducto = {
      nombre,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      categoria: { id: parseInt(categoriaId) },
      descripcion,
      imagen,
      // Convertimos el array de objetos a un String JSON para guardarlo en la BD
      variantes: JSON.stringify(variantes),
    };

    onGuardar(nuevoProducto);

    // Limpiar
    setNombre("");
    setPrecio("");
    setStock("");
    setCategoriaId("");
    setDescripcion("");
    setImagen("");
    setVariantes([]); // Limpiamos variantes
  };

  // --- MÉTODOS PARA MANEJAR LA LISTA DE VARIANTES ---
  const agregarVariante = () => {
    setVariantes([...variantes, { color: "", url: "" }]);
  };

  const eliminarVariante = (index) => {
    const nuevas = [...variantes];
    nuevas.splice(index, 1);
    setVariantes(nuevas);
  };

  const actualizarVariante = (index, campo, valor) => {
    const nuevas = [...variantes];
    nuevas[index][campo] = valor;
    setVariantes(nuevas);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label small fw-bold text-secondary">
          Nombre
        </label>
        <input
          type="text"
          className="form-control rounded-3"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label small fw-bold text-secondary">
          Descripción
        </label>
        <textarea
          className="form-control rounded-3"
          rows="2"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        ></textarea>
      </div>

      <div className="mb-3">
        <label className="form-label small fw-bold text-secondary">
          Imagen Principal
        </label>
        <input
          type="text"
          className="form-control rounded-3"
          placeholder="https://..."
          value={imagen}
          onChange={(e) => setImagen(e.target.value)}
          required
        />
      </div>

      {/* --- SECCIÓN DINÁMICA DE VARIANTES --- */}
      <div className="mb-4 bg-body-tertiary p-3 rounded-4 border">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold text-primary m-0">
            <i className="bx bx-palette"></i> Variantes de Color
          </h6>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary rounded-pill"
            onClick={agregarVariante}
          >
            <i className="bx bx-plus"></i> Agregar Color
          </button>
        </div>

        {variantes.length === 0 && (
          <p className="text-muted small text-center">
            No hay variantes adicionales agregadas.
          </p>
        )}

        {variantes.map((v, index) => (
          <div
            key={index}
            className="row g-2 mb-2 align-items-end animate__animated animate__fadeIn"
          >
            <div className="col-4">
              <label className="small text-muted">Nombre Color</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Ej: Rojo Fuego"
                value={v.color}
                onChange={(e) =>
                  actualizarVariante(index, "color", e.target.value)
                }
              />
            </div>
            <div className="col-7">
              <label className="small text-muted">URL Imagen</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="https://..."
                value={v.url}
                onChange={(e) =>
                  actualizarVariante(index, "url", e.target.value)
                }
              />
            </div>
            <div className="col-1">
              <button
                type="button"
                className="btn btn-sm btn-danger w-100"
                onClick={() => eliminarVariante(index)}
              >
                <i className="bx bx-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* ----------------------------------- */}

      <div className="row">
        <div className="col-6 mb-3">
          <label className="form-label small fw-bold">Precio</label>
          <input
            type="number"
            className="form-control"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </div>
        <div className="col-6 mb-3">
          <label className="form-label small fw-bold">Stock</label>
          <input
            type="number"
            className="form-control"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="form-label small fw-bold">Categoría</label>
        <select
          className="form-select"
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          required
        >
          <option value="">Selecciona...</option>
          {categoriasDisponibles.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100 rounded-pill fw-bold"
      >
        Guardar Producto
      </button>
    </form>
  );
};

export default ProductoForm;
