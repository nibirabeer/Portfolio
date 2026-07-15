import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { useGitHubRepos, prettifyName, detectTag, getStack, TAG_STYLE } from '../../hooks/useGitHub';
import './ProjectStack.css';

gsap.registerPlugin(Draggable, InertiaPlugin);

// Distance-based falloff for the center-focused hierarchy: the focused card
// (distance 0) sits at full scale/opacity, and each step out shrinks and
// fades a bit more — gentle enough that five cards (center + two per side)
// stay legible at once, recomputed continuously as the track moves so the
// effect stays smooth through drags, not just snapped between states.
function scaleFor(absDist) {
  return Math.max(0.32, 0.78 ** absDist);
}
function opacityFor(absDist) {
  return Math.max(0, 1 - absDist * 0.22);
}

function SliderCard({ project, innerRef }) {
  return (
    <div className="slider-card" ref={innerRef} style={{ '--card-color': project.color }}>
      <div className="slider-card-top">
        <span className="slider-card-index">{String(project.displayIndex).padStart(2, '0')}</span>
        <span className="slider-card-tag">{project.tag}</span>
      </div>

      <span className="slider-card-watermark" aria-hidden="true">
        {String(project.displayIndex).padStart(2, '0')}
      </span>

      <h3 className="slider-card-title">{project.title}</h3>
      <p className="slider-card-desc">{project.desc}</p>

      <div className="slider-card-stack">
        {project.stack.map((s) => (
          <span key={s} className="slider-card-chip">{s}</span>
        ))}
      </div>

      <a
        href={project.link}
        target="_blank"
        rel="noreferrer"
        className="slider-card-link"
      >
        View project
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>
  );
}

