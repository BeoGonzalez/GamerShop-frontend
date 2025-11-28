import React from 'react';

// ProductoList ahora acepta 'productos' y 'onEliminar' como props
// Toda la lógica de la API (GET/DELETE) vive en Carrito.js
function ProductoList({ productos, onEliminar }) {

    // Verificación si la lista está vacía
    if (!productos || productos.length === 0) {
        return (
            <div className="alert alert-warning text-center">
                No hay productos cargados en la base de datos.
            </div>
        );
    }

    // Corregido el typo 'retrun' a 'return'
    return (
        <ul className="list-group">
            {productos.map((producto) => (
                <li
                    key={producto.id}
                    // Añadimos 'align-items-center' para centrado vertical y 'justify-content-between'
                    className="list-group-item d-flex justify-content-between align-items-center"
                >
                    {/* Contenedor de la información del producto */}
                    <div className="d-flex flex-column flex-md-row align-items-md-center">
                        <strong className="text-primary me-md-3">{producto.nombre}</strong>

                        {/* Campo Categoría */}
                        <span className="badge bg-secondary me-md-3 mt-1 mt-md-0">
                            {producto.categoria}
                        </span>

                        {/* Campo Precio (Entero) */}
                        <span className="badge bg-success me-md-3 mt-1 mt-md-0">
                            ${producto.precio}
                        </span>

                        <small className="text-muted mt-1 mt-md-0">ID: {producto.id}</small>
                    </div>

                    {/* Botón de eliminación con la clase y handler corregidos */}
                    <button
                        className="btn btn-danger btn-sm"
                        // Llama a la función onEliminar del padre con el ID
                        onClick={() => onEliminar(producto.id)}
                        aria-label={`Eliminar ${producto.nombre}`}
                    >
                        Eliminar
                    </button>
                </li>
            ))}
        </ul>
    );
}

export default ProductoList;