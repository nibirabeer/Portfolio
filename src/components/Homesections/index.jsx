import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Homesections.css';

// ── 1. SKILLS DATA ───────────────────────────────────────────
const SKILL_ROWS = [
  { name: 'React',        icon: '⚛',  level: 90, color: '#61dafb' },
  { name: 'JavaScript',   icon: 'JS', level: 85, color: '#f7df1e' },
  { name: 'Firebase',     icon: '🔥', level: 85, color: '#ff9500' },
  { name: 'Java',         icon: '☕', level: 80, color: '#f89820' },
  { name: 'Node.js',      icon: '⬡',  level: 72, color: '#6cc24a' },
  { name: 'OpenAI API',   icon: '◎',  level: 75, color: '#10a37f' },
  { name: 'CSS / Tailwind',icon: '✦', level: 88, color: '#38bdf8' },
  { name: 'Git & GitHub', icon: '⌥',  level: 88, color: '#f05032' },
];

// ── 2. STATS DATA ────────────────────────────────────────────
const STATS = [
  { value: 4,    suffix: '+', label: 'Projects Built',      icon: '◈' },
  { value: 2,    suffix: '+', label: 'Years Coding',        icon: '◉' },
  { value: 6,    suffix: '+', label: 'Technologies Used',   icon: '◇' },
  { value: 100,  suffix: '%', label: 'Passion for Building',icon: '♥' },
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
// SECTION 1 — SKILLS
// ════════════════════════════════════════════════════════════
function SkillsSection() {
  const [ref, visible] = useVisible(0.1);

  return (
    <section className="hs-section hs-skills" ref={ref}>
      <div className="hs-inner">

        <div className={`hs-label ${visible ? 'hs-in' : ''}`}>
          <span className="hs-label-dot" />
          What I work with
        </div>

        <div className="hs-skills-layout">
          <div className={`hs-skills-left ${visible ? 'hs-in' : ''}`} style={{ transitionDelay: '0.05s' }}>
            <h2 className="hs-title">Skills &amp;<br /><span>Tech Stack</span></h2>
            <p className="hs-body">
              Technologies I've picked up through projects,
              coursework, and relentless building — from
              front-end interfaces to AI integrations.
            </p>
            <Link to="/skills" className="hs-cta">
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
                  <span className="hs-skill-icon" style={{ color: s.color }}>{s.icon}</span>
                  <span className="hs-skill-name">{s.name}</span>
                  <span className="hs-skill-pct">{s.level}%</span>
                </div>
                <div className="hs-skill-track">
                  <div
                    className="hs-skill-fill"
                    style={{
                      width: visible ? `${s.level}%` : '0%',
                      background: s.color,
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
// SECTION 2 — ABOUT
// ════════════════════════════════════════════════════════════
function AboutSection() {
  const [ref, visible] = useVisible(0.1);

  return (
    <section className="hs-section hs-about" ref={ref}>
      <div className="hs-inner">

        <div className={`hs-label ${visible ? 'hs-in' : ''}`}>
          <span className="hs-label-dot" />
          The person behind the code
        </div>

        <div className="hs-about-layout">

          {/* Left — big card */}
          <div className={`hs-about-card ${visible ? 'hs-in' : ''}`} style={{ transitionDelay: '0.05s' }}>
            <div className="hs-about-avatar">NA</div>
            <div className="hs-about-tag-row">
              <span className="hs-avail-pill">
                <span className="hs-avail-dot" />
                Open to work
              </span>
              <span className="hs-about-loc">📍 United Kingdom</span>
            </div>
            <h3 className="hs-about-name">Nibir Abeer</h3>
            <p className="hs-about-role">Frontend &amp; Full-Stack Developer</p>
            <p className="hs-about-bio">
              When I'm not coding, I'm exploring new frameworks, contributing to coursework projects, or dreaming up the next thing to build.
            </p>
            <div className="hs-about-chips">
              {['React', 'Firebase', 'AI', 'Agile', 'UI/UX'].map(c => (
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
                icon: '◈',
                title: 'Builder',
                body: 'From AI finance apps to Java games — I build things that solve real problems and look great doing it.',
                delay: '0.1s',
              },
              {
                icon: '◉',
                title: 'Learner',
                body: 'Always exploring new frameworks, APIs, and design patterns. Currently deep in React, OpenAI, and agile methodologies.',
                delay: '0.18s',
              },
              {
                icon: '◇',
                title: 'Collaborator',
                body: 'Comfortable in team environments, sprint planning, and code reviews. Open to internships and freelance work.',
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
// SECTION 3 — STATS
// ════════════════════════════════════════════════════════════
function StatsSection() {
  const [ref, visible] = useVisible(0.15);

  return (
    <section className="hs-section hs-stats" ref={ref}>
      <div className="hs-inner">

        <div className={`hs-label hs-label--light ${visible ? 'hs-in' : ''}`}>
          <span className="hs-label-dot hs-label-dot--light" />
          By the numbers
        </div>

        <h2 className={`hs-title hs-title--light ${visible ? 'hs-in' : ''}`} style={{ transitionDelay: '0.05s' }}>
          A few things<br /><span>I'm proud of</span>
        </h2>

        <div className="hs-stats-grid">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`hs-stat-card ${visible ? 'hs-in' : ''}`}
              style={{ transitionDelay: `${0.1 + i * 0.08}s` }}
            >
              <span className="hs-stat-icon">{s.icon}</span>
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

// ════════════════════════════════════════════════════════════
// EXPORT — all three sections
// ════════════════════════════════════════════════════════════
export default function HomeSections() {
  return (
    <>
      <SkillsSection />
      <AboutSection />
      <StatsSection />
    </>
  );
}