import React, { useState, useEffect } from 'react';
import './Preloader.css';

export default function Preloader() {
  const [leaving, setLeaving] = useState(false);
  const [done,    setDone]    = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 2200);
    const t2 = setTimeout(() => setDone(true),    2900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (done) return null;

  return (
    <div className={`preloader ${leaving ? 'preloader--out' : ''}`}>

      <div className="preloader-logo">
        <img src="/l.png" alt="NA logo" />
      </div>

      {/* Bottom progress bar */}
      <div className="preloader-bar">
        <div className="preloader-bar-fill" />
      </div>

    </div>
  );
}
