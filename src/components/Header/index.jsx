import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Background from '../Background';
import './Header.css';

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_TEXT = 'NIBIR ABEER · NIBIR ABEER · NIBIR ABEER · NIBIR ABEER · ';

function Header() {
  const containerRef = useRef(null);

  // Hero blurs and fades out as the user scrolls past it into the next section.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        filter: 'blur(28px)',
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <Background>
      <div className="header-container relative flex items-center justify-center" ref={containerRef}>

        {/* Infinite left-to-right scrolling text — behind the character */}
        <div className="marquee-wrapper" aria-hidden="true">
          <div className="marquee-track">
            <span>{MARQUEE_TEXT}</span>
            <span>{MARQUEE_TEXT}</span>
          </div>
        </div>

        {/* Character image — sits in front of the marquee */}
        <img
          src="/hero-character.png"
          alt="Header Image"
          className="header-image object-cover"
        />

      </div>
    </Background>
  );
}

export default Header;
