import { useAuth } from "../context/authContext";
import logo from "./../assets/logo.png"

function Sidebar({menu}) {
    const { logout } = useAuth()

    const handleLogout = async () => {
      await logout();
    };
    return (
        <div className="d-flex flex-column flex-shrink-0 bg-light" id="sidebar">
            <a href="/" className="d-block link-dark text-decoration-none logo"  data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Icon-only">
                <img src={logo} width="60px" alt="hospital pediatrico" />
            </a>
            <ul className="nav nav-pills nav-flush flex-column mb-auto text-center">
                <li className="nav-item">
                    <a href="/" className={`nav-link py-3 border-bottom ${menu===1 && 'active'}`} aria-current="page"  data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Home">
                        <i className="bi bi-house-heart"></i>
                    </a>
                </li>
                <li>
                    <a href="/horarios" className={`nav-link py-3 border-bottom ${menu===2 && 'active'}`}  data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Dashboard">
                        <i className="bi bi-table"></i>
                    </a>
                </li>
                <li>
                    <a href="/imprimir" className={`nav-link py-3 border-bottom ${menu===3 && 'active'}`}  data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Orders">
                        <i className="bi bi-clipboard2-pulse-fill"></i>
                    </a>
                </li>
            </ul>
            <div className="dropdown border-top">
                <a href="!#" className="d-flex align-items-center justify-content-center p-3 link-dark text-decoration-none dropdown-toggle" id="dropdownUser3" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="bi bi-gear-fill"></i>
                </a>
                <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser3">
                    <li><a href="/login" onClick={handleLogout} className="dropdown-item">Cerrar sesion</a></li>
                </ul>
            </div>
        </div>
    )
}

export default Sidebar