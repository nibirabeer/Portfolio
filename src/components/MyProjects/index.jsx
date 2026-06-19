import React, { useEffect, useState, useRef } from 'react';
import './MyProjects.css';

// ── Your projects (manually curated with rich info) ─────────
// These are shown even if GitHub API fails
const STATIC_PROJECTS = [
  {
    name: 'FinWizard',
    description: 'AI-powered personal finance management app with a smart dashboard, OpenAI chat interface, financial planning tools, and live data visualisation.',
    stack: ['React', 'Node.js', 'Firebase', 'OpenAI API'],
    tag: 'AI',
    status: 'In Progress',
    repo: 'https://github.com/nibirabeer',
    demo: null,
    featured: true,
  },
  {
    name: 'Pencraft',
    description: 'A creative writing platform where users can write, share, and collaborate on stories. Built with React and Firebase with real-time sync.',
    stack: ['React', 'Firebase', 'CSS'],
    tag: 'Web',
    status: 'Completed',
    repo: 'https://github.com/nibirabeer/Pencraft',
    demo: null,
    featured: true,
    screenshots: ['/s1.png', '/s2.png'],
  },
  {
    name: 'Banana Equation',
    description: 'Turn-driven Java game using the Banana API. Features LoginGUI, RegisterGUI, GameGUI, Firebase authentication, and a competitive leaderboard.',
    stack: ['Java', 'Firebase', 'Swing', 'Banana API'],
    tag: 'Game',
    status: 'Completed',
    repo: 'https://github.com/nibirabeer',
    demo: null,
    featured: true,
  },
  {
    name: 'Portfolio Website',
    description: 'This very site — a modular React portfolio with animated 3D character, glassmorphism navbar, page routing, cookie consent, and social modal.',
    stack: ['React', 'CSS', 'Firebase', 'Vite'],
    tag: 'Web',
    status: 'In Progress',
    repo: 'https://github.com/nibirabeer',
    demo: null,
    featured: false,
  },
];

const FILTERS = ['All', 'Web', 'AI', 'Game'];

const TAG_COLORS = {
  'Web':  { bg: '#eff6ff', color: '#1d4ed8' },
  'AI':   { bg: '#f5f3ff', color: '#7c3aed' },
  'Game': { bg: '#fef9c3', color: '#854d0e' },
};

const STATUS_COLORS = {
  'Completed':   { bg: '#dcfce7', color: '#15803d' },
  'In Progress': { bg: '#fef9c3', color: '#854d0e' },
};

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`proj-card ${project.featured ? 'proj-card--featured' : ''} ${visible ? 'proj-card--visible' : ''}`}
      style={{ transitionDelay: `${index * 0.07}s` }}
    >
      {/* Top row */}
      <div className="proj-card-top">
        <div className="proj-card-badges">
          <span className="proj-tag" style={{ background: TAG_COLORS[project.tag]?.bg, color: TAG_COLORS[project.tag]?.color }}>
            {project.tag}
          </span>
          <span className="proj-status" style={{ background: STATUS_COLORS[project.status]?.bg, color: STATUS_COLORS[project.status]?.color }}>
            {project.status}
          </span>
        </div>
        <div className="proj-card-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
        </div>
      </div>

      {/* Title + desc */}
      <h3 className="proj-title">{project.name}</h3>
      <p className="proj-desc">{project.description}</p>

      {/* Screenshots if available */}
      {project.screenshots && (
        <div className="proj-screenshots">
          {project.screenshots.map((src, i) => (
            <img key={i} src={src} alt={`${project.name} screenshot ${i + 1}`} className="proj-screenshot" />
          ))}
        </div>
      )}

      {/* Stack pills */}
      <div className="proj-stack">
        {project.stack.map(s => (
          <span className="proj-pill" key={s}>{s}</span>
        ))}
      </div>

      {/* Links */}
      <div className="proj-links">
        <a href={project.repo} className="proj-btn proj-btn--ghost" target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
        {project.demo && (
          <a href={project.demo} className="proj-btn proj-btn--primary" target="_blank" rel="noreferrer">
            Live demo ↗
          </a>
        )}
      </div>
    </div>
  );
}

function MyProjects() {
  const [bgOpacity, setBgOpacity] = useState(0);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const handleScroll = () => {
      const el = document.querySelector('.my-projects');
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top / 300, 0), 1);
      setBgOpacity(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filtered = filter === 'All'
    ? STATIC_PROJECTS
    : STATIC_PROJECTS.filter(p => p.tag === filter);

  return (
    <div
      className="my-projects"
      style={{ backgroundColor: `rgba(0, 0, 0, ${bgOpacity})` }}
    >
      {/* Section header */}
      <div className="proj-header">
        <div>
          <p className="proj-section-tag">
            <span className="proj-section-dot" /> Selected work
          </p>
          <h2 className="proj-section-title">My <span>Projects</span></h2>
          <p className="proj-section-sub">
            Things I've built — from AI apps to games and creative platforms.
          </p>
        </div>

        <a
          href="https://github.com/nibirabeer"
          target="_blank"
          rel="noreferrer"
          className="proj-github-link"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
          View all on GitHub
        </a>
      </div>

      {/* Filter bar */}
      <div className="proj-filters">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`proj-filter-btn ${filter === f ? 'proj-filter-btn--active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="proj-grid">
        {filtered.map((project, i) => (
          <ProjectCard key={project.name} project={project} index={i} />
        ))}
      </div>
    </div>
  );
}

export default MyProjects;