import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Background from '../Background';
import './Header.css';

gsap.registerPlugin(ScrollTrigger);

function Header() {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        filter: 'blur(20px)',
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <Background>
      <header className="header-container" ref={containerRef}>
        <div className="hero-side-meta hero-side-meta--left">
          <span className="hero-hud-mark" aria-hidden="true" />
          <span>PORTFOLIO / 2026</span>
        </div>
        <div className="hero-side-meta hero-side-meta--right">
          <span className="hero-location-mark" aria-hidden="true" />
          <span>UNITED KINGDOM</span>
        </div>

        <div className="hero-content">
          <div className="hero-copy">
            <p className="hero-eyebrow"><span /> OPEN TO DEVELOPER OPPORTUNITIES</p>
            <h1 className="hero-title">Full-stack developer <span>building useful web products.</span></h1>
            <p className="hero-intro">
              I’m Nibir Abeer, a Computer Science graduate from the University of Bedfordshire.
              I build responsive applications with React, Node.js and Firebase.
            </p>
            <div className="hero-skills" aria-label="Core technologies">
              <span>React</span><span>Node.js</span><span>Firebase</span><span>Java</span>
            </div>
            <div className="hero-actions">
              <Link to="/projects" className="hero-button hero-button--primary">
                Explore my work <span aria-hidden="true">↗</span>
              </Link>
              <Link to="/contact" className="hero-button hero-button--secondary">Get in touch</Link>
            </div>
            <p className="hero-qualification">BSc Computer Science <span>·</span> University of Bedfordshire</p>
          </div>

          <div className="hero-visual" aria-label="Portrait illustration of Nibir Abeer">
            <span className="hero-visual-orbit hero-visual-orbit--outer" aria-hidden="true" />
            <span className="hero-visual-orbit hero-visual-orbit--inner" aria-hidden="true" />
            <span className="hero-visual-index" aria-hidden="true">NA <span>01 — DEVELOPER</span></span>
            <img src="/hero-character.png" alt="Illustrated portrait of Nibir Abeer" className="header-image" />
            <span className="hero-visual-caption" aria-hidden="true">BUILDING FOR THE WEB</span>
          </div>
        </div>
      </header>
    </Background>
  );
}

export default Header;
