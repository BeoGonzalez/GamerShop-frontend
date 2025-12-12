import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

describe("Componente: Navbar", () => {
  const mockOnLogout = jasmine.createSpy("onLogout");

  it('debería mostrar "Iniciar Sesión" cuando NO está autenticado', () => {
    render(
      <MemoryRouter>
        <Navbar
          isAuth={false}
          role={null}
          username=""
          onLogout={mockOnLogout}
        />
      </MemoryRouter>
    );

    // Buscamos el botón de login
    expect(screen.getByText(/Iniciar Sesión/i)).toBeTruthy();
    // No debería aparecer el botón de salir
    expect(screen.queryByText(/Salir/i)).toBeNull();
  });

  it('debería mostrar "Hola, Juan" y botón Salir cuando es CLIENTE', () => {
    render(
      <MemoryRouter>
        <Navbar
          isAuth={true}
          role="USER"
          username="Juan"
          onLogout={mockOnLogout}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/Hola, Juan/i)).toBeTruthy();
    expect(screen.getByText(/Cliente/i)).toBeTruthy();
    expect(screen.getByText(/Salir/i)).toBeTruthy();
    // No debería ver el panel de admin
    expect(screen.queryByText(/AdminPanel/i)).toBeNull();
  });

  it('debería mostrar el botón "AdminPanel" cuando es ADMIN', () => {
    render(
      <MemoryRouter>
        <Navbar
          isAuth={true}
          role="ADMIN"
          username="AdminMaster"
          onLogout={mockOnLogout}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/AdminPanel/i)).toBeTruthy();
    expect(screen.getByText(/Administrador/i)).toBeTruthy();
  });
});
