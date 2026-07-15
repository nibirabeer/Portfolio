import { useRef } from 'react';
import { scanText } from '../../utils/gsapFx';
import { useFxTrigger } from './useFxTrigger';

// Large display headings — a light-sweep reveals the final color across the text.
export default function ScanText({
  as: Tag = 'span',
  className = '',
  children,
  color = '#111',
  trigger = 'scroll',
  delay = 0,
  ...rest
}) {
  const ref = useRef(null);
  useFxTrigger(ref, () => scanText(ref.current, { color }), { trigger, delay });

  return (
    <Tag ref={ref} className={`fx-hidden ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
