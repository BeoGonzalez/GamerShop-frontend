import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";

describe("Página: Home", () => {
  it("debería renderizar el título principal", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Ajusta el texto según lo que tengas en tu Home.js real
    // Ejemplo: "Bienvenido a GamerShop" o "Las mejores ofertas"
    const banner = screen.getByRole("heading", { level: 1 });
    expect(banner).toBeTruthy();
  });

  it("debería tener un botón para ver productos", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Busca un enlace que diga "Ver Catálogo" o "Comprar Ahora"
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
  });
});
