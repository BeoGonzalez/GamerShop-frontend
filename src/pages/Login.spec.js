import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Login from "./Login";

describe("Página: Login", () => {
  beforeEach(() => {
    // 1. Limpieza total del almacenamiento local
    localStorage.clear();

    // 2. Permite re-definir espías (Vital para evitar el error de "spy already exists")
    jasmine.getEnv().allowRespy(true);

    // 3. Limpieza de llamadas previas a axios (opcional pero recomendado)
    if (axios.post.calls) {
      axios.post.calls.reset();
    }
  });

  it("debería renderizar el formulario correctamente", () => {
    render(
      <MemoryRouter>
        <Login onLogin={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText(/Ej: admin1/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/••••••/i)).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /Iniciar Sesión/i })
    ).toBeTruthy();
  });

  it("debería mostrar error si las credenciales son incorrectas", async () => {
    // A. FORZAR ERROR 401
    // Sobrescribimos el espía para que falle en este test específico
    spyOn(axios, "post").and.returnValue(
      Promise.reject({ response: { status: 401 } })
    );

    render(
      <MemoryRouter>
        <Login onLogin={() => {}} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Ej: admin1/i), {
      target: { value: "error" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••/i), {
      target: { value: "wrong" },
    });

    fireEvent.submit(
      screen.getByPlaceholderText(/Ej: admin1/i).closest("form")
    );

    // B. ESPERAR MENSAJE DE ERROR
    const errorMsg = await screen.findByText(
      /Usuario o contraseña incorrectos/i
    );
    expect(errorMsg).toBeTruthy();

    // Asegurarnos de que NO se guardó token
    expect(localStorage.getItem("jwt_token")).toBeNull();
  });

  it("debería manejar errores de conexión (Catch block)", async () => {
    // A. FORZAR ERROR DE RED GENÉRICO
    spyOn(axios, "post").and.returnValue(
      Promise.reject(new Error("Network Error"))
    );

    // Silenciamos console.error para no ensuciar el reporte
    spyOn(console, "error");

    render(
      <MemoryRouter>
        <Login onLogin={() => {}} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Ej: admin1/i), {
      target: { value: "net" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••/i), {
      target: { value: "err" },
    });

    fireEvent.submit(
      screen.getByPlaceholderText(/Ej: admin1/i).closest("form")
    );

    // B. BUSCAR MENSAJE DE ERROR DE CONEXIÓN
    const errorMsg = await screen.findByText(/Error de conexión/i);
    expect(errorMsg).toBeTruthy();
  });
});
