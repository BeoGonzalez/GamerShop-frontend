import React, { useState, useEffect } from "react";
import ProductoForm from "../components/ProductoForm";
import ProductoList from "../components/ProductoList";

// TIP: En proyectos reales, mueve esto a un archivo .env (REACT_APP_API_URL)
const API_URL = "https://gamershop-backend-1.onrender.com/carrito";

function Carrito() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    setCargando(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error al conectar con el servidor");
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error:", error);
      setError("No se pudo cargar el catálogo. ¿El backend está despierto?");
    } finally {
      setCargando(false);
    }
  };

  const guardarProducto = async (nuevoProducto) => {
    // Optimización: UI Optimista o actualización de estado local
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProducto),
      });

      if (!response.ok) throw new Error("Error al guardar");

      const productoGuardado = await response.json();

      // ACTUALIZACIÓN LOCAL: Agregamos el producto al estado sin recargar la API
      setProductos((prev) => [...prev, productoGuardado]);

      alert(`✅ Producto "${productoGuardado.nombre}" añadido.`);
    } catch (error) {
      console.error(error);
      alert(`❌ Error: ${error.message}`);
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;

    // UI Optimista: Lo borramos visualmente primero (se siente instantáneo)
    const backup = [...productos];
    setProductos(productos.filter((p) => p.id !== id));

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        // Si falla, revertimos el cambio visual
        setProductos(backup);
        throw new Error("No se pudo eliminar del servidor");
      }
      // Si todo sale bien, no necesitamos hacer nada más
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
      // Revertir en caso de error
      setProductos(backup);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-5 text-center text-uppercase fw-bold">
        🎮 GameZone <span className="text-primary">Manager</span>
      </h1>

      <div className="row g-4">
        {/* Columna Izquierda: Formulario */}
        <div className="col-lg-4">
          <div className="card shadow border-0">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Nuevo Item</h5>
            </div>
            <div className="card-body">
              <ProductoForm onGuardar={guardarProducto} />
              {error && (
                <div className="alert alert-danger mt-3 small">{error}</div>
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Lista */}
        <div className="col-lg-8">
          <div className="card shadow border-0">
            <div className="card-body">
              <h4 className="card-title mb-4">
                Inventario{" "}
                <span className="badge bg-dark ms-2">{productos.length}</span>
              </h4>

              {cargando ? (
                <div className="d-flex justify-content-center py-5">
                  <div
                    className="spinner-border text-primary"
                    role="status"
                  ></div>
                </div>
              ) : (
                <ProductoList
                  productos={productos}
                  onEliminar={eliminarProducto}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carrito;
