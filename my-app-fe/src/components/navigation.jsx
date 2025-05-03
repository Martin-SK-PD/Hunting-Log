import { useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { Collapse } from "bootstrap";

function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();
  const role = user?.role;
  const navigate = useNavigate();

  // Funkcia na zatvorenie navbaru
  const closeNavbar = () => {
    const nav = document.getElementById("navbarNav");
    if (nav && nav.classList.contains("show")) {
      const collapseInstance = Collapse.getOrCreateInstance(nav);
      collapseInstance.hide();
    }
  };

  const handleNavClick = (path) => {
    closeNavbar();
    setTimeout(() => {
      navigate(path);
    }, 100);
  };

  const handleLogout = () => {
    closeNavbar();
    setTimeout(() => {
      logout();
    }, 100);
  };

  // Pridáme event listener na hamburger tlačidlo
  useEffect(() => {
    const toggler = document.querySelector(".navbar-toggler");
    const nav = document.getElementById("navbarNav");

    const handleTogglerClick = () => {
      if (nav) {
        const collapseInstance = Collapse.getOrCreateInstance(nav);
        if (nav.classList.contains("show")) {
          collapseInstance.hide(); // ak je otvorené → zavri
        } else {
          collapseInstance.show(); // ak je zatvorené → otvor
        }
      }
    };

    if (toggler) {
      toggler.addEventListener("click", handleTogglerClick);
    }

    return () => {
      if (toggler) {
        toggler.removeEventListener("click", handleTogglerClick);
      }
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container">
        {/* Logo */}
        <button
          className="navbar-brand btn p-0 border-0 bg-transparent"
          onClick={() => handleNavClick("/domov")}
        >
          <img src="logo.png" alt="logo" />
        </button>

        {/* Hamburger */}
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigačné menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <button className="btn nav-link" onClick={() => handleNavClick("/domov")}>
                Domov
              </button>
            </li>
            <li className="nav-item">
              <button className="btn nav-link" onClick={() => handleNavClick("/navstevy")}>
                Zoznam návštev
              </button>
            </li>
            <li className="nav-item">
              <button className="btn nav-link" onClick={() => handleNavClick("/ulovky")}>
                Úlovky
              </button>
            </li>

            {isAuthenticated && role === "Admin" && (
              <>
                <li className="nav-item">
                  <button className="btn nav-link" onClick={() => handleNavClick("/sprava-reviru")}>
                    Správa revíru
                  </button>
                </li>
                <li className="nav-item">
                  <button className="btn nav-link" onClick={() => handleNavClick("/ludia")}>
                    Ľudia v revíri
                  </button>
                </li>
              </>
            )}
          </ul>

          {isAuthenticated && (
            <div className="ms-auto mt-3 mt-lg-0 border-top pt-2 d-flex flex-column flex-lg-row align-items-start align-items-lg-center ">
              <span className="me-5 fs-6">
                {user?.ground_name} – {user?.first_name} {user?.last_name}
              </span>

              <button className="btn nav-link navbar-text " onClick={handleLogout}>
                Odhlásiť sa
              </button>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navigation;
