import React, { useState, useEffect } from "react";
import ProductoForm from "../components/ProductoForm";
import ProductoList from "../components/ProductoList";

const API_URL = "https://gamershop-backend-1.onrender.com/carrito";

function Carrito() {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    // Cargar productos al montar el componente
    useEffect(() => {
        cargarProductos();
    }, []);

    // Función para cargar productos desde el backend
    const cargarProductos = async () => {
        setCargando(true);
        setError(null);

        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error('Error al cargar productos del servidor');
            }

            const data = await response.json();
            setProductos(data);
        } catch (error) {
            console.error("Error al cargar productos:", error);
            setError("No se pudieron cargar los productos. Verifica tu conexión.");
        } finally {
            setCargando(false);
        }
    };

    // Función para guardar un nuevo producto
    const guardarProducto = async (nombre) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre }),
            });

            if (!response.ok) {
                throw new Error('Error al guardar el producto');
            }

            alert("✅ Producto guardado exitosamente");
            await cargarProductos(); // Recargar la lista
        } catch (error) {
            console.error("Error al guardar producto:", error);
            alert("❌ Error al guardar el producto. Intenta nuevamente.");
        }
    };

    // Función para eliminar un producto
    const eliminarProducto = async (id) => {
        // Confirmación antes de eliminar
        if (!window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el producto');
            }

            alert("✅ Producto eliminado exitosamente");
            await cargarProductos(); // Recargar la lista
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            alert("❌ Error al eliminar el producto. Intenta nuevamente.");
        }
    };

    return (
        <div className="container py-4">
            <h1 className="mb-4 text-center">🛒 Gestión de Productos</h1>

            <div className="card shadow-sm">
                <div className="card-body">
                    <h3 className="card-title">Administrar Productos en el Carrito</h3>

                    {/* Componente ProductoForm */}
                    <ProductoForm onGuardar={guardarProducto} />

                    {/* Mostrar error si existe */}
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    {/* Lista de productos */}
                    <div className="mt-4">
                        <h4>Lista de Productos</h4>

                        {cargando ? (
                            <div className="text-center py-3">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                                <p className="mt-2">Cargando productos...</p>
                            </div>
                        ) : (
                            <ProductoList
                                productos={productos}
                                onEliminar={eliminarProducto}
                            />
                        )}
                    </div>

                    {/* Botón para recargar */}
                    <div className="text-center mt-4">
                        <button
                            className="btn btn-secondary"
                            onClick={cargarProductos}
                            disabled={cargando}
                        >
                            {cargando ? "Cargando..." : "Recargar Lista"}
                        </button>
                    </div>

                    {/* Contador de productos */}
                    {!cargando && productos.length > 0 && (
                        <div className="alert alert-info mt-3 text-center">
                            Total de productos: <strong>{productos.length}</strong>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Carrito;