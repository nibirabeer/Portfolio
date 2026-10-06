import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import './RouteWave.css';

gsap.registerPlugin(MorphSVGPlugin);

// Two states of the same single-hump curve, matched point-for-point so
// MorphSVG interpolates cleanly: HIDDEN collapses the whole boundary flat
// against the bottom (zero-height panel, invisible); FULL raises it to the
// top, with its control points overshooting further than its anchor
// points so an elastic ease produces a genuine wave — the middle bulges
// and settles a beat differently than the pinned corners, not just a
// uniform flat curtain sliding up.
const HIDDEN = 'M0,1000 C333,1000 667,1000 1000,1000 L1000,1000 L0,1000 Z';
const FULL   = 'M0,0 C333,-90 667,-90 1000,0 L1000,1000 L0,1000 Z';

const REDUCED_MOTION = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Full-screen wave-curtain transition, played on every internal
// navigation click: the curtain rises to cover the screen, the route
// swaps underneath while hidden, then it bounces back down (elastic
// overshoot) to reveal the new page. Mounted once at the app root, inside
// the router, so it persists across route changes rather than remounting.
export default function RouteWave() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathRef = useRef(null);
  const pathnameRef = useRef(location.pathname);
  const busyRef = useRef(false);

  useEffect(() => {
    pathnameRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    if (REDUCED_MOTION) return undefined;

    const onClick = (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      if (link.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const href = link.getAttribute('href') || '';
      if (!href.startsWith('#/')) return; // only intercept in-app hash routes

      const path = href.slice(1) || '/';
      if (path === pathnameRef.current || busyRef.current) return;

      e.preventDefault();
      busyRef.current = true;

      gsap.timeline({ onComplete: () => { busyRef.current = false; } })
        .set(pathRef.current, { attr: { d: HIDDEN } })
        .to(pathRef.current, {
          duration: 0.55,
          ease: 'power3.inOut',
          morphSVG: FULL,
          onComplete: () => {
            navigate(path);
            window.scrollTo(0, 0);
          },
        })
        .to(pathRef.current, {
          duration: 1,
          ease: 'elastic.out(1, 0.55)',
          morphSVG: HIDDEN,
          delay: 0.08,
        });
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [navigate]);

  return (
    <svg className="route-wave" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
      <path ref={pathRef} className="route-wave-path" d={HIDDEN} />
    </svg>
  );
}
