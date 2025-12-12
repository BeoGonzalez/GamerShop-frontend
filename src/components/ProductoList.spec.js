import React from "react";
import { render, screen } from "@testing-library/react";
import ProductoList from "./ProductoList";

describe("Componente: ProductoList", () => {
  // Creamos espías para las funciones que recibe el componente
  const mockEliminar = jasmine.createSpy("onEliminar");
  const mockActualizarStock = jasmine.createSpy("onActualizarStock");

  it("debería mostrar mensaje si la lista está vacía", () => {
    render(
      <ProductoList
        productos={[]}
        onEliminar={mockEliminar}
        onActualizarStock={mockActualizarStock}
      />
    );
    // Busca parte del texto "No hay productos..."
    expect(screen.getByText(/No hay productos/i)).toBeTruthy();
  });

  it("debería renderizar una tabla con productos", () => {
    // Datos de prueba simulados
    const productosFalsos = [
      {
        id: 1,
        nombre: "Teclado Gamer",
        categoria: { nombre: "Periféricos" },
        precio: 50000,
        stock: 10,
        imagen: null,
      },
    ];

    render(
      <ProductoList
        productos={productosFalsos}
        onEliminar={mockEliminar}
        onActualizarStock={mockActualizarStock}
      />
    );

    // 1. Verificar nombre
    expect(screen.getByText("Teclado Gamer")).toBeTruthy();

    // 2. CORRECCIÓN DEL PRECIO (Usando Regex)
    // Explicación del Regex /\$\s?50[.,]000/:
    // \$   -> Busca el signo de dólar literal
    // \s?  -> Busca un espacio opcional (tu HTML tiene uno)
    // 50   -> El número 50
    // [.,] -> Busca un punto O una coma
    // 000  -> Los ceros finales
    expect(screen.getByText(/\$\s?50[.,]000/)).toBeTruthy();

    // 3. Verificar categoría
    expect(screen.getByText("Periféricos")).toBeTruthy();
  });
});
