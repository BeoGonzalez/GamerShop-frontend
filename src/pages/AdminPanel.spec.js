import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AdminPanel from "./AdminPanel";

describe("Página: AdminPanel", () => {
  beforeEach(() => {
    localStorage.setItem("jwt_token", "fake-admin-token");

    // Mock Axios
    spyOn(axios, "get").and.returnValue(Promise.resolve({ data: [] }));

    // Mock Fetch (usado a veces por componentes hijos)
    spyOn(window, "fetch").and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("debería renderizar el menú lateral (Sidebar)", async () => {
    render(
      <MemoryRouter>
        <AdminPanel />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Verificamos botones reales de tu AdminPanel.js
      expect(screen.getByRole("button", { name: /Dashboard/i })).toBeTruthy();
      expect(screen.getByRole("button", { name: /Productos/i })).toBeTruthy();
      // CAMBIO: Antes era "Ventas", ahora tu código usa "Pedidos"
      expect(screen.getByRole("button", { name: /Pedidos/i })).toBeTruthy();
    });
  });

  it("debería cambiar de pestaña al hacer clic", async () => {
    render(
      <MemoryRouter>
        <AdminPanel />
      </MemoryRouter>
    );

    // 1. Verificar Dashboard Inicial (Buscamos un texto del DashboardOverview)
    await waitFor(() => {
      // "Ventas Totales" es un texto fijo en tu DashboardOverview
      expect(screen.getByText(/Ventas Totales/i)).toBeTruthy();
    });

    // 2. Clic en Productos
    const tabProductos = screen.getByRole("button", { name: /Productos/i });
    fireEvent.click(tabProductos);

    // 3. Verificamos contenido de ProductosManager
    await waitFor(() => {
      // ProductsManager tiene un título o botón "Nuevo Producto"
      // Usamos un regex flexible
      expect(screen.getByText(/Nuevo Producto/i)).toBeTruthy();
    });
  });
});
