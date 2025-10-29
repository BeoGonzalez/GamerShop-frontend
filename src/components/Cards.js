import React from "react";
import Card from "./Card";

import imagen1 from "../assets/imagen1.webp";
import imagen2 from "../assets/imagen2.jpg";
import imagen3 from "../assets/imagen3.webp";
import imagen4 from "../assets/imagen4.webp";
import imagen5 from "../assets/imagen5.jpg";

const cards = [
  {
    id: 1,
    title: "Mouse Gamer",
    image: imagen1,
  },
  {
    id: 2,
    title: "Audifonos Gamer",
    image: imagen2,
  },
  {
    id: 3,
    title: "Teclado gamer RGB",
    image: imagen3,
  },
  {
    id: 4,
    title: "Monitor Gamer",
    image: imagen4,
  },
  {
    id: 5,
    title: "Tarjeta gráfica",
    image: imagen5,
  },
];

function Cards() {
  return (
    <div className="container d-flex justify-content-center align-items-center h-100">
      <div className="row">
        {cards.map(({ title, image, url, id }) => (
          <div className="col-md-4" key={id}>
            <Card imageSource={image} title={title} url={url} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cards;
