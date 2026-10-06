import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGitHubRepos, prettifyName, detectTag, getStack } from '../../hooks/useGitHub';
import { VERCEL_LINKS, PRIVATE_PROJECTS } from '../../config/vercelLinks';
import './ProjectStack.css';

const STACK_ACCENT = { Web: '#171717', AI: '#525252', Game: '#777777' };
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function timeAgo(dateStr) {
  if (!dateStr) return null;
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days < 1) return 'Updated today';
  if (days === 1) return 'Updated 1d ago';
  if (days < 30) return `Updated ${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `Updated ${months}mo ago`;
  return `Updated ${Math.floor(months / 12)}y ago`;
}

function getVercelUrl(repoName) {
  const key = Object.keys(VERCEL_LINKS).find((name) => name.toLowerCase() === repoName.toLowerCase());
  return key ? VERCEL_LINKS[key] : null;
}

function getHomepageUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    if (!['http:', 'https:'].includes(url.protocol) || ['github.com', 'www.github.com'].includes(url.hostname.toLowerCase())) return null;
    return url.href;
  } catch { return null; }
}

function offsetFromActive(index, activeIndex, total) {
  let offset = index - activeIndex;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
}

function StackBackground() {
  return (
    <div className="stack-bg" aria-hidden="true">
      <span className="stack-bg-grid" />
      <span className="stack-bg-orb stack-bg-orb--a" />
      <span className="stack-bg-orb stack-bg-orb--b" />
    </div>
  );
}

function SliderCard({ project, index, active, position, offset, onPointerMove, onPointerLeave }) {
  return (
    <article
      className={`slider-card slider-card--${position}${active ? ' slider-card--active' : ''}`}
      style={{ '--card-color': project.color, '--card-offset': `${offset * 58}%` }}
      data-project-index={index}
      data-position={position}
      aria-hidden={position === 'hidden'}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerCancel={onPointerLeave}
    >
      <div className="slider-card-art" aria-hidden="true">
        <span className="slider-card-art-grid" />
        <span className="slider-card-art-orb slider-card-art-orb--one" />
        <span className="slider-card-art-orb slider-card-art-orb--two" />
        <span className="slider-card-watermark">{String(index + 1).padStart(2, '0')}</span>
        <span className="slider-card-index">PROJECT / {String(index + 1).padStart(2, '0')}</span>
        <span className="slider-card-tag">{project.tag}</span>
      </div>
      <div className="slider-card-content">
        <h3 className="slider-card-title">{project.title}</h3>
        <p className="slider-card-desc">{project.desc}</p>
        <div className="slider-card-stack">
          {project.stack.slice(0, 4).map((item) => <span key={item} className="slider-card-chip">{item}</span>)}
        </div>
        <div className="slider-card-bottom">
          {project.updatedLabel && <span className="slider-card-meta">{project.updatedLabel}</span>}
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="slider-card-link"
            tabIndex={position === 'hidden' ? -1 : undefined}
          >
            {project.isLive ? 'Live demo' : 'View on GitHub'}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="slider-card slider-card--skeleton" aria-hidden="true">
      <div className="skel" style={{ width: 86, height: 14, borderRadius: 999 }} />
      <div className="skel" style={{ width: '72%', height: 30, borderRadius: 8, marginTop: 138 }} />
      <div className="skel" style={{ width: '92%', height: 14, borderRadius: 6, marginTop: 14 }} />
      <div className="skel" style={{ width: '68%', height: 14, borderRadius: 6, marginTop: 8 }} />
    </div>
  );
}

export default function ProjectStack() {
  const { repos, loading, error, retry } = useGitHubRepos();
  const [activeIndex, setActiveIndex] = useState(0);
  const swipeRef = useRef(null);
  const suppressClickRef = useRef(false);

  const hasLiveUrl = (repo) => Boolean(getHomepageUrl(repo.homepage) || getVercelUrl(repo.name));
  const publicProjects = [...repos]
    .sort((a, b) => Number(hasLiveUrl(b)) - Number(hasLiveUrl(a)))
    .map((repo) => {
      const vercelUrl = getVercelUrl(repo.name);
      const demoUrl = getHomepageUrl(repo.homepage) || vercelUrl;
      return {
        id: repo.id,
        title: prettifyName(repo.name),
        tag: detectTag(repo),
        desc: repo.description || 'No description provided.',
        stack: getStack(repo),
        link: demoUrl || repo.html_url,
        isLive: Boolean(demoUrl),
        color: STACK_ACCENT[detectTag(repo)] || '#525252',
        updatedLabel: timeAgo(repo.pushed_at),
      };
    });

  const privateProjects = PRIVATE_PROJECTS.map((project) => ({
    id: `private-${project.title}`,
    title: project.title,
    tag: project.tag,
    desc: project.desc,
    stack: project.stack || [],
    link: project.demo,
    isLive: Boolean(project.demo),
    color: STACK_ACCENT[project.tag] || '#525252',
    updatedLabel: null,
  }));
  const projects = [...privateProjects, ...publicProjects];
  const total = projects.length;

  useEffect(() => {
    setActiveIndex((current) => (total ? current % total : 0));
  }, [total]);

  const step = (amount) => {
    if (total < 2) return;
    setActiveIndex((current) => (current + amount + total) % total);
  };

  const handlePointerDown = (event) => {
    if (event.target.closest('a, button')) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    swipeRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event) => {
    const start = swipeRef.current;
    if (!start || start.id !== event.pointerId) return;
    swipeRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) < 42 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    suppressClickRef.current = true;
    window.setTimeout(() => { suppressClickRef.current = false; }, 0);
    step(deltaX < 0 ? 1 : -1);
  };

  const handlePointerMove = (event) => {
    if (event.pointerType === 'touch' || event.currentTarget.dataset.position !== 'active' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
    const y = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
    card.style.setProperty('--tilt-x', `${((0.5 - y) * 4).toFixed(2)}deg`);
    card.style.setProperty('--tilt-y', `${((x - 0.5) * 5).toFixed(2)}deg`);
  };

  const resetPointer = (event) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <section className="stack-section" aria-labelledby="stack-heading">
      <StackBackground />
      <div className="stack-inner">
        <div className="stack-topbar">
          <div>
            <p className="stack-eyebrow">A selection of recent work</p>
            <h2 id="stack-heading" className="stack-heading">Featured projects<span>.</span></h2>
          </div>
          <Link to="/projects" className="stack-cta">See all projects <span aria-hidden="true">↗</span></Link>
        </div>

        {error && (
          <div className="stack-notice" role="status">
            <span>{repos.length ? 'Showing saved GitHub projects. ' : 'GitHub projects could not be reached. '}{error}</span>
            <button type="button" onClick={retry}>Retry</button>
            <a href="https://github.com/nibirabeer" target="_blank" rel="noreferrer">Open GitHub</a>
          </div>
        )}

        <div className="slider-frame">
          <div
            className="slider-viewport"
            aria-label="Featured projects carousel"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => { swipeRef.current = null; }}
          >
            {loading && projects.length === 0 ? (
              <div className="slider-track"><SkeletonCard /></div>
            ) : projects.length ? (
              <div className="slider-track" aria-live="polite">
                {projects.map((project, index) => {
                  const offset = offsetFromActive(index, activeIndex, total);
                  const position = offset === 0 ? 'active' : Math.abs(offset) === 1 ? (offset < 0 ? 'previous' : 'next') : 'hidden';
                  return (
                    <SliderCard
                      key={project.id}
                      project={project}
                      index={index}
                      active={offset === 0}
                      position={position}
                      offset={offset}
                      onPointerMove={handlePointerMove}
                      onPointerLeave={resetPointer}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="stack-empty" role="status">No projects are available right now. Visit GitHub to see the latest work.</div>
            )}
          </div>

          {total > 0 && (
            <div className="slider-controls">
              <span className="slider-count" aria-live="polite">
                <strong>{String(activeIndex + 1).padStart(2, '0')}</strong>
                <span className="slider-count-divider" />
                {String(total).padStart(2, '0')}
              </span>
              <div className="slider-control-buttons">
                <button type="button" className="stack-nav" onClick={() => step(-1)} aria-label="Previous project">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button type="button" className="stack-nav" onClick={() => step(1)} aria-label="Next project">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
              <span className="slider-hint">Use arrows or swipe to explore</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
