import React from "react";
import { render, screen } from "@testing-library/react";
import Contact from "./Contact";

describe("Página: Contacto", () => {
  it("debería mostrar el formulario de contacto", () => {
    render(<Contact />);

    expect(screen.getByLabelText(/Nombre/i)).toBeTruthy();
    expect(screen.getByLabelText(/Mensaje/i)).toBeTruthy();
    expect(screen.getByText(/Enviar Mensaje/i)).toBeTruthy();
  });
});
