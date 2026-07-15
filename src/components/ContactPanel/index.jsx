import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import './ContactPanel.css';

const EMAIL = 'abirnibir10@gmail.com';

// How much faster the exit reverses when it's interrupted mid-entrance
// (closed before it ever finished opening). The reference demo exposes
// this as a live debug slider (#exitSlider) for showcasing the effect —
// on the real site it's just a fixed constant.
const REVERSE_SPEED = 1.5;

const LINKS = [
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/mdabidur',
    href: 'https://www.linkedin.com/in/mdabidur/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    value: 'github.com/nibirabeer',
    href: 'https://github.com/nibirabeer',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
];

// ─── The technique, adapted from GSAP's "interruptible single timeline
// enter/exit" demo ───────────────────────────────────────────────────────
// One timeline holds BOTH halves back to back: enter (panel slides in from
// the right, content items stagger in on top of it), then `.addPause()`,
// then a completely different exit (the panel falls away with a slight
// rotation — not just the entrance in reverse). Forward playback auto-stops
// at the pause once fully open; from there, "close" means playing forward
// into the fall, while "close" during the entrance means reversing the
// entrance itself (faster, via REVERSE_SPEED). `toggle()` picks whichever
// of play/reverse/restart is correct for wherever the playhead currently
// sits, so interrupting it mid-flight always redirects smoothly instead of
// snapping or restarting from scratch.
export default function ContactPanel({ open, onClose }) {
  const wrapRef = useRef(null);
  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const itemRefs = useRef([]);
  const tlRef = useRef(null);
  const enterEndRef = useRef(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    const items = itemRefs.current.filter(Boolean);

    gsap.set(wrap, { visibility: 'hidden', pointerEvents: 'none' });
    gsap.set(backdrop, { opacity: 0 });

    const tl = gsap
      .timeline({ paused: true })
      .set(wrap, { visibility: 'visible', pointerEvents: 'auto' })

      // ═══ ENTER ═══
      .to(
        backdrop,
        { opacity: 1, duration: 0.4, ease: 'power2.out', easeReverse: 'power4.out' },
        0
      )
      .fromTo(
        panel,
        { x: '110%', rotation: 0 },
        { x: '0%', duration: 0.6, ease: 'back.out(1.7)', easeReverse: 'power3.in' },
        0
      )
      .fromTo(
        items,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'expo.out', easeReverse: 'power3.in', stagger: 0.05 },
        0.15
      )

      // ═══ PAUSE — the timeline naturally rests here once fully open ═══
      .addPause();

    enterEndRef.current = tl.duration();

    // ═══ EXIT — the panel falls away with a stray rotation, distinct from
    // just reversing the entrance ═══
    tl.to(panel, {
      y: '110vh',
      rotation: 'random(-14, 14)',
      duration: 0.7,
      ease: 'power3.in',
    })
      .to(backdrop, { opacity: 0, duration: 0.3, ease: 'power2.in' }, '<0.1')
      .set(wrap, { visibility: 'hidden', pointerEvents: 'none' })
      .set(panel, { x: '110%', y: 0, rotation: 0 });

    tlRef.current = tl;
    return () => tl.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (open) {
      if (tl.time() >= enterEndRef.current) {
        tl.timeScale(1).restart();
      } else {
        tl.timeScale(1).play();
      }
    } else if (tl.time() < enterEndRef.current) {
      tl.timeScale(REVERSE_SPEED).reverse();
    } else {
      tl.timeScale(1).play();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  let itemIndex = 0;
  const itemRef = (el) => { itemRefs.current[itemIndex] = el; itemIndex += 1; };

  return (
    <div ref={wrapRef} className="contact-panel" aria-hidden={!open}>
      <div ref={backdropRef} className="contact-panel-backdrop" onClick={onClose} />

      <div ref={panelRef} className="contact-panel-card">
        <button className="contact-panel-close" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div ref={itemRef} className="contact-panel-item">
          <p className="contact-panel-tag">Let's talk</p>
          <h2 className="contact-panel-title">Get in touch</h2>
        </div>

        <div ref={itemRef} className="contact-panel-item contact-panel-availability">
          <span className="contact-panel-dot" />
          Currently available for freelance &amp; internship opportunities.
        </div>

        <a ref={itemRef} href={`mailto:${EMAIL}`} className="contact-panel-item contact-panel-email">
          <span className="contact-panel-email-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" />
            </svg>
          </span>
          <span className="contact-panel-email-text">
            <span className="contact-panel-email-label">Email</span>
            <span className="contact-panel-email-value">{EMAIL}</span>
          </span>
          <svg className="contact-panel-email-arrow" width="14" height="14" viewBox="0 0 12 12" fill="none">
            <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <div ref={itemRef} className="contact-panel-item contact-panel-links">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="contact-panel-link" title={l.label}>
              {l.icon}
            </a>
          ))}
        </div>

        <Link ref={itemRef} to="/contact" className="contact-panel-item contact-panel-cta" onClick={onClose}>
          Open full contact page ↗
        </Link>
      </div>
    </div>
  );
}
