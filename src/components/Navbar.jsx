import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import NotificationsBell from "./NotificationsBell.jsx";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const loggedOutLinks = [
    { label: "Home", to: "/" },
    { label: "Features", to: "/#features" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  const loggedInLinks = [
    { label: "Home", to: "/" },
    { label: "Dashboard", to: "/dashboard" },
    { label: "My Projects", to: "/dashboard/projects" },
    { label: "Blog", to: "/blog" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-surface-dark/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-primary">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
          Forgely
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {(user ? loggedInLinks : loggedOutLinks).map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="rounded-lg border border-slate-300 px-2 py-1 text-xs dark:border-slate-600"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>

          {user && <NotificationsBell />}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-slate-300 pl-1 pr-3 py-1 dark:border-slate-600"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                  {user.name?.charAt(0)?.toUpperCase()}
                </span>
                <span className="text-sm font-medium">{user.name?.split(" ")[0]}</span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/dashboard/settings"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-sm">
              Login
            </Link>
          )}

          <button className="md:hidden" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu">
            ☰
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 md:hidden dark:border-slate-800">
          {(user ? loggedInLinks : loggedOutLinks).map((link) => (
            <Link key={link.label} to={link.to} onClick={() => setMenuOpen(false)} className="text-sm">
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
