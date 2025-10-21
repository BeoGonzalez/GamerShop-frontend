import { Link } from "react-router-dom";
import Tema from "./Tema";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary bg-dark border-bottom border-body">
      <div className="container-fluid">
        {/* Marca / logo */}
        <Link className="navbar-brand text-white" to="/">
          Navbar
        </Link>

        {/* Botón colapsable para pantallas pequeñas */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú centrado */}
        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarNavDropdown"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-white" to="/features">
                Features
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-white" to="/contacto">
                Contacto
              </Link>
            </li>

            {/* Dropdown */}
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle text-white"
                to="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Dropdown
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/action">
                    Action
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/another-action">
                    Another action
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/something-else">
                    Something else here
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        {/* Tema (a la derecha) */}
        <Tema />
      </div>
    </nav>
  );
}

export default Navbar;
