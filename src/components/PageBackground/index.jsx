import React, { useEffect, useRef } from 'react';
import './PageBackground.css';

// Grid of dots that gently breathes in a slow diagonal wave — Projects.
function drawGrid(ctx, w, h, t) {
  const spacing = 34;
  ctx.clearRect(0, 0, w, h);
  const cols = Math.ceil(w / spacing) + 1;
  const rows = Math.ceil(h / spacing) + 1;
  for (let i = 0; i < cols; i += 1) {
    for (let j = 0; j < rows; j += 1) {
      const x = i * spacing;
      const y = j * spacing;
      const wave = Math.sin(t + i * 0.5 + j * 0.4) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.arc(x, y, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(17,17,17,${0.035 + wave * 0.055})`;
      ctx.fill();
    }
  }
}

// Floating nodes that link up with faint lines when close — Skills.
function makeConstellation() {
  const count = 30;
  return Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    dx: (Math.random() - 0.5) * 0.00045,
    dy: (Math.random() - 0.5) * 0.00045,
  }));
}

function drawConstellation(ctx, w, h, nodes) {
  ctx.clearRect(0, 0, w, h);
  nodes.forEach((n) => {
    n.x += n.dx;
    n.y += n.dy;
    if (n.x < 0 || n.x > 1) n.dx *= -1;
    if (n.y < 0 || n.y > 1) n.dy *= -1;
  });
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      const dx = (a.x - b.x) * w;
      const dy = (a.y - b.y) * h;
      const dist = Math.hypot(dx, dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(a.x * w, a.y * h);
        ctx.lineTo(b.x * w, b.y * h);
        ctx.strokeStyle = `rgba(17,17,17,${0.09 * (1 - dist / 130)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
  nodes.forEach((n) => {
    ctx.beginPath();
    ctx.arc(n.x * w, n.y * h, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(17,17,17,0.2)';
    ctx.fill();
  });
}

// Slow undulating horizontal lines — About.
function drawWaves(ctx, w, h, t) {
  const lineCount = 7;
  ctx.clearRect(0, 0, w, h);
  for (let l = 0; l < lineCount; l += 1) {
    const baseY = (h / (lineCount + 1)) * (l + 1);
    ctx.beginPath();
    for (let x = 0; x <= w; x += 8) {
      const y = baseY + Math.sin(x * 0.008 + t + l * 0.8) * 14;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(17,17,17,${0.045 + (l % 2) * 0.02})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

// Expanding pulse rings from one corner, like a signal going out — Contact.
function drawRadar(ctx, w, h, t) {
  ctx.clearRect(0, 0, w, h);
  const cx = w * 0.85;
  const cy = h * 0.12;
  const maxR = Math.max(w, h) * 0.95;
  for (let k = 0; k < 3; k += 1) {
    const phase = ((t * 0.12) + k / 3) % 1;
    const r = phase * maxR;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(17,17,17,${0.13 * (1 - phase)})`;
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }
}

export default function PageBackground({ variant = 'grid' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let animId;
    let t = 0;
    const nodes = variant === 'constellation' ? makeConstellation() : null;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = () => {
      t += 0.012;
      if (variant === 'grid') drawGrid(ctx, width, height, t);
      else if (variant === 'constellation') drawConstellation(ctx, width, height, nodes);
      else if (variant === 'waves') drawWaves(ctx, width, height, t);
      else if (variant === 'radar') drawRadar(ctx, width, height, t);
      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [variant]);

  return (
    <div className="page-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="page-bg-canvas" />
    </div>
  );
}
