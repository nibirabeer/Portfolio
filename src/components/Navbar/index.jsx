import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import LoginModal from '../LoginModal';

const NAV_LINKS = [
  { label: 'Projects', path: '/projects' },
  { label: 'Skills',   path: '/skills'   },
  { label: 'About',    path: '/about'    },
  { label: 'Contact',  path: '/contact'  },
];

const Navbar = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]      = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-mark">
            <img src="/l.png" alt="Logo" />
          </div>
          <span className="navbar-name">Nibir Abeer</span>
        </Link>

        {/* Desktop nav links */}
        <ul className="nav-links">
          {NAV_LINKS.map(({ label, path }) => (
            <li key={label}>
              <Link
                to={path}
                className={`nav-link ${location.pathname === path ? 'nav-link--active' : ''}`}
              >
                {label}
                <span className="nav-link-underline" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side actions */}
        <div className="navbar-actions">
          <div className="availability-badge">
            <span className="availability-dot" />
            <span>Open to work</span>
          </div>

          <button className="btn-socials" onClick={() => setModalOpen(true)}>
            Socials
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Hamburger */}
          <button
            className={`hamburger ${menuOpen ? 'hamburger--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}>
        <ul>
          {NAV_LINKS.map(({ label, path }) => (
            <li key={label}>
              <Link
                to={path}
                className={location.pathname === path ? 'mobile-link--active' : ''}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <button onClick={() => { setModalOpen(true); setMenuOpen(false); }}>
              Socials ↗
            </button>
          </li>
        </ul>
      </div>

      {isModalOpen && <LoginModal onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default Navbar;