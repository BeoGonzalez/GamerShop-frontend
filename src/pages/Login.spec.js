import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";

describe("Página: Login (Suite Robusta)", () => {
  // Limpieza total antes de cada prueba
  beforeEach(() => {
    localStorage.clear();
    // Limpiamos cualquier espía anterior
    jasmine.getEnv().allowRespy(true);
  });

  // --- TEST 1: RENDERIZADO BÁSICO ---
  it("debería renderizar el formulario con todos sus elementos", () => {
    // Usamos una función vacía porque no vamos a hacer submit en este test
    render(
      <MemoryRouter>
        <Login onLogin={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByText("Bienvenido")).toBeTruthy();
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeTruthy();
    expect(screen.getByLabelText(/Contraseña/i)).toBeTruthy();

    const btn = screen.getByRole("button", { name: /INGRESAR/i });
    expect(btn).toBeTruthy();
    // Verificamos que no esté deshabilitado
    expect(btn.disabled).toBeFalse();
  });

  // --- TEST 2: VALIDACIÓN HTML ---
  it("los inputs deberían ser obligatorios (required)", () => {
    render(
      <MemoryRouter>
        <Login onLogin={() => {}} />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Correo/i);
    const passInput = screen.getByLabelText(/Contraseña/i);

    expect(emailInput.hasAttribute("required")).toBeTrue();
    expect(passInput.hasAttribute("required")).toBeTrue();
  });

  // --- TEST 3: LOGIN EXITOSO (EL CAMINO FELIZ) ---
  it("debería realizar login exitoso, guardar token y llamar a onLogin", async () => {
    // A. Preparar la Trampa de la Promesa (Sincronización Perfecta)
    let resolverPromesa;
    const promesaDeLogin = new Promise((resolve) => {
      resolverPromesa = resolve;
    });

    const mockHandleLogin = (rol, user) => {
      resolverPromesa({ rol, user });
    };

    // B. Mock del Backend (Éxito)
    spyOn(window, "fetch").and.returnValue(
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            token: "token-secreto-123",
            username: "MasterChief",
            rol: "ADMIN",
          }),
      })
    );

    // C. Ejecución
    render(
      <MemoryRouter>
        <Login onLogin={mockHandleLogin} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Correo/i), {
      target: { value: "admin@gamer.com" },
    });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: "admin123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /INGRESAR/i }));

    // D. Espera y Verificación
    const datos = await promesaDeLogin;

    // 1. Verificar props
    expect(datos.rol).toBe("ADMIN");
    expect(datos.user).toBe("MasterChief");

    // 2. Verificar LocalStorage (¡Muy importante para robustez!)
    expect(localStorage.getItem("jwt_token")).toBe("token-secreto-123");
    expect(localStorage.getItem("username")).toBe("MasterChief");
  });

  // --- TEST 4: MANEJO DE ERROR (CONTRASEÑA INCORRECTA) ---
  it("debería mostrar mensaje de error si las credenciales son inválidas", async () => {
    // A. Mock del Backend (Fallo 401/403)
    spyOn(window, "fetch").and.returnValue(
      Promise.resolve({
        ok: false, // Simulamos error
        status: 401,
        json: () => Promise.resolve({ message: "Bad credentials" }),
      })
    );

    render(
      <MemoryRouter>
        <Login onLogin={() => {}} />
      </MemoryRouter>
    );

    // B. Intentar loguearse
    fireEvent.change(screen.getByLabelText(/Correo/i), {
      target: { value: "hacker@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: "malapass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /INGRESAR/i }));

    // C. Verificar que aparece el mensaje de error en pantalla
    // Usamos findByText porque el mensaje aparece asíncronamente después del fetch
    const mensajeError = await screen.findByText(
      /Correo o contraseña incorrectos/i
    );

    expect(mensajeError).toBeTruthy();

    // Verificar que NO se guardó nada en localStorage
    expect(localStorage.getItem("jwt_token")).toBeNull();
  });

  // --- TEST 5: ERROR DE RED (SERVIDOR CAÍDO) ---
  it("debería manejar errores de red (Catch block)", async () => {
    // A. MOCK DEL ERROR (Usamos callFake para evitar 'Unhandled Promise Rejection')
    // Esto crea el error justo en el momento de la llamada, no antes.
    spyOn(window, "fetch").and.callFake(() =>
      Promise.reject(new Error("Network Error"))
    );

    // Espiamos console.error para que el test no muestre el error rojo en la consola
    // (Ya que esperamos que ocurra un error, esto mantiene limpia la salida)
    const errorSpy = spyOn(console, "error");

    render(
      <MemoryRouter>
        <Login onLogin={() => {}} />
      </MemoryRouter>
    );

    // B. LLENAR DATOS
    // Es importante llenar los campos para cumplir con el 'required' del HTML
    const passInput = screen.getByLabelText(/Contraseña/i);
    fireEvent.change(screen.getByLabelText(/Correo/i), {
      target: { value: "error@test.com" },
    });
    fireEvent.change(passInput, { target: { value: "123" } });

    // C. FORZAR EL ENVÍO (La solución mágica)
    // En lugar de hacer clic en el botón (que está fallando), disparamos el submit directo
    fireEvent.submit(passInput.closest("form"));

    // D. ESPERAR Y VERIFICAR
    // Usamos findByText porque la aparición del error es asíncrona (espera a que falle la promesa)
    const mensajeError = await screen.findByText(
      /Correo o contraseña incorrectos/i
    );

    expect(mensajeError).toBeTruthy();

    // Opcional: Verificar que el console.error se llamó (confirmando que entró al catch)
    expect(errorSpy).toHaveBeenCalled();
  });
});
