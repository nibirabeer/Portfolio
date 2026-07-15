import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import './RadialNav.css';

const ITEMS = [
  {
    key: 'projects',
    label: 'Projects',
    path: '/projects',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    key: 'skills',
    label: 'Skills',
    path: '/skills',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M5 21V10M12 21V3M19 21V14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'about',
    label: 'About',
    path: '/about',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.7" />
        <path d="M4.5 20c1.5-4.2 4-6.2 7.5-6.2s6 2 7.5 6.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'contact',
    label: 'Contact',
    path: null,
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M4 6.5l8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const SOCIALS_ICON = (
  <svg viewBox="0 0 24 24" fill="none">
    <path
      d="M9 15l6-6M8.5 13.5l-2 2a3 3 0 004.24 4.24l2.5-2.5M15.5 10.5l2-2a3 3 0 00-4.24-4.24l-2.5 2.5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RADIUS = 96;
const SLOT_COUNT = ITEMS.length + 1; // +1 for the trailing Socials button

// The FAB now lives permanently at the right edge, so the fan always opens
// as a fixed 90° arc from directly-left to directly-up — away from the
// edge, never off-screen.
function computePositions() {
  const start = 180;
  const end = 270;
  return Array.from({ length: SLOT_COUNT }, (_, i) => {
    const deg = start + ((end - start) * i) / (SLOT_COUNT - 1);
    const rad = (deg * Math.PI) / 180;
    return { x: Math.cos(rad) * RADIUS, y: Math.sin(rad) * RADIUS };
  });
}

export default function RadialNav({ visible, onSocialsClick, onContactClick }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const wrapRef = useRef(null);
  const menuIconRef = useRef(null);
  const closeIconRef = useRef(null);
  const itemRefs = useRef([]);

  // The FAB sits permanently at the right edge (see CSS). It only animates
  // in/out when `visible` flips — a slide-in from the right combined with
  // the scale/rotate pop, so it reads as arriving from off-screen rather
  // than just fading in place.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (visible) {
      gsap.set(el, { pointerEvents: 'auto' });
      gsap.to(el, { autoAlpha: 1, scale: 1, rotate: 0, x: 0, duration: 0.6, ease: 'back.out(1.6)', delay: 0.1 });
    } else {
      gsap.to(el, {
        autoAlpha: 0,
        scale: 0.4,
        rotate: -90,
        x: 40,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => gsap.set(el, { pointerEvents: 'none' }),
      });
    }
  }, [visible]);

  // Close the radial fan whenever the FAB itself is hidden (scrolled back up).
  useEffect(() => {
    if (!visible) setOpen(false);
  }, [visible]);

  // Fan the satellite items out/in around the FAB, and crossfade the FAB's
  // own icon between the menu (hamburger) glyph and the close (×) glyph.
  useEffect(() => {
    const items = itemRefs.current.filter(Boolean);
    const menuIcon = menuIconRef.current;
    const closeIcon = closeIconRef.current;

    if (open) {
      const positions = computePositions();
      gsap.to(menuIcon, { opacity: 0, rotate: 90, duration: 0.3, ease: 'power2.inOut' });
      gsap.to(closeIcon, { opacity: 1, rotate: 0, duration: 0.4, ease: 'back.out(2)' });
      gsap.set(items, { pointerEvents: 'auto' });
      gsap.to(items, {
        x: (i) => positions[i].x,
        y: (i) => positions[i].y,
        scale: 1,
        opacity: 1,
        rotate: 0,
        duration: 0.55,
        ease: 'back.out(1.7)',
        stagger: 0.045,
      });
    } else {
      gsap.to(menuIcon, { opacity: 1, rotate: 0, duration: 0.3, ease: 'power2.inOut' });
      gsap.to(closeIcon, { opacity: 0, rotate: -90, duration: 0.3, ease: 'power2.inOut' });
      gsap.to(items, {
        x: 0,
        y: 0,
        scale: 0,
        opacity: 0,
        rotate: -45,
        duration: 0.32,
        ease: 'power2.in',
        stagger: { each: 0.035, from: 'end' },
        onComplete: () => gsap.set(items, { pointerEvents: 'none' }),
      });
    }
  }, [open]);

  // Escape closes the fan; so does scrolling back up (handled above).
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div ref={wrapRef} className="radial-nav" aria-hidden={!visible}>
      {open && <div className="radial-backdrop" onClick={() => setOpen(false)} />}

      {ITEMS.map((item, i) => (
        item.path ? (
          <Link
            key={item.key}
            to={item.path}
            ref={(el) => { itemRefs.current[i] = el; }}
            className={`radial-item ${location.pathname === item.path ? 'radial-item--active' : ''}`}
            aria-label={item.label}
            onClick={() => setOpen(false)}
          >
            {item.icon}
          </Link>
        ) : (
          <button
            key={item.key}
            type="button"
            ref={(el) => { itemRefs.current[i] = el; }}
            className="radial-item"
            aria-label={item.label}
            onClick={() => { onContactClick(); setOpen(false); }}
          >
            {item.icon}
          </button>
        )
      ))}

      <button
        ref={(el) => { itemRefs.current[ITEMS.length] = el; }}
        type="button"
        className="radial-item radial-item--socials"
        aria-label="Socials"
        onClick={() => { onSocialsClick(); setOpen(false); }}
      >
        {SOCIALS_ICON}
      </button>

      <button
        type="button"
        className="radial-fab"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <svg ref={menuIconRef} className="radial-fab-icon radial-fab-icon--menu" viewBox="0 0 24 24" fill="none">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <svg ref={closeIconRef} className="radial-fab-icon radial-fab-icon--close" viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
