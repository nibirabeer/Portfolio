import { useRef } from 'react';
import { scrambleText } from '../../utils/gsapFx';
import { useFxTrigger } from './useFxTrigger';

// Small uppercase labels/tags — characters cycle through random chars before
// resolving into the real text, left to right.
export default function ScrambleText({
  as: Tag = 'span',
  className = '',
  children,
  trigger = 'scroll',
  delay = 0,
  ...rest
}) {
  const ref = useRef(null);
  useFxTrigger(ref, () => scrambleText(ref.current), { trigger, delay });

  return (
    <Tag ref={ref} className={`fx-hidden ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
