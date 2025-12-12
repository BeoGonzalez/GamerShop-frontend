import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Blog from "./Blog";

describe("Página: Blog", () => {
  it("debería mostrar los posts iniciales", () => {
    render(
      <MemoryRouter>
        <Blog />
      </MemoryRouter>
    );

    // Verificamos que aparezca el título de la comunidad
    expect(screen.getByText(/Comunidad GamerShop/i)).toBeTruthy();
    // Verificamos algún post de ejemplo (JuanGamer99)
    expect(screen.getByText(/JuanGamer99/i)).toBeTruthy();
  });

  it("NO debería mostrar formulario de crear tema si no hay sesión", () => {
    localStorage.clear();
    render(
      <MemoryRouter>
        <Blog />
      </MemoryRouter>
    );

    // No debería haber inputs
    expect(screen.queryByPlaceholderText(/Título/i)).toBeNull();
    // Debería pedir iniciar sesión
    expect(screen.getByText(/Inicia sesión para crear un tema/i)).toBeTruthy();
  });

  it("SÍ debería mostrar formulario si el usuario está logueado", () => {
    localStorage.setItem("username", "Tester");
    localStorage.setItem("rol", "USER");

    render(
      <MemoryRouter>
        <Blog />
      </MemoryRouter>
    );

    expect(
      screen.getByPlaceholderText(/Ej: Duda con tarjeta gráfica.../i)
    ).toBeTruthy();
    expect(screen.getByText(/Publicar/i)).toBeTruthy();
  });
});
