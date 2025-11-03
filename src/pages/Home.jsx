import React from "react";
import bootstrap from "bootstrap";
import Hero from "../components/Hero";

function Home() {
  return (
    <>
      <Hero />
      <div className="container-text-center">
        <h1 className="text-center">Quienes somos</h1>
        <p className="text-center">
          En el corazón del sur de Chile, entre el sonido de la lluvia constante
          y el reflejo de las luces de neón sobre las calles húmedas de Puerto
          Montt, nació GamerShop, una tienda que transformó la forma en que los
          gamers de la región viven y equipan su pasión. Corría el año 2021,
          cuando un grupo de jóvenes entusiastas de la tecnología —todos
          fanáticos del hardware, el RGB y los videojuegos competitivos— notaron
          una gran carencia en el mercado local: los gamers del sur no tenían
          acceso fácil a productos de calidad, soporte técnico confiable y
          asesoría experta. Las grandes tiendas tecnológicas estaban
          centralizadas en Santiago, y los tiempos de envío o los costos de
          importación hacían casi imposible armar un setup de ensueño sin romper
          el bolsillo o esperar semanas.
        </p>
      </div>
    </>
  );
}

export default Home;
