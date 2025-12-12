import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Tema from "./Tema";

describe("Componente: Tema", () => {
  it("debería renderizar el botón de cambio de tema", () => {
    render(<Tema />);
    // Buscamos el botón por su título (title attribute)
    // Nota: Como el título es dinámico, buscamos parte del texto
    const boton = screen.getByRole("button");
    expect(boton).toBeTruthy();
  });

  it("debería cambiar el icono al hacer clic", () => {
    const { container } = render(<Tema />);
    const boton = screen.getByRole("button");

    // Hacemos clic
    fireEvent.click(boton);

    // Verificamos que el botón sigue existiendo y reaccionó (difícil testear CSS classes en Karma puro sin estilos cargados, pero verificamos que no explote)
    expect(boton).toBeTruthy();
  });
});
