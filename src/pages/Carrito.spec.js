import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Carrito from "./Carrito";

describe("Página: Carrito", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // --- TEST CORREGIDO ---
  it('debería mostrar mensaje de "carrito vacío" si no hay items', () => {
    // 1. SIMULAMOS LOGIN (Para pasar la pantalla de "Acceso Restringido")
    localStorage.setItem("username", "TestUser");
    localStorage.setItem("jwt_token", "fake-token");

    // NO agregamos nada al carrito ('carrito_TestUser' no existe o está vacío)

    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    // 2. Ahora sí debería aparecer el mensaje de vacío
    // Busca la palabra "vacío" ignorando mayúsculas/minúsculas
    const mensajeVacio = screen.getByText(/vacío/i);
    expect(mensajeVacio).toBeTruthy();
  });

  it("debería cargar productos del localStorage y calcular el total", async () => {
    const usuario = "GamerPro";
    const productosFalsos = [
      { id: 1, nombre: "Mouse Gamer", precio: 1000, cantidad: 2 },
      { id: 2, nombre: "Teclado Mecánico", precio: 5000, cantidad: 1 },
    ];

    // Simulamos Login Y Datos del carrito
    localStorage.setItem("username", usuario);
    localStorage.setItem("jwt_token", "fake-token");
    localStorage.setItem(`carrito_${usuario}`, JSON.stringify(productosFalsos));

    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    expect(screen.getByText("Mouse Gamer")).toBeTruthy();

    // Buscamos el total (7000)
    // Usamos findByText por si el cálculo tarda un milisegundo
    const totalElement = await screen.findByText(/7.?000/);
    expect(totalElement).toBeTruthy();
  });

  it("debería intentar procesar el pago al hacer clic en Pagar", async () => {
    const usuario = "GamerPro";
    const productosFalsos = [
      { id: 1, nombre: "PC Gamer", precio: 10000, cantidad: 1 },
    ];

    localStorage.setItem("username", usuario);
    localStorage.setItem("jwt_token", "fake-token");
    localStorage.setItem(`carrito_${usuario}`, JSON.stringify(productosFalsos));

    // Mock del Backend para la compra
    spyOn(window, "fetch").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ mensaje: "Compra exitosa" }),
      })
    );

    // Mock de alert para que no detenga el test
    spyOn(window, "alert");

    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    const btnPagar = screen.getByText(/Pagar Ahora/i);
    fireEvent.click(btnPagar);

    await waitFor(() => {
      expect(window.fetch).toHaveBeenCalled();
    });
  });
});
