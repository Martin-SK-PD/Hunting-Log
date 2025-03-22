import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();
  const role = user?.role;

  return (
    <nav className="navbar navbar-expand-lg navbar-light ">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src="logo.png" alt="logo" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/domov">Domov</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/navstevy">Zoznam návštev</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ulovky">Úlovky</Link>
            </li>

            {isAuthenticated && role === "Admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/sprava-reviru">Správa revíru</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/ludia">Ľudia v revíri</Link>
                </li>
              </>
            )}
          </ul>
          {isAuthenticated && (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button className="btn nav-link" onClick={logout}>Odhlásiť sa</button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;

