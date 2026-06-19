import React, { useState, useRef } from 'react';
import '../pages.css';
import './Contact.css';

const METHODS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>
      </svg>
    ),
    label: 'Email',
    value: 'abirnibir10@gmail.com',
    href: null,
    isEmail: true,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    label: 'LinkedIn',
    value: 'linkedin.com/in/mdabidur',
    href: 'https://www.linkedin.com/in/mdabidur/',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
    label: 'GitHub',
    value: 'github.com/nibirabeer',
    href: 'https://github.com/nibirabeer',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
    label: 'Instagram',
    value: 'instagram.com/nibir.abeer',
    href: 'https://www.instagram.com/nibir.abeer',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    label: 'Facebook',
    value: 'facebook.com/nibir.abeer',
    href: 'https://www.facebook.com/nibir.abeer/',
  },
];

export default function Contact() {
  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const formRef               = useRef(null);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  // Clicking email card scrolls to form and focuses the name field
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      formRef.current?.querySelector('input[name="name"]')?.focus();
    }, 500);
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in your name, email and message.');
      return;
    }
    setLoading(true);

    // ── Formspree setup (free, no backend needed) ────────────
    // 1. Go to https://formspree.io → sign up free
    // 2. Create a new form → set email to abirnibir10@gmail.com
    // 3. Copy your Form ID and replace YOUR_FORM_ID below
    // ────────────────────────────────────────────────────────
    try {
      const res = await fetch('https://formspree.io/f/xzdyynog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name:    form.name,
          email:   form.email,
          subject: form.subject || '(No subject)',
          message: form.message,
        }),
      });

      if (res.ok) {
        setLoading(false);
        setSent(true);
      } else {
        throw new Error('Failed');
      }
    } catch {
      setLoading(false);
      setError('Something went wrong. Email me directly at abirnibir10@gmail.com');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-hero fade-up">
        <p className="page-tag"><span className="page-tag-dot" /> Let's talk</p>
        <h1 className="page-title">Get in <span>Touch</span></h1>
        <p className="page-subtitle">
          Open to collaborations, internships, and exciting projects. Drop me a message and I'll get back to you soon.
        </p>
      </div>

      <div className="page-section">
        <div className="contact-grid">

          {/* Left — contact methods */}
          <div className="fade-up fade-up-1">
            <p className="about-section-label">Reach me at</p>
            <div className="contact-methods">
              {METHODS.map(m =>
                m.isEmail ? (
                  <button
                    key={m.label}
                    className="contact-method-card contact-method-btn card"
                    onClick={scrollToForm}
                  >
                    <span className="contact-method-icon">{m.icon}</span>
                    <div className="contact-method-text">
                      <p className="contact-method-label">{m.label}</p>
                      <p className="contact-method-value">{m.value}</p>
                    </div>
                    <span className="contact-method-hint">Write a message ↓</span>
                  </button>
                ) : (
                  <a
                    key={m.label}
                    href={m.href}
                    className="contact-method-card card"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="contact-method-icon">{m.icon}</span>
                    <div className="contact-method-text">
                      <p className="contact-method-label">{m.label}</p>
                      <p className="contact-method-value">{m.value}</p>
                    </div>
                    <svg className="contact-method-arrow" width="14" height="14" viewBox="0 0 12 12" fill="none">
                      <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                )
              )}
            </div>

            <div className="contact-availability">
              <span className="avail-dot" />
              <p>Currently available for freelance &amp; internship opportunities.</p>
            </div>
          </div>

          {/* Right — form */}
          <div className="fade-up fade-up-2" ref={formRef}>
            {sent ? (
              <div className="card contact-success">
                <div className="contact-success-icon">✓</div>
                <h3>Message sent!</h3>
                <p>Thanks for reaching out. I'll reply within 24–48 hours.</p>
                <button
                  className="contact-submit"
                  onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                >
                  Send another
                </button>
              </div>
            ) : (
              <div className="card contact-form-card">
                <h3 className="contact-form-title">Send a message</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Name *</label>
                    <input className="form-input" type="text" name="name" placeholder="Your name" value={form.name} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input className="form-input" type="email" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input className="form-input" type="text" name="subject" placeholder="What's it about?" value={form.subject} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea className="form-input form-textarea" name="message" placeholder="Tell me more..." rows={5} value={form.message} onChange={handleChange} />
                </div>

                {error && <p className="form-error">{error}</p>}

                <button
                  className={`contact-submit ${loading ? 'contact-submit--loading' : ''}`}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Sending…' : 'Send message ↗'}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}