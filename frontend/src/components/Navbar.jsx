import { Link } from "react-router-dom";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const handleClick = (e) => {
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };
  const userJson = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = userJson ? JSON.parse(userJson) : null;

  return (
    <nav className="navbar">
      <Link to="/">
        <h1>React Property Search</h1>
      </Link>
      <div className="links">
        {isAuthenticated && (
          <div>
            <Link to="/add-property">Add Property</Link>
            <span>{user?.username || ""}</span>
            <button onClick={handleClick}>Log out</button>
          </div>
        )}
        {!isAuthenticated && (
          <div>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;