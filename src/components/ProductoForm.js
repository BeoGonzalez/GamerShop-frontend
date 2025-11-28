import React, { useState, useRef } from "react";

function ProductoForm({ onGuardar }) {
    // 1. Estados locales para el formulario
    const [nombre, setNombre] = useState("");
    const [categoria, setCategoria] = useState("");
    const [precio, setPrecio] = useState("");

    const inputRef = useRef(null);

    // 2. Función principal para manejar el envío
    const guardar = (e) => {
        // Previene el refresh de la página
        if (e) e.preventDefault();

        // Validación de campos
        if (!nombre.trim() || !categoria.trim() || !precio) {
            alert("❌ Por favor, ingresa todos los campos.");
            return;
        }

        const precioEntero = parseInt(precio);
        if (isNaN(precioEntero) || precioEntero <= 0) {
            alert("❌ El precio debe ser un número entero positivo.");
            return;
        }

        // Llama a la función del componente padre (Carrito.js)
        onGuardar({
            nombre: nombre.trim(),
            categoria: categoria.trim(),
            precio: precioEntero,
        });

        // Limpiar el formulario y enfocar
        setNombre("");
        setCategoria("");
        setPrecio("");
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    // 3. Manejar 'Enter'
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            guardar(e);
        }
    };

    return (
        <form className="row g-3 mb-4 border p-3 rounded bg-light" onSubmit={guardar}>
            {/* Input Nombre */}
            <div className="col-md-5">
                <label htmlFor="nombre" className="form-label fw-bold">Nombre</label>
                <input
                    ref={inputRef}
                    className="form-control"
                    placeholder="Nombre del producto"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    onKeyPress={handleKeyPress}
                    type="text"
                    id="nombre"
                    required
                />
            </div>

            {/* Input Categoría */}
            <div className="col-md-4">
                <label htmlFor="categoria" className="form-label fw-bold">Categoría</label>
                <input
                    className="form-control"
                    placeholder="Ej: Consola, Accesorio"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    onKeyPress={handleKeyPress}
                    type="text"
                    id="categoria"
                    required
                />
            </div>

            {/* Input Precio (INT) */}
            <div className="col-md-1">
                <label htmlFor="precio" className="form-label fw-bold">Precio (INT)</label>
                <input
                    className="form-control"
                    placeholder="59"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    onKeyPress={handleKeyPress}
                    type="number"
                    min="1"
                    id="precio"
                    required
                />
            </div>

            {/* Botón Guardar */}
            <div className="col-md-2 d-flex align-items-end">
                <button
                    className="btn btn-primary w-100"
                    type="submit"
                >
                    Guardar producto
                </button>
            </div>
        </form>
    );
}

export default ProductoForm;