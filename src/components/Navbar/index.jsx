import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import './Navbar.css';
import SocialsModal from '../SocialsModal';
import ContactPanel from '../ContactPanel';
import RadialNav from '../RadialNav';
import { Magnetic } from '../fx';

const NAV_LINKS = [
  { label: 'Projects', path: '/projects' },
  { label: 'Skills',   path: '/skills'   },
  { label: 'About',    path: '/about'    },
  { label: 'Contact',  path: '/contact'  },
];

const Navbar = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isContactOpen, setContactOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [collapsed, setCollapsed]   = useState(false);
  const [menuOpen, setMenuOpen]      = useState(false);
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
      // Past roughly one viewport — on the home page this lines up with the
      // shuffling project deck — the top bar folds away into the radial FAB.
      setCollapsed(window.scrollY > window.innerHeight * 0.85);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // The navbar is centered via CSS `left: 50%` + `transform: translateX(-50%)`.
  // Once GSAP writes its own inline transform for the collapse animation it
  // fully replaces that CSS transform, so `xPercent: -50` re-asserts the same
  // centering offset as part of every GSAP-composed transform from here on.
  useEffect(() => { gsap.set(navRef.current, { xPercent: -50 }); }, []);

  // Fold the top bar away (toward the corner the FAB grows out of) whenever
  // it collapses, and bring it back when scrolling back up past the threshold.
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    if (collapsed) {
      setMenuOpen(false);
      gsap.to(el, {
        xPercent: -50,
        autoAlpha: 0,
        y: -14,
        scale: 0.92,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => gsap.set(el, { pointerEvents: 'none' }),
      });
    } else {
      gsap.set(el, { pointerEvents: 'auto' });
      gsap.to(el, { xPercent: -50, autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.4)', delay: 0.1 });
    }
  }, [collapsed]);

  return (
    <>
      <nav ref={navRef} className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-mark">
            <img src="/logo.png" alt="Logo" />
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

          <Magnetic as="button" className="btn-socials" onClick={() => setModalOpen(true)} strength={0.35}>
            Socials
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Magnetic>

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

      <RadialNav
        visible={collapsed}
        onSocialsClick={() => setModalOpen(true)}
        onContactClick={() => setContactOpen(true)}
      />

      {isModalOpen && <SocialsModal onClose={() => setModalOpen(false)} />}
      <ContactPanel open={isContactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
};

export default Navbar;
