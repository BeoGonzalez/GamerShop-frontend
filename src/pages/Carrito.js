import React, { useState, useEffect } from "react";
import ProductoForm from "../components/ProductoForm";
import ProductoList from "../components/ProductoList";

const API_URL = "https://gamershop-backend-1.onrender.com/carrito";

function Carrito() {
    // Estados principales
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    // useEffect para cargar datos al inicio (GET /carrito)
    useEffect(() => {
        cargarProductos();
    }, []);

    // Función para cargar productos (Implementa el GET)
    const cargarProductos = async () => {
        setCargando(true);
        setError(null);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText || 'Error desconocido'}`);
            }
            const data = await response.json();
            setProductos(data);
        } catch (error) {
            console.error("Error al cargar productos:", error);
            setError(`No se pudieron cargar los productos. Asegúrate de que Spring Boot esté corriendo. Detalle: ${error.message}`);
            setProductos([]);
        } finally {
            setCargando(false);
        }
    };

    // Función para guardar un nuevo producto (Implementa el POST)
    const guardarProducto = async (nuevoProducto) => {
        // Recibe { nombre, categoria, precio } desde ProductoForm
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoProducto),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al guardar: ${errorText}`);
            }

            const productoGuardado = await response.json();
            alert(`✅ Producto "${productoGuardado.nombre}" guardado exitosamente.`);
            await cargarProductos(); // Recargar la lista
        } catch (error) {
            console.error("Error al guardar producto:", error);
            alert(`❌ Error al guardar. Detalle: ${error.message}`);
        }
    };

    // Función para eliminar un producto (Implementa el DELETE)
    const eliminarProducto = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al eliminar: ${errorText}`);
            }

            alert("✅ Producto eliminado exitosamente");
            await cargarProductos(); // Recargar la lista
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            alert(`❌ Error al eliminar. Detalle: ${error.message}`);
        }
    };

    return (
        <div className="container py-4">
            <h1 className="mb-4 text-center">⚙️ GameZone - Gestión de Productos</h1>

            <div className="card shadow-sm">
                <div className="card-body">
                    <h3 className="card-title">Añadir Nuevo Producto</h3>

                    {/* Paso 1: Pasar la función de guardado al formulario */}
                    <ProductoForm onGuardar={guardarProducto} />

                    {error && (
                        <div className="alert alert-danger mt-4" role="alert">
                            <strong>Error de Conexión:</strong> {error}
                        </div>
                    )}

                    <div className="mt-5">
                        <h4>Lista de Productos ({productos.length})</h4>
                        <hr/>
                        {cargando ? (
                            <div className="text-center py-3">
                                <div className="spinner-border text-primary" role="status"></div>
                                <p className="mt-2">Cargando productos...</p>
                            </div>
                        ) : (
                            /* Paso 2: Pasar los datos y la función de eliminación a la lista */
                            <ProductoList
                                productos={productos}
                                onEliminar={eliminarProducto}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Carrito;