export default function ProjectStack() {
  const { repos, loading } = useGitHubRepos();
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const draggableRef = useRef(null);
  const tickRef = useRef(null);
  const setWidthRef = useRef(0);
  const stepRef = useRef(0);

  // `repos` is already sorted by push recency (API call uses sort=pushed), so
  // showing every one of them, most-recent-first, means the slider reflects
  // whatever's actually been pushed to GitHub rather than a fixed subset.
  // Each card's accent color comes from the same tag→color mapping used on
  // the Projects page, so "Web"/"AI"/"Game" read as the same color everywhere.
  const projects = repos.length
    ? repos.map((r, i) => {
        const tag = detectTag(r);
        return {
          id: r.id,
          title: prettifyName(r.name),
          tag,
          desc: r.description || 'No description provided.',
          stack: getStack(r),
          link: r.homepage || r.html_url,
          displayIndex: i + 1,
          color: TAG_STYLE[tag]?.color || '#555',
        };
      })
    : [];

  // Three back-to-back copies of the set — dragging only ever needs to shift
  // by one set's width in either direction before wrapping, so with three
  // copies there's always a full set of cards in view no matter how far a
  // single drag or throw travels.
  const loopedProjects = projects.length ? [...projects, ...projects, ...projects] : [];

  // Measures the real (CSS-driven, so responsive) distance between two
  // adjacent cards via layout-only `offsetLeft` — immune to the scale
  // transforms the hierarchy effect applies, unlike getBoundingClientRect.
  const measureStep = () => {
    const track = trackRef.current;
    if (!track || track.children.length < 2) return 0;
    return track.children[1].offsetLeft - track.children[0].offsetLeft;
  };

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport || !projects.length) return undefined;

    const step = measureStep();
    const setWidth = step * projects.length;
    setWidthRef.current = setWidth;
    stepRef.current = step;

    const cards = cardRefs.current.filter(Boolean);
    const localCenters = cards.map((el) => el.offsetLeft + el.offsetWidth / 2);

    // Start with the first card of the middle copy centered in the
    // viewport — a clean, obviously-focused opening frame — while still
    // leaving a full set's worth of cards to drag through either direction
    // before any wrap is needed. There's no autoplay: this is the only time
    // the track moves without the user dragging or clicking an arrow.
    const firstMiddleCardCenter = localCenters[projects.length] ?? setWidth;
    gsap.set(track, { x: viewport.offsetWidth / 2 - firstMiddleCardCenter });

    const wrapIfNeeded = () => {
      const x = gsap.getProperty(track, 'x');
      const width = setWidthRef.current;
      if (x <= -width * 2) gsap.set(track, { x: x + width });
      else if (x >= 0) gsap.set(track, { x: x - width });
    };

    const [drag] = Draggable.create(track, {
      type: 'x',
      inertia: true,
      edgeResistance: 0.4,
      snap: { x: gsap.utils.snap(step || 1) },
      onThrowComplete: wrapIfNeeded,
    });
    draggableRef.current = drag;

    // Continuously recompute each card's scale/opacity/stacking from its
    // live distance to the viewport's center — driven off the track's own
    // (GSAP-cached) x, so it costs no DOM reads and stays in sync with
    // whatever's moving it, drag or arrow-triggered tween.
    const tick = () => {
      const trackX = gsap.getProperty(track, 'x');
      const viewportCenter = viewport.offsetWidth / 2;
      const curStep = stepRef.current || 1;
      cards.forEach((el, i) => {
        const dist = (trackX + localCenters[i] - viewportCenter) / curStep;
        const absDist = Math.abs(dist);
        gsap.set(el, {
          scale: scaleFor(absDist),
          opacity: opacityFor(absDist),
          zIndex: Math.round(200 - absDist * 10),
        });
      });
    };
    gsap.ticker.add(tick);
    tickRef.current = tick;

    const onResize = () => {
      const newStep = measureStep();
      if (!newStep) return;
      stepRef.current = newStep;
      setWidthRef.current = newStep * projects.length;
      cards.forEach((el, i) => { localCenters[i] = el.offsetLeft + el.offsetWidth / 2; });
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      gsap.ticker.remove(tick);
      draggableRef.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects.length]);

  // Pause the per-frame hierarchy update while the section is scrolled out
  // of view — pure perf, there's no autoplay to pause/resume here.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!tickRef.current) return;
        if (entry.isIntersecting) gsap.ticker.add(tickRef.current);
        else gsap.ticker.remove(tickRef.current);
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [projects.length]);

  const step = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const stepWidth = measureStep();
    gsap.to(track, {
      x: `-=${dir * stepWidth}`,
      duration: 0.5,
      ease: 'power3.out',
      onComplete: () => {
        const x = gsap.getProperty(track, 'x');
        const width = setWidthRef.current;
        if (x <= -width * 2) gsap.set(track, { x: x + width });
        else if (x >= 0) gsap.set(track, { x: x - width });
      },
    });
  };

  // GitHub fetch failed or returned nothing — skip the section rather than
  // show an empty slider with no cards in it.
  if (!loading && projects.length === 0) return null;

  return (
    <section className="stack-section" ref={sectionRef}>
      <div className="stack-inner">
        <div className="stack-topbar">
          <h2 className="stack-heading">Featured Projects</h2>
          <Link to="/projects" className="stack-cta">
            See all projects ↗
          </Link>
        </div>

        <div className="slider-viewport" ref={viewportRef}>
          {loading ? (
            <div className="slider-track">
              <div className="slider-card slider-card--skeleton">
                <div className="skel" style={{ width: 60, height: 18, borderRadius: 999 }} />
                <div className="skel" style={{ width: '70%', height: 28, borderRadius: 8, marginTop: 18 }} />
                <div className="skel" style={{ width: '90%', height: 14, borderRadius: 6, marginTop: 14 }} />
              </div>
            </div>
          ) : (
            <div className="slider-track" ref={trackRef}>
              {loopedProjects.map((project, i) => (
                <SliderCard
                  key={`${project.id}-${i}`}
                  project={project}
                  innerRef={(el) => { cardRefs.current[i] = el; }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="slider-controls">
          <button
            type="button"
            className="stack-nav stack-nav--prev"
            onClick={() => step(-1)}
            aria-label="Previous project"
          >
            <svg viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button
            type="button"
            className="stack-nav stack-nav--next"
            onClick={() => step(1)}
            aria-label="Next project"
          >
            <svg viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
