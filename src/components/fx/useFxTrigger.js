import { useEffect } from 'react';
import { onEnterView } from '../../utils/gsapFx';

// Shared scheduling for the fx components: either fires shortly after mount
// ('mount' — for above-the-fold hero text) or once the element scrolls into
// view ('scroll' — for everything below the fold), with an optional delay.
export function useFxTrigger(ref, run, { trigger = 'scroll', delay = 0 } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timeoutId;
    let cleanup;

    const fire = () => { timeoutId = setTimeout(run, delay * 1000); };

    if (trigger === 'mount') {
      fire();
    } else {
      cleanup = onEnterView(el, fire);
    }

    return () => {
      clearTimeout(timeoutId);
      if (cleanup) cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, delay]);
}
