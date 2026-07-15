import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomeSections.css';
import { ScrambleText, ScanText, RevealText } from '../fx';

// ── 1. SKILLS DATA — trimmed to fit a single pinned panel ─────
const SKILL_ROWS = [
  { name: 'React',           icon: 'Re', level: 90 },
  { name: 'JavaScript',      icon: 'JS', level: 85 },
  { name: 'Java',            icon: 'Jv', level: 80 },
  { name: 'Firebase',        icon: 'Fb', level: 85 },
  { name: 'SQL & Databases', icon: 'DB', level: 80 },
  { name: 'Node.js',         icon: 'Nd', level: 72 },
];

// ── 2. STATS DATA ────────────────────────────────────────────
const STATS = [
  { value: 6,   suffix: '+', label: 'Projects Shipped'    },
  { value: 3,   suffix: '+', label: 'Years Coding'        },
  { value: 12,  suffix: '+', label: 'Technologies'        },
  { value: 360, suffix: '',  label: 'Academic Credits'    },
];

// ── Intersection observer hook ───────────────────────────────
function useVisible(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ── Animated counter ─────────────────────────────────────────
function Counter({ target, suffix, active }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(start);
    }, 30);
    return () => clearInterval(timer);
  }, [active, target]);
  return <>{val}{suffix}</>;
}

