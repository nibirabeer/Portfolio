import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import './Preloader.css';

gsap.registerPlugin(DrawSVGPlugin);

// Traced from /public/logo.png (autotrace --centerline) — a real vector
// path of the actual logo mark, not a placeholder shape, so DrawSVG has
// genuine stroke geometry to animate rather than a generic box/line.
const LOGO_PATH = 'M321 165C321.789 170.858 322.843 183.944 327.514 187.926C332.493 192.17 339.925 192.079 344.482 197.133C356.291 210.229 365.641 228.157 375.201 243C407.55 293.224 440.55 343.059 473.329 393C487.889 415.182 500.817 438.947 517 460M326 188C316.15 199.084 322 219.262 322 233L322 351L322 706L322 808C322 819.352 325.932 839.464 321.397 849.852C318.707 856.013 299.713 853 294 853L208 853C201.715 853 179.371 856.417 177.318 848.941C172.874 832.76 177 809.821 177 793L177 669L177 269M324 545C331.717 542.719 340.982 544 349 544L398 544L558 544L614 544C619.817 544 630.242 547.159 635.486 544.397C640.003 542.017 638 530.227 638 526L638 472L638 299L638 254C638 249.875 636.338 241 639.028 237.603C642.628 233.058 661.479 236 667 236L752 236C758.414 236 780.315 232.543 782.566 240.059C786.989 254.82 783 276.564 783 292L783 408L783 787M638 546L638 808L638 885L633.928 903L639 924M426 623C451.207 630.206 462.359 660.529 476 681C510.903 733.38 544.329 786.733 579.388 839C593.488 860.021 606.068 895.245 633 901';

const MIN_DURATION = 1400; // ms — guarantees the preloader is never a flash, even on a cached load
const EXIT_DURATION = 750; // ms — must match .preloader--out transition in Preloader.css

export default function Preloader() {
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);
  const fillRef = useRef(null);
  const pathRef = useRef(null);

  // Draw the logo on once, like a pen tracing it, instead of the old
  // scale/fade pop-in.
  useEffect(() => {
    if (!pathRef.current) return undefined;
    const tween = gsap.fromTo(
      pathRef.current,
      { drawSVG: '0%' },
      { drawSVG: '100%', duration: 1.3, ease: 'power2.inOut', delay: 0.15 },
    );
    return () => tween.kill();
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    let current = 0;
    let target = 0;
    let ready = false;
    let rafId;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      if (fillRef.current) fillRef.current.style.width = '100%';
      const wait = Math.max(0, MIN_DURATION - (Date.now() - startTime));
      setTimeout(() => {
        setLeaving(true);
        window.dispatchEvent(new Event('portfolio:loaded'));
        setTimeout(() => setDone(true), EXIT_DURATION);
      }, wait);
    };

    const tick = () => {
      if (!ready && target < 90) target += Math.random() * 6;
      current += (target - current) * 0.12;
      if (fillRef.current) fillRef.current.style.width = `${Math.min(current, 100)}%`;

      if (current >= 99.3 && ready) finish();
      else rafId = requestAnimationFrame(tick);
    };

    Promise.all([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise((resolve) => window.addEventListener('load', resolve, { once: true })),
    ]).then(() => {
      ready = true;
      target = 100;
    });

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  if (done) return null;

  return (
    <div className={`preloader ${leaving ? 'preloader--out' : ''}`}>

      <div className="preloader-logo">
        <svg viewBox="0 0 960 1088" role="img" aria-label="Nibir Abeer logo">
          <path
            ref={pathRef}
            d={LOGO_PATH}
            fill="none"
            stroke="#111"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Bottom progress bar — width driven by real asset-load progress */}
      <div className="preloader-bar">
        <div className="preloader-bar-fill" ref={fillRef} />
      </div>

    </div>
  );
}
