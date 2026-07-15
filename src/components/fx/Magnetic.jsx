import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Wraps `children` in an invisible "pull zone" larger than the element itself
// (via padding + matching negative margin, so it doesn't affect layout) and
// drags the element toward the cursor while inside it, snapping back elastically
// on mouseleave. `overwrite: "auto"` only kills conflicting props (x/y), so this
// stays safe to combine with other tweens (e.g. a hover color transition) on the
// same element.
export default function Magnetic({
  as: Tag = 'div',
  children,
  className = '',
  strength = 0.35,
  zonePadding = 14,
  returnEase = 'elastic.out(1, 0.4)',
  ...rest
}) {
  const zoneRef = useRef(null);
  const elRef = useRef(null);

  useEffect(() => {
    const zone = zoneRef.current;
    const el = elRef.current;
    if (!zone || !el) return undefined;

    const handleMove = (e) => {
      const rect = zone.getBoundingClientRect();
      const x = gsap.utils.mapRange(rect.left, rect.right, -rect.width / 2, rect.width / 2, e.clientX);
      const y = gsap.utils.mapRange(rect.top, rect.bottom, -rect.height / 2, rect.height / 2, e.clientY);
      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    const handleLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: returnEase,
        overwrite: 'auto',
      });
    };

    zone.addEventListener('mousemove', handleMove);
    zone.addEventListener('mouseleave', handleLeave);
    return () => {
      zone.removeEventListener('mousemove', handleMove);
      zone.removeEventListener('mouseleave', handleLeave);
    };
  }, [strength, returnEase]);

  return (
    <div ref={zoneRef} className="mag-zone" style={{ padding: zonePadding, margin: -zonePadding }}>
      <Tag ref={elRef} className={className} {...rest}>
        {children}
      </Tag>
    </div>
  );
}
