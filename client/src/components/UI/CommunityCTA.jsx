import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import PropTypes from 'prop-types';

const metrics = [
  { label: 'Developers', value: 8200, suffix: '+', accent: 'from-emerald-500 to-teal-400' },
  { label: 'Articles', value: 470, suffix: '+', accent: 'from-green-500 to-emerald-400' },
  { label: 'Monthly Reads', value: 120000, suffix: '+', accent: 'from-teal-500 to-cyan-400' },
  { label: 'Open Source Projects', value: 65, suffix: '+', accent: 'from-lime-500 to-green-400' }
];

function useRevealCounter(target, end, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target.current) return;
    let observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const start = performance.now();
          const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setVal(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(target.current);
    return () => observer && observer.disconnect();
  }, [end, duration, target]);
  return val;
}

function MetricCard({ item }) {
  const ref = useRef(null);
  const val = useRevealCounter(ref, item.value);
  const display = item.value > 1000 && val !== item.value
    ? (val / 1000).toFixed(1) + 'k'
    : val.toLocaleString();
  return (
    <div
      ref={ref}
      className={`
        group relative p-5 rounded-xl
        bg-white/80 dark:bg-white/5
        backdrop-blur-sm border
        border-gray-200 dark:border-white/10
        hover:border-emerald-400 dark:hover:border-white/25
        transition-colors overflow-hidden
        shadow-md dark:shadow-none
      `}
    >
      <div className={`
        absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity
        bg-gradient-to-br ${item.accent} mix-blend-overlay
      `} />
      <div className="relative">
        <p className="text-3xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-500 dark:from-white dark:to-white/70 bg-clip-text text-transparent">
            {display}{val === item.value ? item.suffix : ''}
          </span>
        </p>
        <p className="mt-1 text-sm uppercase tracking-wide text-gray-700 dark:text-white/70 font-medium">{item.label}</p>
        <div className="mt-4 h-1 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 dark:from-white/80 dark:to-white/40 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (val / item.value) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

MetricCard.propTypes = {
  item: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    suffix: PropTypes.string.isRequired,
    accent: PropTypes.string.isRequired,
  }).isRequired,
};

export default function CommunityCTA() {
  return (
    <section className="relative overflow-hidden isolate">
      {/* Backgrounds */}
      <div className="absolute -top-32 -left-32 w-[480px] h-[480px] bg-gradient-to-br from-emerald-200/40 to-teal-200/30 dark:from-emerald-500/30 dark:to-teal-500/30 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute -bottom-40 -right-20 w-[520px] h-[520px] bg-gradient-to-tr from-green-200/25 via-lime-200/25 to-emerald-200/25 dark:from-green-500/25 dark:via-lime-500/25 dark:to-emerald-500/25 rounded-full blur-3xl animate-float-slower" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(16,185,129,0.08),transparent_60%)] dark:bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.08),transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-6 py-28 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-700 via-teal-700 to-green-600 dark:from-white dark:via-white dark:to-white/70 bg-clip-text text-transparent drop-shadow-sm">
            Grow Faster With A Community That Ships
          </h2>
          <p className="mt-6 text-lg md:text-xl text-gray-700 dark:text-white/70 leading-relaxed">
            Dive into collabs, sharpen your craft, and turn ideas into production-ready projects. We’re building the place where learning, building, and shipping intersect.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
          {metrics.map(m => <MetricCard key={m.label} item={m} />)}
        </div>

        <div className="mt-14 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/explore-topics">
            <Button
              size="xl"
              className="relative group !bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 border-0 shadow-lg hover:shadow-emerald-500/40 transition-shadow text-white"
            >
              <span className="relative z-10 flex items-center gap-2 font-semibold">
                Explore Topics
                <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
              </span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_70%)]" />
            </Button>
          </Link>
          <Link to="/about">
            <Button
              size="xl"
              color="light"
              outline={true}
              className="!border-emerald-400 !text-emerald-700 dark:!border-white/30 dark:!text-white hover:!bg-emerald-50 dark:hover:!bg-white/10"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
