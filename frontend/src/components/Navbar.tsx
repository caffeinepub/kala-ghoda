import { useState, useEffect } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useIsCallerAdmin } from '../hooks/useQueries';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: isAdmin } = useIsCallerAdmin();
  const location = useLocation();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/events', label: 'Events' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black-primary/95 backdrop-blur-md border-b border-gold/20 shadow-gold-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/assets/generated/logo-wordmark.dim_600x200.png"
              alt="Kala Ghoda"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-cinzel text-sm tracking-widest uppercase transition-all duration-300 ${
                  isActive(link.to)
                    ? 'text-gold border-b border-gold pb-0.5'
                    : 'text-foreground/70 hover:text-gold'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`font-cinzel text-sm tracking-widest uppercase transition-all duration-300 ${
                  location.pathname.startsWith('/admin')
                    ? 'text-gold border-b border-gold pb-0.5'
                    : 'text-foreground/70 hover:text-gold'
                }`}
              >
                Admin
              </Link>
            )}
            <button
              onClick={handleAuth}
              disabled={isLoggingIn}
              className={`px-5 py-2 text-xs font-cinzel tracking-widest uppercase transition-all duration-300 ${
                isAuthenticated
                  ? 'btn-outline-gold'
                  : 'btn-gold'
              } disabled:opacity-50`}
            >
              {isLoggingIn ? 'Connecting...' : isAuthenticated ? 'Logout' : 'Login'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gold p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black-primary/98 backdrop-blur-md border-t border-gold/20">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`block font-cinzel text-sm tracking-widest uppercase py-2 transition-colors ${
                  isActive(link.to) ? 'text-gold' : 'text-foreground/70 hover:text-gold'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="block font-cinzel text-sm tracking-widest uppercase py-2 text-foreground/70 hover:text-gold transition-colors"
              >
                Admin
              </Link>
            )}
            <button
              onClick={() => { handleAuth(); setIsOpen(false); }}
              disabled={isLoggingIn}
              className={`w-full py-3 text-xs font-cinzel tracking-widest uppercase mt-2 ${
                isAuthenticated ? 'btn-outline-gold' : 'btn-gold'
              } disabled:opacity-50`}
            >
              {isLoggingIn ? 'Connecting...' : isAuthenticated ? 'Logout' : 'Login'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
