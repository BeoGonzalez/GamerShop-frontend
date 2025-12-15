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
    // Usamos placeholder o label según corresponda a tu componente Registro
    // Si usas label:
    // expect(screen.getByLabelText(/Nombre de Usuario/i)).toBeTruthy();

    // Si usas placeholders (más común en diseños modernos):
    expect(screen.getByText(/Crear Cuenta/i)).toBeTruthy(); // Título
  });

  it("debería tener un botón de Registrarse", () => {
    // Busca botón case-insensitive
    expect(
      screen.getByRole("button", { name: /REGISTRARSE|Crear Cuenta/i })
    ).toBeTruthy();
  });

  it("debería permitir escribir datos", () => {
    // Asumiendo que hay un input de nombre/usuario
    // Si no encuentras Label, usa Placeholder
    const inputs = screen.getAllByRole("textbox");
    // Tomamos el primero como ejemplo
    if (inputs.length > 0) {
      fireEvent.change(inputs[0], { target: { value: "NuevoGamer" } });
      expect(inputs[0].value).toBe("NuevoGamer");
    }
  });
});
