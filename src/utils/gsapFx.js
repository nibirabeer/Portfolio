import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// Wraps the element's text in an aria-hidden inner span so screen readers get
// the real text via aria-label instead of the animated/garbled DOM mutations.
function prepareFxContainer(el) {
  const finalText = el.textContent.trim();
  el.setAttribute('aria-label', finalText);
  el.textContent = '';
  const inner = document.createElement('span');
  inner.setAttribute('aria-hidden', 'true');
  inner.textContent = finalText;
  el.appendChild(inner);
  el.style.opacity = '1';
  return { inner, finalText };
}

export function scrambleText(el, { duration = 0.8 } = {}) {
  if (!el) return () => {};
  const { inner, finalText } = prepareFxContainer(el);

  let progress = 0;
  const speed = finalText.length / (duration * 40) || 1;
  const interval = setInterval(() => {
    progress += speed;
    const visibleLength = Math.min(finalText.length, Math.ceil(progress));
    inner.textContent = finalText
      .split('')
      .slice(0, visibleLength)
      .map((letter, index) => {
        if (letter === ' ') return ' ';
        if (index < progress - 2) return finalText[index];
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      })
      .join('');
    if (progress >= finalText.length + 2) {
      inner.textContent = finalText;
      clearInterval(interval);
    }
  }, 24);

  return () => clearInterval(interval);
}

export function scanText(el, { duration, color = '#111' } = {}) {
  if (!el) return;
  const { inner } = prepareFxContainer(el);
  inner.classList.add('fx-scan');
  inner.style.setProperty('--scan-color', color);
  gsap.set(inner, { '--scan-x': '0%' });

  const dur = duration ?? gsap.utils.clamp(0.5, 1.3, el.getBoundingClientRect().width / 420);
  gsap.to(inner, {
    '--scan-x': '100%',
    duration: dur,
    ease: 'power2.out',
    onComplete: () => {
      inner.style.setProperty('background-image', 'none', 'important');
      inner.style.setProperty('color', color, 'important');
      inner.style.setProperty('-webkit-text-fill-color', color, 'important');
    },
  });
}

export function revealText(el, { stagger = 0.03, duration = 0.6 } = {}) {
  if (!el) return;
  const { inner, finalText } = prepareFxContainer(el);
  inner.textContent = '';

  const letters = [];
  finalText.split(' ').forEach((word, wi, arr) => {
    const wordWrap = document.createElement('span');
    wordWrap.style.display = 'inline-block';
    wordWrap.style.whiteSpace = 'nowrap';
    word.split('').forEach((char) => {
      const mask = document.createElement('span');
      mask.style.display = 'inline-block';
      mask.style.overflow = 'hidden';
      mask.style.verticalAlign = 'top';
      const letter = document.createElement('span');
      letter.style.display = 'inline-block';
      letter.textContent = char;
      mask.appendChild(letter);
      wordWrap.appendChild(mask);
      letters.push(letter);
    });
    inner.appendChild(wordWrap);
    if (wi < arr.length - 1) inner.appendChild(document.createTextNode(' '));
  });

  gsap.set(letters, { autoAlpha: 0, yPercent: 100 });
  gsap.to(letters, {
    autoAlpha: 1,
    yPercent: 0,
    duration,
    ease: 'power3.out',
    stagger: { amount: Math.min(0.7, letters.length * stagger), from: 'start' },
  });
}

// Runs `callback(el)` once the element scrolls into view. Returns a cleanup fn.
export function onEnterView(el, callback, { start = 'top 85%' } = {}) {
  if (!el) return () => {};
  const trigger = ScrollTrigger.create({
    trigger: el,
    start,
    once: true,
    onEnter: () => callback(el),
  });
  return () => trigger.kill();
}
