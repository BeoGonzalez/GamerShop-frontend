import Gif from "../assets/animacion.gif";

function Hero() {
  return (
    <div className="hero-section position-relative overflow-hidden">
      {/* GIF de fondo centrado */}
      <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 d-flex align-items-center justify-content-center">
        <img
          src={Gif}
          alt="Background animation"
          className="hero-video"
          style={{
            objectFit: "cover",
            minWidth: "100%",
            minHeight: "100%",
            imageRendering: "crisp-edges",
            filter: "blur(0.3px)",
            transform: "scale(1.01)",
          }}
        />
      </div>

      {/* Contenido del Hero */}
      <div
        className="container text-center text-white py-5 position-relative"
        style={{ zIndex: 1 }}
      >
        <h1 className="hero-title mb-4">
          Sube el nivel de tu setup gamer
          <br />
          <span className="hero-title-light">Más rapido que nunca</span>
        </h1>
      </div>
    </div>
  );
}

export default Hero;
