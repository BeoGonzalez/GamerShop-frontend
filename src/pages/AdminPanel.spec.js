import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AdminPanel from "./AdminPanel";

describe("Página: AdminPanel", () => {
  beforeEach(() => {
    // 1. Mock de localStorage
    localStorage.setItem("jwt_token", "fake-admin-token");

    // 2. Mock de Axios
    spyOn(axios, "get").and.callFake((url) => {
      // Devolvemos datos vacíos para no romper la carga
      return Promise.resolve({ data: [] });
    });

    // 3. Mock de Fetch
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

    // Usamos getByRole para ser específicos y evitar confusión con textos sueltos
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Dashboard/i })).toBeTruthy();
      expect(screen.getByRole("button", { name: /Productos/i })).toBeTruthy();
      expect(screen.getByRole("button", { name: /Ventas/i })).toBeTruthy();
    });
  });

  it("debería cambiar de pestaña al hacer clic", async () => {
    render(
      <MemoryRouter>
        <AdminPanel />
      </MemoryRouter>
    );

    // 1. Estamos en Dashboard (Verificamos título)
    await waitFor(() => {
      expect(screen.getByText(/Estadísticas Generales/i)).toBeTruthy();
    });

    // 2. CORRECCIÓN CLAVE: Buscar el BOTÓN específico, no cualquier texto "Productos"
    // Esto evita el conflicto con "Productos Activos"
    const tabProductos = screen.getByRole("button", { name: /Productos/i });

    fireEvent.click(tabProductos);

    // 3. Verificamos que cambió el contenido
    await waitFor(() => {
      // El botón "Nuevo" solo aparece en la vista de productos
      expect(screen.getByText(/Nuevo/i)).toBeTruthy();
    });
  });
});
