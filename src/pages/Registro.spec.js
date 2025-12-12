import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Registro from "./Registro";

describe("Página: Registro", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    );
  });

  it("debería tener todos los campos requeridos", () => {
    expect(screen.getByLabelText(/Nombre de Usuario/i)).toBeTruthy();
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeTruthy();
    expect(screen.getByLabelText(/Contraseña/i)).toBeTruthy();
  });

  it("debería tener un botón de Registrarse", () => {
    expect(screen.getByRole("button", { name: /REGISTRARSE/i })).toBeTruthy();
  });

  it("debería permitir escribir datos", () => {
    const userInput = screen.getByLabelText(/Nombre de Usuario/i);
    fireEvent.change(userInput, { target: { value: "NuevoGamer" } });
    expect(userInput.value).toBe("NuevoGamer");
  });
});
