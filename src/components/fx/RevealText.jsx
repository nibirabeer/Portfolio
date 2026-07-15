import { useRef } from 'react';
import { revealText } from '../../utils/gsapFx';
import { useFxTrigger } from './useFxTrigger';

// Body copy / subtitles — each letter rises out of a mask, staggered left to right.
export default function RevealText({
  as: Tag = 'p',
  className = '',
  children,
  trigger = 'scroll',
  delay = 0,
  ...rest
}) {
  const ref = useRef(null);
  useFxTrigger(ref, () => revealText(ref.current), { trigger, delay });

  return (
    <Tag ref={ref} className={`fx-hidden ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
