import React, { useState } from "react";
import axios from "axios";

const API_URL = "https://gamershop-backend-1.onrender.com";

const ProductsManager = ({ productos = [], categorias = [], onRefresh }) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [prodId, setProdId] = useState(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagen: "",
    categoriaId: "",
  });

  // Estado para el Gestor Visual de Variantes
  const [variantesList, setVariantesList] = useState([]);
  const [varianteTemp, setVarianteTemp] = useState({ color: "", url: "" });

  const getHeaders = () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return null;
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- GESTIÓN DE VARIANTES ---
  const handleAddVariante = () => {
    if (!varianteTemp.color.trim() || !varianteTemp.url.trim()) {
      alert(
        "⚠️ Debes ingresar un Color y una URL de imagen para agregar la variante."
      );
      return;
    }
    setVariantesList([...variantesList, varianteTemp]);
    setVarianteTemp({ color: "", url: "" }); // Limpiar inputs
  };

  const handleRemoveVariante = (index) => {
    const newList = variantesList.filter((_, i) => i !== index);
    setVariantesList(newList);
  };

  // --- CARGAR EDICIÓN ---
  const cargarEdicion = (prod) => {
    setModoEdicion(true);
    setProdId(prod.id);

    // Parseo seguro del JSON de variantes
    let varsArray = [];
    if (prod.variantes) {
      try {
        const parsed = JSON.parse(prod.variantes);
        varsArray = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error("Error leyendo variantes:", e);
        varsArray = [];
      }
    }
    setVariantesList(varsArray);

    setFormData({
      nombre: prod.nombre,
      descripcion: prod.descripcion || "",
      precio: prod.precio,
      stock: prod.stock,
      imagen: prod.imagen || "",
      categoriaId: prod.categoria ? prod.categoria.id : "",
    });
  };

  const cancelarEdicion = () => {
    setModoEdicion(false);
    setProdId(null);
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      imagen: "",
      categoriaId: "",
    });
    setVariantesList([]);
    setVarianteTemp({ color: "", url: "" });
  };

  // --- ENVIAR DATOS ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. CORRECCIÓN ESLINT: Declaramos la variable UNA sola vez aquí
    let listaFinalVariantes = [...variantesList];

    // 2. BLINDAJE UX: Verificar si el usuario olvidó darle al botón (+)
    if (varianteTemp.color.trim() !== "" || varianteTemp.url.trim() !== "") {
      const confirmar = window.confirm(
        "⚠️ Tienes datos escritos en 'Variantes' pero no le diste al botón (+). \n\n¿Quieres agregarlos automáticamente antes de guardar?"
      );

      if (confirmar) {
        // Agregamos la variante pendiente a la lista final
        listaFinalVariantes.push(varianteTemp);

        // Limpiamos visualmente los inputs
        setVarianteTemp({ color: "", url: "" });
        // Actualizamos el estado visual también (opcional, por si falla el envío)
        setVariantesList(listaFinalVariantes);
      }
    }

    const headers = getHeaders();
    if (!headers) {
      alert("⚠️ Sesión expirada.");
      return;
    }

    if (!formData.categoriaId) {
      alert("⚠️ Selecciona una categoría.");
      return;
    }

    // Convertimos la lista a JSON String para Java
    const variantesJsonString = JSON.stringify(listaFinalVariantes);

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock),
      imagen: formData.imagen,
      variantes: variantesJsonString, // <--- Enviamos el JSON String corregido
      categoria: {
        id: parseInt(formData.categoriaId),
      },
    };

    const url = modoEdicion
      ? `${API_URL}/productos/${prodId}`
      : `${API_URL}/productos`;
    const method = modoEdicion ? "put" : "post";

    try {
      console.log("📤 Payload enviado:", payload);
      await axios({ method, url, data: payload, headers });

      alert(
        modoEdicion ? "✅ Actualizado correctamente" : "✅ Creado correctamente"
      );
      cancelarEdicion();
      onRefresh();
    } catch (error) {
      console.error(error);
      alert("❌ Error al guardar. Revisa la consola.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar?")) return;
    const headers = getHeaders();
    if (!headers) return;
    try {
      await axios.delete(`${API_URL}/productos/${id}`, { headers });
      alert("🗑️ Eliminado");
      onRefresh();
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  return (
    <div className="row g-4 animate__animated animate__fadeIn">
      {/* FORMULARIO */}
      <div className="col-lg-5">
        <div className="card border-0 shadow-sm rounded-4 h-100">
          <div className="card-header bg-transparent border-0 pt-4 px-4">
            <h5 className="fw-bold text-primary mb-0">
              {modoEdicion ? "✏️ Editar Producto" : "➕ Nuevo Producto"}
            </h5>
          </div>
          <div className="card-body px-4 pb-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="small text-muted">Nombre</label>
                <input
                  name="nombre"
                  className="form-control"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="small text-muted">Descripción</label>
                <textarea
                  name="descripcion"
                  className="form-control"
                  rows="2"
                  value={formData.descripcion}
                  onChange={handleChange}
                />
              </div>
              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="small text-muted">Precio</label>
                  <input
                    name="precio"
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={formData.precio}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="small text-muted">Stock</label>
                  <input
                    name="stock"
                    type="number"
                    className="form-control"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-2">
                <label className="small text-muted">Categoría</label>
                <select
                  name="categoriaId"
                  className="form-select"
                  value={formData.categoriaId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona...</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="small text-muted">URL Imagen Principal</label>
                <input
                  name="imagen"
                  className="form-control"
                  value={formData.imagen}
                  onChange={handleChange}
                />
              </div>

              {/* GESTOR VISUAL DE VARIANTES */}
              <div className="card bg-light border-0 p-3 mb-4 rounded-3">
                <label className="fw-bold small mb-2 text-dark">
                  <i className="bx bx-palette me-1"></i> Variantes de Color
                </label>

                <div className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Color (Ej: Rojo)"
                    value={varianteTemp.color}
                    onChange={(e) =>
                      setVarianteTemp({
                        ...varianteTemp,
                        color: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="URL Imagen"
                    value={varianteTemp.url}
                    onChange={(e) =>
                      setVarianteTemp({ ...varianteTemp, url: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="btn btn-dark btn-sm"
                    onClick={handleAddVariante}
                    title="Agregar Variante a la lista"
                  >
                    <i className="bx bx-plus"></i>
                  </button>
                </div>

                <div className="d-flex flex-column gap-2 mt-2">
                  {variantesList.map((v, i) => (
                    <div
                      key={i}
                      className="d-flex align-items-center justify-content-between bg-white p-2 rounded border shadow-sm"
                    >
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={v.url}
                          alt={v.color}
                          className="rounded border"
                          style={{
                            width: "30px",
                            height: "30px",
                            objectFit: "cover",
                          }}
                        />
                        <span className="small fw-bold">{v.color}</span>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm border-0 py-0"
                        onClick={() => handleRemoveVariante(i)}
                      >
                        <i className="bx bx-x fs-5"></i>
                      </button>
                    </div>
                  ))}
                  {variantesList.length === 0 && (
                    <small className="text-muted text-center fst-italic py-1">
                      Sin variantes agregadas.
                    </small>
                  )}
                </div>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className={`btn w-100 py-2 fw-bold btn-${
                    modoEdicion ? "warning" : "primary"
                  }`}
                >
                  <i
                    className={`bx ${
                      modoEdicion ? "bx-save" : "bx-plus-circle"
                    } me-2`}
                  ></i>
                  {modoEdicion ? "Actualizar" : "Guardar"}
                </button>
                {modoEdicion && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={cancelarEdicion}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* LISTA */}
      <div className="col-lg-7">
        <div className="card border-0 shadow-sm rounded-4 h-100">
          <div className="card-header bg-transparent border-0 pt-4 px-4">
            <h5 className="fw-bold text-primary mb-0">Inventario</h5>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Producto</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((prod) => (
                  <tr key={prod.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center">
                        <img
                          src={prod.imagen || "https://via.placeholder.com/40"}
                          alt={prod.nombre}
                          className="rounded border me-3"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                          }}
                        />
                        <span className="fw-bold small">{prod.nombre}</span>
                      </div>
                    </td>
                    <td className="fw-bold text-success">
                      ${prod.precio?.toLocaleString()}
                    </td>
                    <td>{prod.stock}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-1 border-0"
                        onClick={() => cargarEdicion(prod)}
                      >
                        <i className="bx bx-edit fs-5"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger border-0"
                        onClick={() => handleDelete(prod.id)}
                      >
                        <i className="bx bx-trash fs-5"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsManager;
