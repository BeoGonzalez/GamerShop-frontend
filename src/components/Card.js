function Card() {
  return (
    <div className="card w-200 mb-3" style={{ width: "12rem" }}>
      <img
        src="https://casaroyal.vtexassets.com/arquivos/ids/163607-800-800?v=638874964810800000&width=800&height=800&aspect=true"
        className="card-img-center"
        alt="mouse gamer"
      />
      <div className="card-body">
        <p className="card-text">
          Some quick example text to build on the card title and make up the
          bulk of the cards content.
        </p>
      </div>
    </div>
  );
}

export default Card;
