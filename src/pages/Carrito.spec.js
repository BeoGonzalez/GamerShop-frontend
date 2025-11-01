import React, { useState, useEffect } from "react";

describe("Carrito - lógica con useState y useEffect", function () {
  let carrito;
  let setCarrito;
  let usuario;
  let setUsuario;
  let productos;

  beforeEach(function () {
    carrito = [];
    setCarrito = (nuevo) => {
      carrito = nuevo;
    };
    usuario = null;
    setUsuario = (u) => {
      usuario = u;
    };

    productos = [
      { id: 1, nombre: "Mouse Gamer", precio: 20000 },
      { id: 2, nombre: "Audífonos Gamer", precio: 55000 },
      { id: 3, nombre: "Teclado Gamer RGB", precio: 90000 },
    ];
  });

  function agregarAlCarrito(producto) {
    const index = carrito.findIndex((p) => p.nombre === producto.nombre);
    if (index !== -1) {
      const nuevoCarrito = [...carrito];
      nuevoCarrito[index].cantidad += 1;
      setCarrito(nuevoCarrito);
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  }

  function eliminarDelCarrito(index) {
    setCarrito(carrito.filter((_, i) => i !== index));
  }

  function total() {
    return carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  }

  it("debería agregar un producto al carrito", function () {
    agregarAlCarrito(productos[0]);
    expect(carrito.length).toBe(1);
    expect(carrito[0].cantidad).toBe(1);

    // Agregar el mismo producto otra vez
    agregarAlCarrito(productos[0]);
    expect(carrito[0].cantidad).toBe(2);
  });

  it("debería eliminar un producto del carrito", function () {
    agregarAlCarrito(productos[0]);
    agregarAlCarrito(productos[1]);
    expect(carrito.length).toBe(2);

    eliminarDelCarrito(0);
    expect(carrito.length).toBe(1);
    expect(carrito[0].nombre).toBe("Audífonos Gamer");
  });

  it("debería calcular el total correctamente", function () {
    agregarAlCarrito(productos[0]); // 20000
    agregarAlCarrito(productos[1]); // 55000
    agregarAlCarrito(productos[0]); // +20000 = 95000
    expect(total()).toBe(95000);
  });

  it("debería vaciar el carrito al pagar con usuario", function () {
    usuario = { username: "juan" }; // simular usuario logueado
    agregarAlCarrito(productos[0]);
    agregarAlCarrito(productos[1]);

    // Función de pagar simplificada
    function pagar() {
      if (!usuario) return "No hay usuario";
      if (carrito.length === 0) return "Carrito vacío";
      setCarrito([]);
      return "Compra realizada";
    }

    const mensaje = pagar();
    expect(mensaje).toBe("Compra realizada");
    expect(carrito.length).toBe(0);
  });

  it("debería impedir pagar sin usuario", function () {
    agregarAlCarrito(productos[0]);
    function pagar() {
      if (!usuario) return "No hay usuario";
      if (carrito.length === 0) return "Carrito vacío";
      setCarrito([]);
      return "Compra realizada";
    }

    const mensaje = pagar();
    expect(mensaje).toBe("No hay usuario");
    expect(carrito.length).toBe(1);
  });
});
