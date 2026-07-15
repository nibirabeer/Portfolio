import React, { useState } from 'react';
import '../pages.css';
import './Projects.css';
import {
  useGitHubRepos,
  prettifyName,
  detectTag,
  detectStatus,
  getStack,
  TAG_STYLE,
} from '../hooks/useGitHub';
import { VERCEL_LINKS, PRIVATE_PROJECTS } from '../config/vercelLinks';
import { PROJECT_STATUS } from '../config/projectStatus';
import { ScrambleText, ScanText, RevealText } from '../components/fx';
import PageBackground from '../components/PageBackground';

function getVercelUrl(repoName) {
  const key = Object.keys(VERCEL_LINKS).find(
    k => k.toLowerCase() === repoName.toLowerCase()
  );
  return key ? VERCEL_LINKS[key] : null;
}

function getStatus(repo) {
  // Manual override in projectStatus.js takes priority
  const manual = Object.keys(PROJECT_STATUS).find(
    k => k.toLowerCase() === repo.name.toLowerCase()
  );
  if (manual) return PROJECT_STATUS[manual];
  // Auto: 1 commit = In Progress; multiple commits + Vercel = Completed
  return detectStatus(repo, !!getVercelUrl(repo.name));
}

const FILTERS = ['All', 'Web', 'AI', 'Game'];

const STATUS_STYLE = {
  'Completed':   { bg: '#dcfce7', color: '#15803d' },
  'In Progress': { bg: '#fef9c3', color: '#854d0e' },
  'Archived':    { bg: '#f3f4f6', color: '#6b7280' },
};

const GH_ICON = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

function SkeletonCard() {
  return (
    <div className="card proj-card" style={{ gap: 14 }}>
      <div style={{ display:'flex', justifyContent:'space-between' }}>
        <div className="skel" style={{ width: 80, height: 20, borderRadius: 999 }} />
        <div className="skel" style={{ width: 90, height: 20, borderRadius: 999 }} />
      </div>
      <div className="skel" style={{ width: '60%', height: 26, borderRadius: 8, marginTop: 6 }} />
      <div className="skel" style={{ width: '100%', height: 14, borderRadius: 6 }} />
      <div className="skel" style={{ width: '80%', height: 14, borderRadius: 6 }} />
      <div style={{ display:'flex', gap: 6, marginTop: 4 }}>
        <div className="skel" style={{ width: 60, height: 22, borderRadius: 999 }} />
        <div className="skel" style={{ width: 70, height: 22, borderRadius: 999 }} />
      </div>
    </div>
  );
}

export default function Projects() {
  const { repos, loading, error } = useGitHubRepos();
  const [active, setActive] = useState('All');

  const publicProjects = repos.map(r => ({
    title:     prettifyName(r.name),
    tag:       detectTag(r),
    status:    getStatus(r),
    desc:      r.description || 'No description provided.',
    stack:     getStack(r),
    year:      new Date(r.created_at).getFullYear().toString(),
    stars:     r.stargazers_count,
    repo:      r.html_url,
    demo:      getVercelUrl(r.name) || r.homepage || null,
    featured:  r.stargazers_count > 0,
    isPrivate: false,
  }));

  // Merge private Vercel projects — skip any whose title already appears in public list
  const publicTitles = new Set(publicProjects.map(p => p.title.toLowerCase()));
  const privateProjects = PRIVATE_PROJECTS
    .filter(p => !publicTitles.has(p.title.toLowerCase()))
    .map(p => ({ ...p, stars: 0, featured: false, isPrivate: true }));

  const projects = [...publicProjects, ...privateProjects];

  const filtered = active === 'All'
    ? projects
    : projects.filter(p => p.tag === active);

  return (
    <div className="page-wrapper">
      <PageBackground variant="grid" />
      <div className="page-hero">
        <p className="page-tag">
          <span className="page-tag-dot" />
          <ScrambleText as="span" trigger="mount" delay={0.1}>Selected work</ScrambleText>
        </p>
        <h1 className="page-title">
          <ScanText as="span" trigger="mount" delay={0.3} color="#111">My</ScanText>{' '}
          <ScanText as="span" trigger="mount" delay={0.5} color="#aaa">Projects</ScanText>
        </h1>
        <RevealText as="p" className="page-subtitle" trigger="mount" delay={0.7}>
          Live from GitHub — every public repo I've built, updated automatically.
        </RevealText>
      </div>

      <div className="page-section">

        {/* Filter bar + GitHub link */}
        <div className="proj-topbar fade-up fade-up-1">
          <div className="proj-filters">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`proj-filter-btn ${active === f ? 'proj-filter-btn--active' : ''}`}
                onClick={() => setActive(f)}
              >
                {f}
                {f !== 'All' && !loading && (
                  <span className="proj-filter-count">
                    {projects.filter(p => p.tag === f).length}
                  </span>
                )}
              </button>
            ))}
          </div>
          <a
            href="https://github.com/nibirabeer"
            target="_blank"
            rel="noreferrer"
            className="proj-github-btn"
          >
            {GH_ICON}
            All repos ↗
          </a>
        </div>

        <div className="page-divider" />

        {/* Error state */}
        {error && (
          <div className="proj-empty">
            <p>Couldn't load GitHub repos right now.</p>
            <a href="https://github.com/nibirabeer" target="_blank" rel="noreferrer" className="proj-link proj-link--ghost" style={{ marginTop: 12, display:'inline-flex' }}>
              {GH_ICON} View on GitHub
            </a>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid-2">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty filter state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="proj-empty">
            <p>No projects tagged "{active}" yet — check back soon!</p>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && (
          <div className="grid-2">
            {filtered.map((p, i) => (
              <div
                className={`card proj-card fade-up fade-up-${(i % 4) + 1} ${p.featured ? 'proj-card--featured' : ''}`}
                key={p.repo}
              >
                <div className="proj-card-header">
                  <div className="proj-card-badges">
                    <span className="proj-year">{p.year}</span>
                    <span
                      className="pill proj-tag-pill"
                      style={{ background: TAG_STYLE[p.tag]?.bg, color: TAG_STYLE[p.tag]?.color }}
                    >
                      {p.tag}
                    </span>
                  </div>
                  <span
                    className="pill"
                    style={{ background: STATUS_STYLE[p.status].bg, color: STATUS_STYLE[p.status].color }}
                  >
                    {p.status}
                  </span>
                </div>

                {p.featured && <div className="proj-featured-badge">★ Featured</div>}

                <h3 className="proj-title">{p.title}</h3>
                <p className="proj-desc">{p.desc}</p>

                <div className="proj-stack">
                  {p.stack.map(s => <span className="pill" key={s}>{s}</span>)}
                </div>

                <div className="proj-links">
                  {p.stars > 0 && (
                    <span className="proj-stars">★ {p.stars}</span>
                  )}
                  {p.isPrivate ? (
                    <span className="proj-link proj-link--private">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      Private repo
                    </span>
                  ) : (
                    <a href={p.repo} className="proj-link proj-link--ghost" target="_blank" rel="noreferrer">
                      {GH_ICON} GitHub
                    </a>
                  )}
                  {p.demo ? (
                    <a href={p.demo} className="proj-link proj-link--primary" target="_blank" rel="noreferrer">
                      Live demo
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  ) : (
                    <span className="proj-link proj-link--disabled">No live demo</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
