import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleProtectedNavigation = (path: string) => {
    if (!isAuthenticated) {
      // For profile, just redirect to login - we'll use their ID after auth
      navigate("/login", { state: { from: path === "/profile" ? "profile" : path } });
    } else {
      navigate(path);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Get user's profile path
  const profilePath = user ? `/profile/${user.id}` : "/profile";

  return (
    <header className="bg-primary shadow-sm">
      <div className="container mx-auto px-6 py-5">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-primary-foreground tracking-tight">
            YaleStrength
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <Link
              to="/"
              className={`nav-link ${isActive("/") ? "nav-link-active" : ""}`}
            >
              Leaderboard
            </Link>
            <button
              onClick={() => handleProtectedNavigation("/submit")}
              className={`nav-link ${isActive("/submit") ? "nav-link-active" : ""}`}
            >
              Submit Lift
            </button>
            <button
              onClick={() => handleProtectedNavigation(profilePath)}
              className={`nav-link ${isActive("/profile") || location.pathname.startsWith("/profile") ? "nav-link-active" : ""}`}
            >
              Profile
            </button>
            <Link
              to="/about"
              className={`nav-link ${isActive("/about") ? "nav-link-active" : ""}`}
            >
              About
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button 
                variant="secondary" 
                size="sm"
                className="font-medium"
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-primary-foreground/80 text-primary-foreground bg-transparent hover:bg-primary-foreground hover:text-primary font-medium"
                  onClick={() => navigate("/login", { state: { register: true } })}
                >
                  Register
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="font-medium"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
