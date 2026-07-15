import React from 'react';
import './SocialsModal.css';

const GITHUB_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const SOCIALS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/mdabidur',
    img: '/icons/linkedin.png',
    color: '#0077b5',
    bg: '#e8f4fd',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/nibirabeer',
    icon: GITHUB_ICON,
    color: '#111',
    bg: '#f0f0f0',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/nibir.abeer',
    img: '/icons/instagram.png',
    color: '#e1306c',
    bg: '#fce4ec',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/nibir.abeer/',
    img: '/icons/facebook.png',
    color: '#1877f2',
    bg: '#e7f0fd',
  },
];

function SocialsModal({ onClose }) {
  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">

        {/* Header */}
        <div className="modal-header">
          <div>
            <p className="modal-tag">Connect with me</p>
            <h2 className="modal-title">Social Links</h2>
          </div>
          <button className="modal-close-x" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Social cards */}
        <div className="modal-links">
          {SOCIALS.map(s => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-link-card"
              style={{ '--hover-bg': s.bg, '--hover-color': s.color }}
            >
              <div className="modal-link-icon" style={{ background: s.bg }}>
                {s.icon ? s.icon : <img src={s.img} alt={s.label} />}
              </div>
              <span className="modal-link-label">{s.label}</span>
              <svg className="modal-link-arrow" width="14" height="14" viewBox="0 0 12 12" fill="none">
                <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          ))}
        </div>

        {/* Footer */}
        <button className="modal-close-btn" onClick={onClose}>
          Close
        </button>

      </div>
    </div>
  );
}

export default SocialsModal;