import React from 'react';
import './LoginModal.css';

const SOCIALS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/mdabidur',
    img: '/in.png',
    color: '#0077b5',
    bg: '#e8f4fd',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/nibirabeer/nibirabeer',
    img: '/g.png',
    color: '#111',
    bg: '#f0f0f0',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/nibir.abeer',
    img: '/i.png',
    color: '#e1306c',
    bg: '#fce4ec',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/nibir.abeer/',
    img: '/f.png',
    color: '#1877f2',
    bg: '#e7f0fd',
  },
];

function LoginModal({ onClose }) {
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
                <img src={s.img} alt={s.label} />
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

export default LoginModal;