// hooks/useDebounce.ts
import { useState, useEffect, useRef } from 'react';

export default function useDebounce(value, delay = 1000) {
  const [debounced, setDebounced] = useState(value);
  const timer = useRef();

  const cancel = () => { timer.current && clearTimeout(timer.current); };
  const flush = () => { cancel(); setDebounced(null); };

  useEffect(() => {
    cancel();
    const timeoutId = setTimeout(() => {
      timer.current = undefined;
      setDebounced(value);
    }, delay);

    timer.current = timeoutId;

    return () => {
      clearTimeout(timeoutId);

      if (timer.current === timeoutId) {
        timer.current = undefined;
      }
    };
  }, [value, delay]);

  return [debounced, { cancel, flush }];
}