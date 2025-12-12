import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

describe("Componente: ProtectedRoute", () => {
  it("debería redirigir si NO tiene permiso", () => {
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route path="/" element={<h1>Página de Inicio (Redirigido)</h1>} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute isAllowed={false} redirectTo="/">
                <h1>Panel Secreto</h1>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // NO debería ver el panel secreto
    expect(screen.queryByText("Panel Secreto")).toBeNull();
    // DEBERÍA ver la página de inicio
    expect(screen.getByText("Página de Inicio (Redirigido)")).toBeTruthy();
  });

  it("debería mostrar el contenido si SÍ tiene permiso", () => {
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute isAllowed={true}>
                <h1>Panel Secreto</h1>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Panel Secreto")).toBeTruthy();
  });
});
