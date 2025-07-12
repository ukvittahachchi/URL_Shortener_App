import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { getCurrentUser, logout } from '../services/auth';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
    };
    fetchUser();

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  if (isDashboard && !user) return null;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-gradient-to-r from-indigo-700 to-purple-700 shadow-xl py-0' 
        : 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg py-2'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            to={user ? "/dashboard" : "/"}
            className="flex items-center group"
          >
            <div className="flex items-center">
              <span className="bg-white text-indigo-600 px-3 py-1 rounded-lg mr-2 group-hover:scale-105 transition-transform duration-200 shadow-md font-bold text-lg">
                URL
              </span>
              <span className="text-white font-bold text-xl hidden sm:inline-block transition-all">
                Shortener
              </span>
              <span className="text-white font-bold text-xl inline sm:hidden transition-all">
                S
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <>
                <NavLink to="/dashboard" currentPath={location.pathname}>
                  Dashboard
                </NavLink>
                <NavLink to="/profile" currentPath={location.pathname}>
                  Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-white text-indigo-600 hover:bg-indigo-100 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                >
                  Logout
                </button>
              </>
            ) : !isDashboard && (
              <>
                <NavLink to="/features" currentPath={location.pathname}>
                  
                </NavLink>
                <NavLink to="/pricing" currentPath={location.pathname}>
                  
                </NavLink>
                <NavLink to="/login" currentPath={location.pathname}>
                  Login
                </NavLink>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-white text-indigo-600 hover:bg-indigo-100 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-indigo-200 hover:bg-white/20 transition-all duration-200 focus:outline-none"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
        mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 pt-2 pb-4 space-y-1 bg-gradient-to-b from-indigo-700 to-purple-700 shadow-xl">
          {user ? (
            <>
              <MobileNavLink 
                to="/dashboard" 
                currentPath={location.pathname}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </MobileNavLink>
              <MobileNavLink 
                to="/profile" 
                currentPath={location.pathname}
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </MobileNavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-3 rounded-lg text-base font-semibold bg-white text-indigo-600 hover:bg-indigo-100 transition-all duration-200 shadow-md active:scale-95"
              >
                Logout
              </button>
            </>
          ) : !isDashboard && (
            <>
              <MobileNavLink 
                to="/features" 
                currentPath={location.pathname}
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </MobileNavLink>
              <MobileNavLink 
                to="/pricing" 
                currentPath={location.pathname}
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </MobileNavLink>
              <MobileNavLink 
                to="/login" 
                currentPath={location.pathname}
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </MobileNavLink>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-base font-semibold bg-white text-indigo-600 hover:bg-indigo-100 transition-all duration-200 shadow-md active:scale-95"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// Reusable NavLink component for desktop
const NavLink = ({ to, currentPath, children }) => (
  <Link
    to={to}
    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
      currentPath === to
        ? 'bg-white/30 text-white shadow-inner'
        : 'text-white hover:bg-white/20 hover:shadow-md'
    }`}
  >
    {children}
  </Link>
);

// Reusable MobileNavLink component
const MobileNavLink = ({ to, currentPath, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 ${
      currentPath === to
        ? 'bg-white/30 text-white shadow-inner'
        : 'text-white hover:bg-white/20'
    }`}
  >
    {children}
  </Link>
);

export default Navbar;