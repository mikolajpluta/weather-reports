import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
    const location = useLocation();
    return (
        <div className="navbar">
            <Link to="/"  className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}>Lista raportów</Link>
            <Link to="/add-report"  className={`navbar-link ${location.pathname === '/add-report' ? 'active' : ''}`}>Dodaj raport</Link>
        </div>
    )
}

export default Navbar;