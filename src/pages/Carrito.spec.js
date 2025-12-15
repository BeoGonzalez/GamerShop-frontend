import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Carrito from "./Carrito";

describe("Página: Carrito", () => {
  beforeEach(() => {
    localStorage.clear();
    jasmine.getEnv().allowRespy(true);
  });

  it("debería mostrar mensaje de carrito vacío", () => {
    localStorage.setItem("username", "TestUser");
    localStorage.setItem("jwt_token", "token");

    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    // Busca texto parcial "vacío" o "vacía"
    expect(screen.getByText(/vacío/i)).toBeTruthy();
  });

  it("debería mostrar productos y calcular total", async () => {
    const usuario = "Gamer";
    // Total esperado: 2 * 1000 = 2000
    const items = [
      { id: 1, nombre: "Mouse", precio: 1000, cantidad: 2, imagen: "img.jpg" },
    ];

    localStorage.setItem("username", usuario);
    localStorage.setItem("jwt_token", "token");
    localStorage.setItem(`carrito_${usuario}`, JSON.stringify(items));

    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    expect(screen.getByText("Mouse")).toBeTruthy();

    // --- CORRECCIÓN AQUÍ ---
    // Como el precio aparece en "Subtotal" y en "Total", getByText falla.
    // Usamos findAllByText que permite múltiples coincidencias.
    const preciosEncontrados = await screen.findAllByText(/2[.,]?000/);

    // Verificamos que encontró al menos uno (Subtotal o Total)
    expect(preciosEncontrados.length).toBeGreaterThan(0);
  });

  it("debería llamar al backend al confirmar compra", async () => {
    const usuario = "Gamer";
    const items = [{ id: 1, nombre: "PC", precio: 5000, cantidad: 1 }];

    localStorage.setItem("username", usuario);
    localStorage.setItem("jwt_token", "token");
    localStorage.setItem(`carrito_${usuario}`, JSON.stringify(items));

    spyOn(axios, "post").and.returnValue(
      Promise.resolve({ status: 200, data: { id: 99, mensaje: "OK" } })
    );
    spyOn(window, "alert");

    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    // Busca botón por texto flexible
    const btn = screen.getByText(/CONFIRMAR COMPRA|Pagar/i);
    fireEvent.click(btn);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });
});
