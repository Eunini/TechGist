import { useEffect, useRef, useState } from 'react';

/**
 * Reveal component
 * Wrap content you want to fade & slide in on first scroll into view.
 * Props:
 *  - as: element/tag to render (default 'div')
 *  - delay: extra ms delay before animating
 *  - once: animate only first time (default true)
 *  - className: extra classes merged with animation classes
 */
export default function Reveal({
  as: Tag = 'div',
  children,
  delay = 0,
  once = true,
  className = '',
  distance = 32,
  duration = 700,
  threshold = 0.15,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if ('IntersectionObserver' in window === false) {
      // Fallback: just show
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setVisible(true), delay);
            if (once) obs.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay, once, threshold]);

  const base = 'transition-all ease-out will-change-transform opacity-0 translate-y-10';
  const shown = 'opacity-100 translate-y-0';

  return (
    <Tag
      ref={ref}
      style={{ transitionDuration: `${duration}ms` }}
      className={`${base} ${visible ? shown : ''} ${className}`}
    >
      {children}
    </Tag>
  );
}
