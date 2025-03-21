import { Link } from "react-router-dom";

function Navigation(){

    return (
                
        <nav className="navbar navbar-expand-lg navbar-light ">

            <div className="container">

                <Link className="navbar-brand"  to="/"><img src="logo.png" alt="logo" /></Link>
               

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
    
                <div className="collapse navbar-collapse" id="navbarNav" >
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Domov</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/navstevy">Zoznam návštev</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/ulovky">Úlovky</Link>
                        </li>
                    </ul>  

                </div>
            </div>
        </nav>

    );
}

export default Navigation