// ════════════════════════════════════════════════════════════
// PANEL 1 — SKILLS (dark)
// ════════════════════════════════════════════════════════════
function SkillsSection() {
  const [ref, visible] = useVisible(0.1);

  return (
    <section className="hs-section hs-skills" ref={ref}>
      <div className="hs-inner">

        <div className="hs-label hs-label--light">
          <span className="hs-label-dot hs-label-dot--light" />
          <ScrambleText as="span">What I work with</ScrambleText>
        </div>

        <div className="hs-skills-layout">
          <div className="hs-skills-left">
            <h2 className="hs-title hs-title--light">
              <ScanText as="span" color="#fff">Skills &amp;</ScanText><br />
              <ScanText as="span" color="rgba(255,255,255,0.3)" delay={0.15}>Tech Stack</ScanText>
            </h2>
            <RevealText as="p" className="hs-body hs-body--light" delay={0.3}>
              Technologies picked up through three years of BSc Computer Science,
              personal projects, and hands-on building.
            </RevealText>
            <Link to="/skills" className="hs-cta hs-cta--white">
              Full skill breakdown ↗
            </Link>
          </div>

          <div className="hs-skills-right">
            {SKILL_ROWS.map((s, i) => (
              <div
                key={s.name}
                className={`hs-skill-row ${visible ? 'hs-in' : ''}`}
                style={{ transitionDelay: `${0.08 + i * 0.055}s` }}
              >
                <div className="hs-skill-meta">
                  <span className="hs-skill-icon">{s.icon}</span>
                  <span className="hs-skill-name">{s.name}</span>
                  <span className="hs-skill-pct">{s.level}%</span>
                </div>
                <div className="hs-skill-track">
                  <div
                    className="hs-skill-fill"
                    style={{
                      width: visible ? `${s.level}%` : '0%',
                      transitionDelay: `${0.15 + i * 0.06}s`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════
// PANEL 2 — ABOUT (light)
// ════════════════════════════════════════════════════════════
function AboutSection() {
  const [ref, visible] = useVisible(0.1);

  return (
    <section className="hs-section hs-about" ref={ref}>
      <div className="hs-inner">

        <div className="hs-label">
          <span className="hs-label-dot" />
          <ScrambleText as="span">The person behind the code</ScrambleText>
        </div>

        <div className="hs-about-layout">

          {/* Left — bio card */}
          <div className={`hs-about-card ${visible ? 'hs-in' : ''}`} style={{ transitionDelay: '0.05s' }}>
            <div className="hs-about-avatar">NA</div>
            <div className="hs-about-tag-row">
              <span className="hs-avail-pill">
                <span className="hs-avail-dot" />
                Open to work
              </span>
              <span className="hs-about-loc">United Kingdom</span>
            </div>
            <h3 className="hs-about-name">Nibir Abeer</h3>
            <p className="hs-about-role">Full-Stack Developer · BSc Computer Science (2:1)</p>
            <p className="hs-about-bio">
              Graduate of the University of Bedfordshire, specialising in full-stack development,
              AI integration, distributed systems, and information security.
            </p>
            <div className="hs-about-chips">
              {['React', 'Node.js', 'Firebase', 'AI', 'Security', 'Agile'].map(c => (
                <span key={c} className="hs-chip">{c}</span>
              ))}
            </div>
            <Link to="/about" className="hs-cta hs-cta--dark">
              More about me ↗
            </Link>
          </div>

          {/* Right — highlights */}
          <div className="hs-about-highlights">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="13.6" y="2.9" width="4.2" height="7.4" rx="1.1" transform="rotate(45 15.7 6.6)" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M13 9L5.4 16.6a1.6 1.6 0 000 2.26l.74.74a1.6 1.6 0 002.26 0L16 11.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                title: 'Builder',
                body: 'From AI finance apps to Java games — I build things that solve real problems.',
                delay: '0.1s',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 4L2 9l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                    <path d="M6 11v4.5c0 1.38 2.69 2.5 6 2.5s6-1.12 6-2.5V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M20 9v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                ),
                title: 'Learner',
                body: 'Constantly exploring distributed systems, cloud architecture, and AI integration.',
                delay: '0.18s',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="8.3" cy="7.6" r="2.7" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M3.2 19c0-3 2.4-5 5.1-5s5.1 2 5.1 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <circle cx="16.3" cy="8.6" r="2.2" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M14.9 12.3c2.7.35 4.3 2.1 4.3 4.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                ),
                title: 'Collaborator',
                body: 'Experienced in Agile environments — open to full-time roles and freelance work.',
                delay: '0.26s',
              },
            ].map(h => (
              <div
                key={h.title}
                className={`hs-highlight-card ${visible ? 'hs-in' : ''}`}
                style={{ transitionDelay: h.delay }}
              >
                <span className="hs-highlight-icon">{h.icon}</span>
                <div>
                  <p className="hs-highlight-title">{h.title}</p>
                  <p className="hs-highlight-body">{h.body}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════
// PANEL 3 — STATS (dark)
// ════════════════════════════════════════════════════════════
function StatsSection() {
  const [ref, visible] = useVisible(0.15);

  return (
    <section className="hs-section hs-stats" ref={ref}>
      <div className="hs-inner">

        <div className="hs-label hs-label--light">
          <span className="hs-label-dot hs-label-dot--light" />
          <ScrambleText as="span">By the numbers</ScrambleText>
        </div>

        <h2 className="hs-title hs-title--light">
          <ScanText as="span" color="#fff">A few things</ScanText><br />
          <ScanText as="span" color="rgba(255,255,255,0.3)" delay={0.15}>I'm proud of</ScanText>
        </h2>

        <div className="hs-stats-grid">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`hs-stat-card ${visible ? 'hs-in' : ''}`}
              style={{ transitionDelay: `${0.1 + i * 0.08}s` }}
            >
              <p className="hs-stat-value">
                <Counter target={s.value} suffix={s.suffix} active={visible} />
              </p>
              <p className="hs-stat-label">{s.label}</p>
            </div>
          ))}
        </div>

        <div className={`hs-stats-cta-row ${visible ? 'hs-in' : ''}`} style={{ transitionDelay: '0.5s' }}>
          <Link to="/contact" className="hs-cta hs-cta--white">
            Let's work together ↗
          </Link>
          <Link to="/projects" className="hs-cta hs-cta--outline">
            See my projects
          </Link>
        </div>

      </div>
    </section>
  );
}

export default function HomeSections() {
  return (
    <div className="hs-stack">
      <SkillsSection />
      <AboutSection />
      <StatsSection />
    </div>
  );
}
