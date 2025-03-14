import { Link } from 'react-router-dom';

function Header() {
    return (
        <nav>
            <Link to="/">Home</Link> |{' '}
            <Link to="/sign">Sign Document</Link> |{' '}
            <Link to="/documents">View Documents</Link>
        </nav>
    );
}

export default Header;