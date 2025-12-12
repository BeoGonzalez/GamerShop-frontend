import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // <--- Recuerda usar MemoryRouter
import Blog from "./Blog";

describe("Página: Blog", () => {
  it("debería mostrar los posts iniciales", () => {
    render(
      <MemoryRouter>
        <Blog />
      </MemoryRouter>
    );

    // CAMBIO: Buscamos "Foro Gamer" en lugar de "Comunidad GamerShop"
    expect(screen.getByText(/Foro Gamer/i)).toBeTruthy();

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
    // CAMBIO: El texto ahora es "Inicia sesión para crear un tema."
    expect(screen.getByText(/Inicia sesión para crear un tema/i)).toBeTruthy();
  });

  it("SÍ debería mostrar formulario si el usuario está logueado", () => {
    localStorage.setItem("jwt_token", "fake"); // El componente verifica jwt_token
    localStorage.setItem("username", "Tester");

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
